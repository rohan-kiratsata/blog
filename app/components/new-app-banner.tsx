import Link from "next/link";
import Image from "next/image";

export default function NewAppBanner() {
  return (
    <Link
      href="https://fylla.app/?utm_source=sudorohan&utm_medium=referral"
      className="mt-8 flex items-center gap-4 rounded-3xl px-3 py-3 group border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60"
    >
      <Image
        src="/fylla.svg"
        alt="fylla"
        width={44}
        height={44}
        unoptimized
        className="w-11 h-11 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Fylla
          </p>
          <span className="rounded bg-yellow-200 px-1 py-0.5 text-neutral-800 dark:bg-yellow-300/20 text-xs dark:text-yellow-200">
            new
          </span>
        </div>
        <p className="text-base font-medium text-neutral-600 dark:text-neutral-300">
          autofill applications, track progress, review, and get hired quicker.
        </p>
      </div>
      {/* <span className="shrink-0 rounded-full bg-[#66783E] px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-[#57672F]"></span> */}
    </Link>
  );
}
