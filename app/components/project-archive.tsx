"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Project } from "app/util/content";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-600";
const spring = "transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

/** A small, CSS-driven paper archive. All project content remains real HTML. */
export default function ProjectArchive({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [peeking, setPeeking] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const panelId = useId();
  const titleId = useId();
  if (!projects.length) return null;

  const current = projects[selected];
  const move = (direction: number) => setSelected((index) => (index + direction + projects.length) % projects.length);
  const close = () => {
    setOpen(false);
    setPeeking(false);
    trigger.current?.focus();
  };

  return (
    <div
      className="relative mt-8 border-t border-neutral-100 pt-6"
      onKeyDown={(event) => {
        if (!open) return;
        if (event.key === "Escape") { event.preventDefault(); close(); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={titleId} className="text-xs text-neutral-500">The unfinished collection</h3>
        <span className="font-mono text-[10px] tracking-wider text-neutral-500">VOL. 01 / {String(projects.length).padStart(2, "0")} OBJECTS</span>
      </div>

      <div className={`relative isolate transition-[height] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${open ? "h-[490px] sm:h-[450px]" : "h-[220px]"}`}>
        {/* Light falls across the tabletop only after the box is opened. */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-5 h-[360px] rounded-[50%] bg-[radial-gradient(ellipse,_#f5f4f1_0%,transparent_68%)] ${spring} ${open ? "opacity-100" : "opacity-0"}`} />

        <div id={panelId} role="region" aria-labelledby={titleId} inert={!open} className={open ? "visible" : "invisible"}>
          <button type="button" onClick={close} aria-label="Pack away projects" className={`absolute right-0 top-2 z-30 flex size-11 cursor-pointer items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 ${focus}`}>
            <X size={16} aria-hidden="true" />
          </button>

          <div
            className="absolute inset-x-0 top-14 h-[290px] touch-pan-y select-none sm:top-10"
            onPointerDown={(event) => { if (event.isPrimary) pointer.current = { x: event.clientX, y: event.clientY }; }}
            onPointerUp={(event) => {
              const start = pointer.current;
              pointer.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => { pointer.current = null; }}
          >
            {projects.map((project, index) => {
              const offset = (index - selected + projects.length) % projects.length;
              const active = offset === 0;
              const hasLink = /^https?:\/\//.test(project.link);
              return (
                <article
                  key={project.title}
                  aria-hidden={!active}
                  inert={!active}
                  className={`absolute left-1/2 top-2 flex min-h-[258px] w-[min(280px,calc(100%-36px))] origin-bottom flex-col rounded-[3px] border border-[#deddd6] bg-[#fffefb] p-6 shadow-[0_2px_4px_#29251b08,0_12px_32px_#29251b0c] ${spring}`}
                  style={{
                    zIndex: projects.length - offset,
                    transform: open
                      ? `translateX(calc(-50% + ${Math.min(offset, 3) * 5}px)) translateY(${Math.min(offset, 3) * -7}px) rotate(${offset === 0 ? -2 : Math.min(offset, 3) * 4}deg)`
                      : "translateX(-50%) translateY(120px) scale(.3) rotate(-8deg)",
                    opacity: offset > 3 ? 0 : 1,
                  }}
                >
                  <div className="mb-5 flex items-center justify-between border-b border-dashed border-neutral-200 pb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    <span>Experiment {String(index + 1).padStart(2, "0")}</span>
                    <span>{project.year}</span>
                  </div>
                  <h4 className="mb-2 text-lg font-medium tracking-tight text-neutral-800">{project.title}</h4>
                  <p className="text-[13px] leading-[1.7] text-neutral-600">{project.description}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="-rotate-6 rounded-sm border border-neutral-400/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[.16em] text-neutral-500">On the shelf</span>
                    {hasLink && <a href={project.link} target="_blank" rel="noopener noreferrer" draggable={false} className={`inline-flex min-h-11 items-center gap-1 text-xs text-neutral-700 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700 ${focus}`}>
                      {project.link.includes("github.com") ? "Source code" : "Visit project"}<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                    </a>}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => move(-1)} aria-label="Previous project" className={`flex size-11 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 ${focus}`}><ArrowLeft size={15} aria-hidden="true" /></button>
              <div className="flex items-center" aria-label="Choose a project">
                {projects.map((project, index) => <button key={project.title} type="button" onClick={() => setSelected(index)} aria-label={`Show ${project.title}`} aria-pressed={selected === index} className={`group flex h-11 w-7 cursor-pointer items-center justify-center rounded ${focus}`}><span className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${selected === index ? "w-4 bg-neutral-700" : "w-1.5 bg-neutral-300 group-hover:bg-neutral-500"}`} /></button>)}
              </div>
              <button type="button" onClick={() => move(1)} aria-label="Next project" className={`flex size-11 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 ${focus}`}><ArrowRight size={15} aria-hidden="true" /></button>
            </div>
            <p className="text-[11px] text-neutral-500">A few ideas worth keeping around.</p>
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{open ? `${selected + 1} of ${projects.length}: ${current.title}` : ""}</p>
          </div>
        </div>

        {/* One illustrated object doubles as the open/close control. */}
        <button
          ref={trigger}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close the box of unfinished projects" : `Open the box of ${projects.length} unfinished projects`}
          onClick={() => open ? close() : setOpen(true)}
          onPointerEnter={() => setPeeking(true)}
          onPointerLeave={() => setPeeking(false)}
          onFocus={() => setPeeking(true)}
          onBlur={() => setPeeking(false)}
          className={`group absolute z-20 cursor-pointer rounded-xl ${spring} ${focus} ${open ? "bottom-[102px] right-0 h-[100px] w-[125px] sm:right-5" : "bottom-12 left-1/2 h-[155px] w-[210px] -translate-x-1/2"}`}
        >
          <svg viewBox="0 0 240 180" fill="none" className="h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id={`${panelId}-front`} x1="60" y1="104" x2="90" y2="170" gradientUnits="userSpaceOnUse"><stop stopColor="#eeece7"/><stop offset="1" stopColor="#dcd9d1"/></linearGradient>
              <linearGradient id={`${panelId}-lid`} x1="40" y1="65" x2="170" y2="110" gradientUnits="userSpaceOnUse"><stop stopColor="#faf9f6"/><stop offset="1" stopColor="#e5e2db"/></linearGradient>
              <filter id={`${panelId}-shadow`} x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
            </defs>
            <ellipse cx="124" cy="160" rx="77" ry="7" fill="#343025" opacity=".12" filter={`url(#${panelId}-shadow)`}/>
            <path d="M38 92 148 70 207 93 98 119Z" fill="#b5afa3" stroke="#aaa499"/>
            <path d="M45 94 148 77 198 94 98 114Z" fill="#706b61"/>
            {/* Index cards rise out of the box on hover. */}
            <g className={spring} style={{ transform: `translateY(${open ? -12 : peeking ? -9 : 0}px)` }}>
              <path d="m65 97-5-40 75-11 7 50Z" fill="#faf9f6" stroke="#c9c5bb"/>
              <path d="m77 91 1-48 78 4-2 48Z" fill="#f1efe8" stroke="#c9c5bb"/>
              <path d="m94 98 7-39 77 12-8 34Z" fill="#fffefa" stroke="#c9c5bb"/>
              <path d="m112 71 40 6m-42 0 25 4" stroke="#d1cec5" strokeLinecap="round"/>
            </g>
            <path d="M38 92 98 114 98 165 40 140Z" fill="#d2cec4" stroke="#bdb8ac" strokeLinejoin="round"/>
            <path d="M98 114 207 93 205 142 98 165Z" fill={`url(#${panelId}-front)`} stroke="#bdb8ac" strokeLinejoin="round"/>
            <path d="m107 120 91-18" stroke="#f9f8f4"/>
            {/* The archive's very small resident watches the selected card. */}
            <g className={spring} style={{ transform: `translateY(${open || peeking ? 0 : 3}px)` }}>
              <rect x="136" y="119" width="34" height="12" rx="5" transform="rotate(-11 136 119)" fill="#716c62"/>
              <g className={spring} style={{ opacity: open || peeking ? 1 : 0 }}>
                <ellipse cx="147" cy="122" rx="3" ry="3.5" fill="#fffef8"/><ellipse cx="157" cy="120" rx="3" ry="3.5" fill="#fffef8"/>
                <circle cx={147 + (selected % 3 - 1)} cy="121.5" r="1.3" fill="#39362f"/><circle cx={157 + (selected % 3 - 1)} cy="119.5" r="1.3" fill="#39362f"/>
              </g>
            </g>
            <path d="m120 145 54-11" stroke="#aaa497" strokeWidth=".7"/>
            <g className={spring} style={{ transformOrigin: "145px 72px", transform: open ? "translate(3px,-37px) rotate(-16deg)" : peeking ? "translate(0,-9px) rotate(-4deg)" : "translate(0,-3px) rotate(-2deg)" }}>
              <path d="M32 84 147 62 212 85 97 109Z" fill={`url(#${panelId}-lid)`} stroke="#bbb5a8" strokeLinejoin="round"/>
              <path d="M32 84 97 109 97 118 32 93Z" fill="#d8d3c8" stroke="#bbb5a8" strokeLinejoin="round"/>
              <path d="m97 109 115-24v9L97 118Z" fill="#e8e4db" stroke="#bbb5a8" strokeLinejoin="round"/>
              <path d="m84 74 56 21 20-4-57-21Z" fill="#eeece5" opacity=".8"/>
              <path d="m44 84 54 20 101-20" stroke="#fffefa" strokeOpacity=".8"/>
            </g>
          </svg>
        </button>
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 text-center ${spring} ${open ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`} aria-hidden={open}>
          <p className="text-[13px] text-neutral-600">Some things didn’t make it.</p>
          <p className="mt-1 text-[11px] text-neutral-500">{peeking ? "Go on. Take a look inside." : "A small box of past projects. Click to open."}</p>
        </div>
      </div>
    </div>
  );
}
