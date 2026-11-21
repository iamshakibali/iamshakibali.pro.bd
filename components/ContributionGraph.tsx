"use client";

import { useEffect, useRef, useState } from "react";
import { NumberTicker } from "@/components/motion/number";
import { Contribution3D } from "@/components/Contribution3D";
import { useWelcomeDone } from "@/components/WelcomeDoneContext";
import {
  fetchContributions,
  readCachedContributions,
  type ContributionsPayload,
} from "@/lib/github-contributions";

// month labels for the x-axis — approximate guide; the real data span is close
const MONTHS = [
  { label: "Sep", week: 0 },
  { label: "Oct", week: 5 },
  { label: "Nov", week: 9 },
  { label: "Dec", week: 13 },
  { label: "Jan", week: 18 },
  { label: "Feb", week: 22 },
  { label: "Mar", week: 26 },
  { label: "Apr", week: 31 },
  { label: "May", week: 35 },
  { label: "Jun", week: 39 },
];

// GitHub's quartile colour bands (0 = none, 1–3 = low, 4–8 = mid,
// 9–14 = high, 15+ = peak)
const LEVEL_BG = [
  "bg-neutral-200 dark:bg-[#181818]",
  "bg-neutral-300 dark:bg-[#333]",
  "bg-neutral-400 dark:bg-[#666]",
  "bg-neutral-500 dark:bg-[#adadad]",
  "bg-neutral-900 dark:bg-white",
];

const GAP = 3;
const WEEKS = 41; // 10px cells: 41 weeks × 13px = 530px — the most that fits the 540px column
const CELL = 10;
const PITCH = CELL + GAP;

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 14) return 3;
  return 4;
}

