"use client";

import { NumberTicker } from "@/components/motion/number";

export function XHoverCard() {
  return (
    <div className="flex h-[175px] w-[290px] flex-col items-start rounded-[12px] bg-white p-[16px] shadow-[0px_53px_79px_rgba(0,0,0,0.1)] dark:bg-zinc-900">
      {/* Header: avatar + Follow pill */}
      <div className="flex w-full items-start justify-between">
        <div className="size-[64px] shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/x-avatar.png"
            alt="Shakib Ali"
            width={64}
            height={64}
            draggable={false}
            className="size-full scale-[1.45] object-cover object-[58%_22%]"
          />
        </div>
        <div className="shrink-0 rounded-full bg-black px-[16px] py-[10px] dark:bg-white">
          <p className="whitespace-nowrap text-[14.4px] font-semibold leading-[14.4px] tracking-[-0.288px] text-white dark:text-black">
            Follow
          </p>
        </div>
      </div>

      {/* Name + verified */}
      <div className="flex w-full items-center gap-[6px] pt-[12px]">
        <p
          className="shrink-0 text-[17.6px] font-medium leading-[17.6px] tracking-[-0.8766px] text-[#171717] dark:text-zinc-100"
          style={{ fontFamily: "var(--font-overused-grotesk)" }}
        >
          Shakib
        </p>
        <span className="size-[16px] shrink-0">
          <svg viewBox="0 0 13.6669 13.6669" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full" aria-hidden>
            <path d="M13.6669 6.83345C13.6538 6.36364 13.5105 5.90618 13.2524 5.51273C12.9949 5.12 12.6327 4.80582 12.2065 4.60655C12.3687 4.16509 12.4029 3.68727 12.3084 3.22691C12.2131 2.76582 11.9905 2.34109 11.6669 2C11.3251 1.67636 10.9011 1.45455 10.44 1.35855C9.97964 1.264 9.50182 1.29818 9.06036 1.46036C8.86182 1.03345 8.54836 0.670545 8.15491 0.413091C7.76145 0.155636 7.304 0.0116364 6.83345 0C6.36364 0.0123636 5.90764 0.154909 5.51491 0.413091C5.12218 0.671273 4.81018 1.03418 4.61309 1.46036C4.17091 1.29818 3.69164 1.26255 3.22982 1.35855C2.768 1.45309 2.34255 1.67564 2.00073 2C1.67709 2.34182 1.456 2.76727 1.36218 3.22764C1.26764 3.688 1.304 4.16582 1.46691 4.60655C1.04 4.80582 0.676364 5.11927 0.417455 5.512C0.158545 5.90473 0.0138182 6.36291 0 6.83345C0.0145455 7.304 0.158545 7.76145 0.417455 8.15491C0.676364 8.54764 1.04 8.86182 1.46691 9.06036C1.304 9.50109 1.26764 9.97891 1.36218 10.4393C1.45673 10.9004 1.67709 11.3251 2 11.6669C2.34182 11.9891 2.76655 12.2102 3.22691 12.3055C3.68727 12.4015 4.16509 12.3665 4.60655 12.2065C4.80582 12.6327 5.11927 12.9949 5.51273 13.2531C5.90545 13.5105 6.36364 13.6538 6.83345 13.6669C7.304 13.6553 7.76145 13.512 8.15491 13.2545C8.54836 12.9971 8.86182 12.6335 9.06036 12.2073C9.49964 12.3811 9.98109 12.4225 10.4444 12.3265C10.9069 12.2305 11.3316 12.0015 11.6662 11.6669C12.0007 11.3324 12.2305 10.9076 12.3265 10.4444C12.4225 9.98109 12.3811 9.49964 12.2065 9.06036C12.6327 8.86109 12.9949 8.54764 13.2531 8.15418C13.5105 7.76145 13.6538 7.30327 13.6669 6.83345ZM5.86036 9.63346L3.36655 7.14036L4.30691 6.19345L5.81382 7.70036L9.01382 4.21382L9.99345 5.12L5.86036 9.63346Z" fill="#00A6F4"/>
          </svg>
        </span>
      </div>

      {/* Handle */}
      <div className="w-full pt-[4px]">
        <p className="whitespace-nowrap text-[14.4px] font-normal leading-[14.4px] tracking-[-0.288px] text-[#737373] dark:text-zinc-400">
          @iamshakibali
        </p>
      </div>

      {/* Stats */}
      <div className="flex w-full gap-6 pt-[16px]">
        <p className="whitespace-nowrap text-[14.4px] leading-[14.4px] tracking-[-0.288px]">
          <span className="font-semibold text-[#171717] dark:text-zinc-100"><NumberTicker value={220} className="align-middle" /></span>
          <span className="font-normal text-[#737373] dark:text-zinc-400"> Following</span>
        </p>
        <p className="whitespace-nowrap text-[14.4px] leading-[14.4px] tracking-[-0.288px]">
          <span className="font-semibold text-[#171717] dark:text-zinc-100"><NumberTicker value={72} className="align-middle" /></span>
          <span className="font-normal text-[#737373] dark:text-zinc-400"> Followers</span>
        </p>
      </div>
    </div>
  );
}
