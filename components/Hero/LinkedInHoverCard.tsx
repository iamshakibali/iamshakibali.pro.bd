"use client";

import { NumberTicker } from "@/components/motion/number";

export function LinkedInHoverCard() {
  return (
    <div className="flex h-[143px] w-full flex-col items-start">
      <div className="flex w-full items-start justify-between">
        <div className="size-[64px] shrink-0 overflow-hidden rounded-[300px] bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/linkedin-avatar.png" alt="Shakib Ali" width={64} height={64} draggable={false} className="size-full object-cover" />
        </div>
        <div className="shrink-0 rounded-full bg-[#0a66c2] px-[16px] py-[10px]">
          <p className="whitespace-nowrap text-[14.4px] font-semibold leading-[14.4px] tracking-[-0.288px] text-white">Follow</p>
        </div>
      </div>
      <div className="flex w-full items-center gap-[6px] pt-[12px]">
        <p className="shrink-0 text-[17.6px] font-medium leading-[17.6px] tracking-[-0.8766px] text-[#171717] dark:text-zinc-100" style={{ fontFamily: "var(--font-overused-grotesk)" }}>
          Shakib
        </p>
        <span className="size-[16px] shrink-0 text-black/75 dark:text-white">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full" aria-hidden>
            <path d="M7.99333 14.6667L7.17333 14.3733C4.07333 13.2067 1.99333 10.6667 1.99333 7.33333V3.33333L8 1.33333L14 3.33333V7.33333C14 10.6667 11.9267 13.2067 8.84 14.3733L7.99333 14.6667ZM3.33333 4.29333V7.33333C3.33333 10.0733 5.06667 12.2333 7.64 13.2L8 13.3333L8.38667 13.2C10.94 12.2333 12.6667 10.0667 12.6667 7.33333V4.29333L8 2.74667L3.33333 4.29333ZM11.3333 5.33333H9.62L6.94 8.67333L5.48667 7.22L4.54667 8.16L7.04667 10.66L11.3333 5.32667V5.33333Z" fill="currentColor"/>
          </svg>
        </span>
      </div>
      <div className="w-full pt-[4px]">
        <p className="whitespace-nowrap text-[14.4px] font-normal leading-[14.4px] tracking-[-0.288px] text-[#737373] dark:text-zinc-400">@iamshakibali</p>
      </div>
      <div className="flex w-full gap-6 pt-[16px]">
        <p className="whitespace-nowrap text-[14.4px] leading-[14.4px] tracking-[-0.288px]">
          <span className="font-semibold text-[#0a66c2] dark:text-[#70b5ff]"><NumberTicker value={844} className="align-middle" /></span>
          <span className="font-normal text-[#0a66c2] dark:text-[#70b5ff]"> Followers</span>
        </p>
        <p className="whitespace-nowrap text-[14.4px] leading-[14.4px] tracking-[-0.288px]">
          <span className="font-semibold text-[#0a66c2] dark:text-[#70b5ff]"><NumberTicker value={500} suffix="+" className="align-middle" /></span>
          <span className="font-normal text-[#0a66c2] dark:text-[#70b5ff]"> Connection</span>
        </p>
      </div>
    </div>
  );
}