export function ContributionGraph() {
  const welcomeDone = useWelcomeDone();
  const [data, setData] = useState<{
    weeks: { count: number; label: string }[][];
    months: { label: string; week: number }[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ count: number; label: string } | null>(null);
  // click the grid → it flies forward and tilts into a 3D view
  const [origin3d, setOrigin3d] = useState<HTMLElement | null>(null);
  const view3d = origin3d !== null;
  const gridRef = useRef<HTMLDivElement>(null);
  const open3d = (el: HTMLElement | null) => {
    if (!el) return;
    setOrigin3d(el);
  };

  // fetch real GitHub contributions via the public API and group by
// Sun–Sat weeks so the visual pattern matches the real graph exactly
  useEffect(() => {
    let cancelled = false;

    const build = (json: ContributionsPayload) => {
        const groups: { count: number; label: string }[][] = [];
        let week: { count: number; label: string }[] = [];
        for (const entry of json.contributions) {
          const date = new Date(entry.date);
          if (date.getDay() === 0 && week.length > 0) {
            groups.push(week);
            week = [];
          }
          week.push({
            count: entry.count,
            label: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          });
        }
        if (week.length > 0) groups.push(week);
        // take the latest weeks that fit at 10px cells
        const weeks = groups.slice(-WEEKS);
        // compute month labels from the actual data
        const months: { label: string; week: number }[] = [];
        const seen = new Set<string>();
        weeks.forEach((w, wi) => {
          const first = w.find(Boolean);
          if (!first) return;
          const m = first.label.split(" ")[0];
          if (!seen.has(m)) {
            seen.add(m);
            months.push({ label: m, week: wi });
          }
        });
        const total = json.contributions.reduce((s, c) => s + c.count, 0);
        setData({ weeks, months, total });
        setLoading(false);
    };

    // show the last good payload instantly, then refresh in the background
    const cached = readCachedContributions();
    const hadCache = !!cached;
    if (cached) build(cached);

    fetchContributions()
      .then((json) => {
        if (!cancelled) build(json);
      })
      .catch(() => {
        // keep cached real data rather than replacing it with the fallback
        if (cancelled || hadCache) return;
        // API unavailable — fall back to the designed static data
        const DAYS = 287;
        const weeks: { count: number; label: string }[][] = [];
        const start = new Date(2025, 8, 1);
        for (let w = 0; w < WEEKS; w++) {
          const week: { count: number; label: string }[] = [];
          for (let d = 0; d < 7; d++) {
            const seed = Math.sin(w * 127.1 + d * 311.7) * 43758.5453;
            const t = seed - Math.floor(seed);
            // produce a realistic-looking spread 0–18
            const count = t < 0.5 ? 0 : Math.round(t * 18);
            const date = new Date(start);
            date.setDate(date.getDate() + w * 7 + d);
            week.push({
              count,
              label: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            });
          }
          weeks.push(week);
        }
        setData({ weeks, months: MONTHS, total: 280 });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // when the graph overflows (mobile), start centred so both sides clip evenly
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, [data]);

  if (loading) {
    // keep the same height while the API call is in-flight
    return <div className="h-[137px] w-full" />;
  }

  const weeks = data?.weeks;
  const months = data?.months ?? MONTHS;
  if (!weeks) {
    // API failed — show nothing rather than wrong data
    return <div className="h-[137px] w-full" />;
  }

  const total = data?.total ?? 0;
  // "Aug 7, 2026" → month / day / year so the date digits can roll too
  const dateParts = hover?.label.match(/^(\S+) (\d+), (\d+)$/);

  return (
    <div className="relative w-full select-none">
      {/* easter-egg hint: a scribbled note + arrow nudging people to click */}
      {!view3d && welcomeDone && (
        <button
          type="button"
          onClick={() => open3d(gridRef.current)}
          aria-label="Click the graph to see it in 3D"
          // phones: above the graph's top-right, arrow curling down into it.
          // sm+: out in the empty margin right of the graph, arrow pointing back
          className="absolute -top-9 right-0 z-10 flex animate-[hint-bob_2.4s_ease-in-out_infinite] items-start gap-0.5 text-neutral-500 transition-colors hover:text-foreground motion-reduce:animate-none sm:left-full sm:right-auto sm:top-6 sm:ml-3 sm:flex-row-reverse sm:gap-1 dark:text-neutral-400"
        >
          <span className="rotate-[-8deg] whitespace-nowrap text-right font-mono text-[10px] leading-tight sm:rotate-[6deg] sm:text-left">
            psst… click me
            <span className="block">for some magic ✦</span>
          </span>
          {/* hand-drawn arrow curling down toward the grid */}
          <svg viewBox="0 0 32 32" className="mt-3 size-6 sm:-mt-2 sm:rotate-[60deg] sm:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 4c10 0 18 6 18 20" />
            <path d="M17 19l5 6 5-6" />
          </svg>
        </button>
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={gridRef}
          role="button"
          tabIndex={0}
          aria-label="View contributions in 3D"
          onClick={(e) => open3d(e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open3d(e.currentTarget);
            }
          }}
          className="min-w-max cursor-pointer outline-none"
        >
          <div
            className="relative mb-[10px] h-[15px]"
            style={{ width: WEEKS * PITCH - GAP }}
          >
            {months.map(({ label, week }) => (
              <span
                key={label}
                className="absolute top-0 whitespace-nowrap font-mono text-[10px] leading-none text-neutral-500 dark:text-neutral-400"
                style={{ left: week * PITCH }}
              >
                {label}
              </span>
            ))}
          </div>
          {/* hidden (instantly, no fade) while the 3D copy is out, so the
              copy can swap back in place without a double image */}
          <div data-graph-cells className={`flex flex-col gap-[3px] ${view3d ? "invisible" : ""}`}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="flex gap-[3px]">
                {weeks.map((week, wIdx) => {
                  const cell = week[day];
                  if (!cell) return <div key={wIdx} style={{ width: CELL, height: CELL }} />;
                  return (
                    <div
                      key={wIdx}
                      className={`shrink-0 rounded-[2px] ${LEVEL_BG[countToLevel(cell.count)]}`}
                      style={{ width: CELL, height: CELL }}
                      onPointerEnter={() =>
                        setHover({ count: cell.count, label: cell.label })
                      }
                      onPointerLeave={() => setHover(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {origin3d && (
        <Contribution3D
          weeks={weeks}
          total={total}
          origin={origin3d}
          onClosed={() => setOrigin3d(null)}
        />
      )}
      <p className="mt-[9px] font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
        {welcomeDone ? (
          <>
            {/* mounted only after the loader so the roll isn't spent behind it;
                stays mounted so hover-out rolls back instead of replaying */}
            <NumberTicker
              value={hover ? hover.count : total}
              suffix={
                hover
                  ? ` ${hover.count === 1 ? "contribution" : "contributions"} on`
                  : " contributions in the last year"
              }
              className="align-middle"
              startOnView={false}
            />
            {hover &&
              (dateParts ? (
                <>
                  {" "}
                  {dateParts[1]}{" "}
                  <NumberTicker value={Number(dateParts[2])} className="align-middle" />
                  {", "}
                  <NumberTicker value={Number(dateParts[3])} className="align-middle" />
                </>
              ) : (
                ` ${hover.label}`
              ))}
          </>
        ) : hover ? (
          `${hover.count} ${hover.count === 1 ? "contribution" : "contributions"} on ${hover.label}`
        ) : (
          `${total} contributions in the last year`
        )}
      </p>
    </div>
  );
}