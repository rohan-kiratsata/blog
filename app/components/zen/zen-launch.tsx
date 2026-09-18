'use client';
import { lazy, Suspense, useState } from 'react';
import { createPortal } from 'react-dom';
const ZenGame = lazy(() => import('./zen-game'));
export default function ZenLaunch() {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => setOpen(true)} className="mt-9 group flex w-full items-center gap-4 rounded-2xl border border-[#e6e6e1] bg-[#f7f8f3] px-5 py-4 text-left transition-colors hover:bg-[#eff2e8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-600" aria-haspopup="dialog">
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5ebdc] text-xl text-[#738467]">✳</span>
      <span className="flex-1"><span className="block text-sm text-neutral-800">Take the scenic route</span><span className="mt-1 block text-xs text-neutral-500">A tiny planet. A slower way to explore my work.</span></span>
      <span className="text-xs text-neutral-500">zen mode ↗</span>
    </button>
    {open && createPortal(<Suspense fallback={<div role="status" style={{position:'fixed',inset:0,zIndex:9999,background:'#e9e2ee',display:'grid',placeItems:'center',color:'#554c67'}}>Preparing your little planet…</div>}><ZenGame onClose={() => setOpen(false)} /></Suspense>, document.body)}
  </>;
}
