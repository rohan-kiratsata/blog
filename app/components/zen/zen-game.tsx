'use client';
import { useEffect, useRef, useState } from 'react';
import { createWorld, type World, type Telemetry } from './world';
import { biomeAt, encounters } from './expedition';
import { stations } from './stations';
import styles from './zen.module.css';

const initialTelemetry:Telemetry={fuel:100,jetting:false,grounded:true,altitude:0,x:0,y:0,z:13,heading:0,nearest:0,distance:19,speed:0,scanning:false,boundary:false,interaction:null,expedition:{completed:[],cells:0,visited:[]}};
export default function ZenGame({onClose}:{onClose:()=>void}) {
  const host=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDivElement>(null);
  const world=useRef<World|null>(null),audio=useRef<AudioContext|null>(null);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const [near,setNear]=useState(-1),[selected,setSelected]=useState<number|null>(null);
  const [journal,setJournal]=useState(false),[notice,setNotice]=useState('');
  const [sound,setSound]=useState(false),[locked,setLocked]=useState(false);
  const [telemetry,setTelemetry]=useState(initialTelemetry);
  const visited=telemetry.expedition.visited;
  const openStation=(id:number)=>{setSelected(id);setJournal(false);world.current?.visit(id);};
  const action=useRef({near,selected,journal,onClose,openStation});
  action.current={near,selected,journal,onClose,openStation};

  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const siblings=Array.from(document.body.children).filter(el=>el!==dialog.current&&!el.contains(dialog.current)) as HTMLElement[];
    const inert=siblings.map(el=>el.inert);siblings.forEach(el=>el.inert=true);dialog.current?.focus();
    let unlockedAt=-Infinity;
    const pointerLock=()=>{setLocked(Boolean(document.pointerLockElement));if(!document.pointerLockElement)unlockedAt=performance.now();};
    const key=(e:KeyboardEvent)=>{
      const a=action.current;
      if(e.code==='Escape'){
        e.preventDefault();e.stopImmediatePropagation();
        if(document.pointerLockElement){document.exitPointerLock();return;}
        if(performance.now()-unlockedAt<250)return;
        if(a.selected!==null)setSelected(null);else if(a.journal)setJournal(false);else a.onClose();
      }
      if(e.code==='KeyI')e.stopImmediatePropagation();
      if(e.code==='KeyE'&&!e.repeat&&a.selected===null&&!a.journal){e.preventDefault();const id=world.current?.interact();if(id!==null&&id!==undefined)a.openStation(id);}
      if(e.code==='KeyJ'){e.preventDefault();setSelected(null);setJournal(v=>!v);}
      if(e.key==='Tab'){
        const elements=Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')??[]).filter(el=>el.getClientRects().length>0&&!el.inert);
        if(!elements.length)return;const first=elements[0],last=elements[elements.length-1];
        if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===dialog.current)){e.preventDefault();first.focus();}
      }
    };
    window.addEventListener('keydown',key,true);document.addEventListener('pointerlockchange',pointerLock);
    try{world.current=createWorld(host.current!,setNear,()=>setReady(true),()=>setFailed(true),setTelemetry,setNotice);}catch{setFailed(true);}
    return()=>{
      world.current?.dispose();audio.current?.close();window.removeEventListener('keydown',key,true);document.removeEventListener('pointerlockchange',pointerLock);
      document.body.style.overflow=overflow;siblings.forEach((el,i)=>el.inert=inert[i]);previous?.focus();
    };
  },[]);
  useEffect(()=>{world.current?.pause(selected!==null||journal||failed);},[selected,journal,failed]);
  useEffect(()=>{
    if(selected!==null||journal)dialog.current?.querySelector<HTMLElement>('[data-panel] button')?.focus();
    else dialog.current?.focus();
  },[selected,journal]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),6500);return()=>clearTimeout(timer);},[notice]);
  const interact=()=>{const id=world.current?.interact();if(id!==null&&id!==undefined)openStation(id);};
  const toggleSound=async()=>{
    try{
      if(!audio.current){
        const context=new AudioContext();audio.current=context;
        const gain=context.createGain();gain.gain.value=.035;gain.connect(context.destination);
        [130.81,196,261.63,329.63].forEach((frequency,i)=>{
          const tone=context.createOscillator();tone.type='sine';tone.frequency.value=frequency;tone.detune.value=i*2;
          const volume=context.createGain();volume.gain.value=i===0?.45:.12;tone.connect(volume);volume.connect(gain);tone.start();
        });
        const buffer=context.createBuffer(1,context.sampleRate*3,context.sampleRate),data=buffer.getChannelData(0);
        let last=0;for(let i=0;i<data.length;i++){last=(last+Math.random()*.08-.04)/1.02;data[i]=last;}
        const wind=context.createBufferSource();wind.buffer=buffer;wind.loop=true;
        const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;wind.connect(filter);filter.connect(gain);wind.start();
      }
      if(sound){await audio.current.suspend();setSound(false);}else{await audio.current.resume();setSound(true);}
    }catch{setSound(false);}
  };
  const station=selected===null?null:stations[selected];
  const heading=Math.round(telemetry.heading),cardinal=['N','E','S','W'][Math.round(heading/90)%4];
  return (
    <div ref={dialog} className={styles.game} role="dialog" aria-modal="true" aria-label="Serein zen exploration mode" tabIndex={-1}>
      <div ref={host} className={styles.canvas}/>
      <div className={styles.vignette}/>
      <header className={styles.header}>
        <div className={styles.suitStatus}>
          <div className={styles.suitBar}><i/></div>
          <div className={styles.suitModules} aria-label="Suit systems online"><span>✚</span><span>◇</span><span>⊕</span><span>⌁</span><span>◈</span><small>EXOSUIT / ONLINE</small></div>
        </div>
        <div className={styles.actions}>
          <button className={styles.mouseLook} onClick={()=>world.current?.look()} aria-pressed={locked}>{locked?'RELEASE MOUSE / ESC':'MOUSE LOOK'}</button>
          <button onClick={toggleSound} aria-pressed={sound} aria-label={sound?'Mute ambient sound':'Enable ambient sound'}>{sound?'♫ ON':'♫ OFF'}</button>
          <button onClick={onClose} aria-label="Exit zen mode">EXIT ↗</button>
        </div>
      </header>
      {!journal&&!station&&!failed&&<>
        <div className={styles.compass} aria-label={`Heading ${heading} degrees ${cardinal}`}><div className={styles.compassTicks}>┊　┊　│　┊　┊　│　┊　┊</div><span>{cardinal}</span><small>{String(heading).padStart(3,'0')}°</small><i>▾</i></div>
        <div className={styles.reticle} aria-hidden="true"/>
        <aside className={styles.jetStatus} aria-label="Jetpack status">
          <div><span>{telemetry.jetting?'THRUST ACTIVE':telemetry.grounded?'EXPLORATION JETPACK':'CONTROLLED DESCENT'}</span><strong>{Math.round(telemetry.fuel)}<small>%</small></strong></div>
          <div className={styles.fuelTrack} role="meter" aria-label="Jetpack charge" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(telemetry.fuel)}><i style={{width:`${telemetry.fuel}%`}}/></div>
          <p>{telemetry.grounded?(telemetry.fuel<99?'RECHARGING':'HOLD SPACE TO LAUNCH'):`${telemetry.altitude.toFixed(1)} m ABOVE SURFACE`}</p>
        </aside>
        <aside className={styles.location}>
          <div className={styles.environmentBadges}><span>◈</span><span>⌁</span><span>✳</span><small>ENVIRONMENT<br/><b>TRANQUIL</b></small></div>
          <div className={styles.planetRule}/>
          <div className={styles.eyebrow}>SEREIN / UNCHARTED SYSTEM</div><h2>{biomeAt(telemetry.x,telemetry.z).name}</h2>
          <p>{biomeAt(telemetry.x,telemetry.z).label}</p>
          <div className={styles.coordinates}>{telemetry.x.toFixed(1)} : {telemetry.z.toFixed(1)} · ALT {(telemetry.y+100).toFixed(1)} <span> / {telemetry.jetting?'FLYING':telemetry.speed>5?'SPRINTING':telemetry.speed>.3?'EXPLORING':'AT REST'}</span></div>
          <div className={styles.inventory}>{telemetry.expedition.cells} POWER CELLS · {telemetry.expedition.completed.length} / {encounters.length} DISCOVERIES</div>
        </aside>
        <aside className={styles.mission}>
          <div className={styles.missionTitle}><span>◈</span><strong>{telemetry.interaction?.name??'A quiet expedition'}</strong><small>{telemetry.expedition.completed.length} / 16</small></div>
          <p>{telemetry.interaction?.action??(telemetry.expedition.completed.length===0?'Find the spare power cell beside the landing craft. Explore the valley at your own pace.':`Follow the trails and restore the valley. ${stations[telemetry.nearest].name} is ${Math.round(telemetry.distance)} m away.`)}</p>
          <button onClick={()=>world.current?.scan()} aria-label="Scan surroundings"><span className={styles.key}>R</span>{telemetry.scanning?'SURVEY PULSE ACTIVE':'SCAN FOR NEARBY SIGNALS'}</button>
        </aside>
        {telemetry.boundary&&<div className={styles.boundary} role="status">Edge of the surveyed valley · turn back toward the signals</div>}
        {telemetry.scanning&&<div className={styles.scanStatus} role="status">⌁ SURVEY PULSE / FOLLOW THE LIGHTS</div>}
      </>}
      {!ready&&!failed&&<div className={styles.loading} role="status"><span className={styles.brandMark}>◈</span><h2>ENTERING SEREIN</h2><p>Mapping terrain · establishing signal</p><button onClick={onClose}>CANCEL</button></div>}
      {failed&&<section className={styles.panel} data-panel><button className={styles.close} onClick={onClose}>Close ×</button><div className={styles.eyebrow}>RENDERER UNAVAILABLE</div><h2>A quieter way to explore.</h2><p>Your browser couldn’t open the 3D world. Every portfolio discovery is available below.</p><nav className={styles.journalList}>{stations.map(s=><a href={s.href} key={s.id}>{s.category} <span>↗</span></a>)}</nav></section>}
      {(telemetry.interaction||near>=0)&&selected===null&&!journal&&!failed&&ready&&<button className={styles.interact} onClick={interact}><span className={styles.key}>E</span><span><small>{telemetry.interaction?.name??'PORTFOLIO SIGNAL'}</small>{telemetry.interaction?.action??`Discover ${stations[near].name.toLowerCase()}`}</span><span>↗</span></button>}
      {notice&&!journal&&!station&&<div className={styles.notice} role="status">{notice}</div>}
      {station&&<section className={styles.panel} data-panel aria-label={station.category}>
        <button className={styles.close} onClick={()=>setSelected(null)}>RETURN TO EXPLORING ×</button>
        <div className={styles.stationIcon}>◈</div><div className={styles.eyebrow}>{station.category} / SIGNAL 0{selected!+1}</div>
        <h2>{station.title}</h2><p>{station.body}</p><p className={styles.detail}>{station.detail}</p>
        <a className={styles.link} href={station.href} target={station.href.startsWith('http')?'_blank':undefined} rel={station.href.startsWith('http')?'noopener noreferrer':undefined}>{station.link}<span>↗</span></a>
        {station.id==='writing'&&<a className={styles.contact} href="mailto:heyarohan@icloud.com">Say hello ↗</a>}
      </section>}
      {journal&&<section className={styles.panel} data-panel aria-label="Field journal">
        <button className={styles.close} onClick={()=>setJournal(false)}>RETURN TO EXPLORING ×</button>
        <div className={styles.eyebrow}>EXPLORER DATABASE / ROHAN KIRATSATA</div><h2>Field journal</h2><p>Follow the trails, restore quiet places, and meet the person behind this world. Your discoveries are saved on this device.</p>
        <nav className={styles.journalList}>{stations.map((s,i)=><div key={s.id}><button onClick={()=>openStation(i)}><span className={styles.index}>{visited.includes(i)?'◈':String(i+1).padStart(2,'0')}</span><span>{s.name}<small>{s.category.toLowerCase()}</small></span><span>↗</span></button><button disabled={!visited.includes(i)} className={styles.travel} aria-label={`Travel to ${s.name}`} onClick={()=>{world.current?.travel(i);setJournal(false);}}>{visited.includes(i)?'TRAVEL':'UNVISITED'}</button></div>)}</nav>
        <div className={styles.eyebrow}>VALLEY DISCOVERIES · {telemetry.expedition.completed.length} / {encounters.length}</div>
        <p className={styles.detail}>{telemetry.expedition.cells} power cells in your pack. Supply cases power the relays and crossing. Activated trail beacons let you return across the valley.</p>
        <div className={styles.discoveryList}>{encounters.map(e=>{const complete=telemetry.expedition.completed.includes(e.id);return <div key={e.id}><span>{complete?'◈':'○'}</span><div><strong>{e.name}</strong><small>{complete?e.result:`${biomeAt(e.x,e.z).name} · ${Math.round(Math.hypot(e.x-telemetry.x,e.z-telemetry.z))} m`}</small></div>{e.kind==='beacon'&&complete&&<button onClick={()=>{world.current?.beacon(e.id);setJournal(false);}}>TRAVEL</button>}</div>;})}</div>
        <a className={styles.credits} href="/zen/KENNEY-LICENSE.txt" target="_blank" rel="noopener noreferrer">Props / Kenney · CC0 ↗</a><a className={styles.credits} href="/zen/quaternius/LICENSE.txt" target="_blank" rel="noopener noreferrer">Astronaut, animation & habitats / Quaternius · CC0 ↗</a>
      </section>}
      {!failed&&<footer className={styles.footer}>
        <div className={styles.controls}><div><span className={styles.key}>W A S D</span> MOVE <span className={styles.key}>SHIFT</span> SPRINT <span className={styles.key}>SPACE</span> TAP / JUMP · HOLD / FLY</div><div>DRAG TO LOOK <b>·</b> SCROLL TO ZOOM <b>·</b> <span className={styles.key}>R</span> SCAN</div></div>
        <button className={styles.journalButton} onClick={()=>{setSelected(null);setJournal(v=>!v);}} aria-expanded={journal}><span className={styles.key}>J</span> Field journal <span className={styles.count}>{visited.length} / {stations.length}</span></button>
      </footer>}
      {!journal&&selected===null&&!failed&&<><div className={styles.touchPad} aria-label="Movement controls">{[{label:'Move forward',x:0,y:-1,icon:'↑'},{label:'Move left',x:-1,y:0,icon:'←'},{label:'Move backward',x:0,y:1,icon:'↓'},{label:'Move right',x:1,y:0,icon:'→'}].map(d=><button key={d.label} aria-label={d.label} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);world.current?.move(d.x,d.y);}} onPointerUp={()=>world.current?.move(0,0)} onPointerCancel={()=>world.current?.move(0,0)} onLostPointerCapture={()=>world.current?.move(0,0)}>{d.icon}</button>)}</div><div className={styles.touchActions}><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);world.current?.jump(true);}} onPointerUp={()=>world.current?.jump(false)} onPointerCancel={()=>world.current?.jump(false)} onLostPointerCapture={()=>world.current?.jump(false)} aria-label="Jump or hold to fly">↑ JUMP / FLY</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);world.current?.sprint(true);}} onPointerUp={()=>world.current?.sprint(false)} onPointerCancel={()=>world.current?.sprint(false)} onLostPointerCapture={()=>world.current?.sprint(false)} aria-label="Sprint">SPRINT</button></div></>}
      <div className={styles.srOnly} aria-live="polite">{telemetry.interaction?`${telemetry.interaction.action}. Press E.`:near>=0?`${stations[near].name} nearby. Press E to discover.`:''}</div>
    </div>
  );
}
