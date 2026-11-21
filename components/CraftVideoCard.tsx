"use client";

// A craft piece: autoplaying muted video with an optional round "open live
// site" button. aspect = the video's own width / height, so the card reserves
// its space before the video loads instead of collapsing and jumping.
export function CraftVideoCard({
  src,
  href,
  aspect,
}: {
  src: string;
  href?: string;
  aspect: string;
}) {
  return (
    <>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        draggable={false}
        className="block w-full opacity-0 transition-opacity duration-500 data-[ready=true]:opacity-100"
        style={{ aspectRatio: aspect }}
        // the page is prerendered, so the video can finish loading
        // before hydration attaches listeners — check readyState on
        // mount too, otherwise a missed event leaves it invisible
        ref={(el) => {
          if (el && el.readyState >= 2) el.dataset.ready = "true";
        }}
        onLoadedData={(e) => {
          e.currentTarget.dataset.ready = "true";
        }}
      />
      {href ? (
        <div className="absolute bottom-4 right-4">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open live site"
            className="group flex size-10 items-center justify-center rounded-full bg-white/80 text-black shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-[transform,background-color] duration-300 ease-out hover:scale-105 hover:bg-white active:scale-95"
          >
            <svg viewBox="0 0 256 256" className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden fill="none" stroke="currentColor" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round">
              <line x1="64" y1="192" x2="192" y2="64" />
              <polyline points="88 64 192 64 192 168" />
            </svg>
          </a>
        </div>
      ) : null}
    </>
  );
}
