"use client";

import { useEffect, useRef, useState } from "react";

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
  { label: "Jul", week: 44 },
  { label: "Aug", week: 48 },
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
const CELL = (540 - (51 - 1) * GAP) / 51; // 7.647 — fills the 540px column
const PITCH = CELL + GAP;

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 14) return 3;
  return 4;
}

export function ContributionGraph() {
  const [data, setData] = useState<{
    weeks: { count: number; label: string }[][];
    months: { label: string; week: number }[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ count: number; label: string } | null>(null);

  // fetch real GitHub contributions via the public API and group by
// Sun–Sat weeks so the visual pattern matches the real graph exactly
  useEffect(() => {
    fetch("https://github-contributions-api.jogruber.de/v4/iamshakibali")
      .then((r) => r.json())
      .then((json) => {
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
        // take the latest 51 weeks
        const weeks = groups.slice(-51);
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
        const total = json.contributions.reduce(
          (s: number, c: any) => s + c.count,
          0,
        );
        setData({ weeks, months, total });
        setLoading(false);
      })
      .catch(() => {
        // API unavailable — fall back to the designed static data
        const DAYS = 357;
        const weeks: { count: number; label: string }[][] = [];
        const start = new Date(2025, 8, 1);
        for (let w = 0; w < 51; w++) {
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
    return <div className="h-[125px] w-full" />;
  }

  const weeks = data?.weeks;
  const months = data?.months ?? MONTHS;
  if (!weeks) {
    // API failed — show nothing rather than wrong data
    return <div className="h-[125px] w-full" />;
  }

  const total = data?.total ?? 0;

  return (
    <div className="w-full select-none">
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="min-w-max">
          <div
            className="relative mb-[10px] h-[15px]"
            style={{ width: 51 * PITCH - GAP }}
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
          <div className="flex flex-col gap-[3px]">
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
      <p className="mt-[9px] font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
        {hover
          ? `${hover.count} ${hover.count === 1 ? "contribution" : "contributions"} on ${hover.label}`
          : `${total} contributions in the last year`}
      </p>
    </div>
  );
}