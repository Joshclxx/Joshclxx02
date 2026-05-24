"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type PetState = "walk" | "sit" | "sleep" | "tickled" | "jumping" | "perching" | "returning" | "eating" | "running";

const WALK_SPEED = 0.7;
const RUN_SPEED  = 3.5;
const PET_W = 100; const WALK_H = 56;
const SIT_W = 64;  const SIT_H  = 72;
const TARGETS = "h1,h2,h3,h4,.gh-badge,.gh-btn,[class*='repo-card'],[class*='section-heading'],[class*='card-title']";
const EXCLUDE  = "nav *,header *,[class*='navigation'] *"; // never perch inside nav

const PHRASES = ["git commit -m 'meow'","npm run purr","undefined is not a cat","console.log('meow')","it works on my machine","push to main... yolo"];
const TICKLES = ["hahaha!","kilittt~","stop it!","teehee~","hihihi!","ayy!!","wahahaha!"];
const PERCH_LINES = ["Meow from up here!","Nice view!","I claim this!","Don't mind me~","Comfy spot!"];

const eio = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

// ── SVG: Walking ─────────────────────────────────────────────────────────
function WalkingCat({ dir, fast = false }: { dir: 1|-1; fast?: boolean }) {
  const legDur = fast ? "0.18s" : "0.4s";
  const bodyDur = fast ? "0.18s" : "0.4s";
  return (
    <svg width={100} height={56} viewBox="0 0 100 56" style={{ transform:dir===-1?"scaleX(-1)":"none",overflow:"visible" }}>
      <path d="M 8 34 C 2 22 4 10 12 6 C 18 3 20 12 16 14" fill="none" stroke="#374151" strokeWidth="5.5" strokeLinecap="round"
        style={{ animation:"petTailWalk 1s ease-in-out infinite",transformOrigin:"8px 34px" }}/>
      <ellipse cx="48" cy="34" rx="32" ry="13" fill="#374151" style={{ animation:`petBodyBounce ${bodyDur} ease-in-out infinite` }}/>
      <ellipse cx="50" cy="37" rx="20" ry="8"  fill="#4b5563" style={{ animation:`petBodyBounce ${bodyDur} ease-in-out infinite` }}/>
      <ellipse cx="74" cy="31" rx="9" ry="9" fill="#374151"/>
      <circle cx="82" cy="20" r="14" fill="#374151"/>
      <polygon points="72,11 68,1 77,8" fill="#374151"/><polygon points="72,10 69,3 76,8" fill="#fda4af"/>
      <polygon points="88,9 93,0 83,7"  fill="#374151"/><polygon points="88,9 92,2 84,7"  fill="#fda4af"/>
      <circle cx="77" cy="18" r="4" fill="white"/><circle cx="87" cy="17" r="4" fill="white"/>
      <circle cx="78" cy="18" r="2.5" fill="#1a1f2e"/><circle cx="88" cy="17" r="2.5" fill="#1a1f2e"/>
      <circle cx="79" cy="17" r="1" fill="white"/>  <circle cx="89" cy="16" r="1" fill="white"/>
      <polygon points="82,23 80,26 84,26" fill="#fda4af"/>
      <path d="M80,26 Q82,28 84,26" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
      <line x1="72" y1="23" x2="79" y2="24" stroke="#9ca3af" strokeWidth="0.8"/>
      <line x1="70" y1="25" x2="78" y2="25" stroke="#9ca3af" strokeWidth="0.8"/>
      <line x1="92" y1="23" x2="85" y2="24" stroke="#9ca3af" strokeWidth="0.8"/>
      <line x1="94" y1="25" x2="86" y2="25" stroke="#9ca3af" strokeWidth="0.8"/>
      {([{x:68,a:"petLegA"},{x:60,a:"petLegB"},{x:30,a:"petLegB"},{x:22,a:"petLegA"}] as const).map(({x,a},i)=>(
        <g key={i} transform={`translate(${x},44)`}>
          <g style={{ animation:`${a} ${legDur} ease-in-out infinite`,transformOrigin:"0 0" }}>
            <rect x="-4" y="0" width="8" height="13" rx="4" fill={i%2===0?"#374151":"#4b5563"}/>
            <ellipse cx="0" cy="15" rx="6" ry="3.5" fill={i%2===0?"#374151":"#4b5563"}/>
          </g>
        </g>
      ))}
    </svg>
  );
}

// ── SVG: Sitting ─────────────────────────────────────────────────────────
function SittingCat() {
  return (
    <svg width={SIT_W} height={SIT_H} viewBox="0 0 64 72" style={{ overflow:"visible" }}>
      <path d="M 48 54 Q 58 52 56 44 Q 54 36 48 40" fill="none" stroke="#374151" strokeWidth="5.5" strokeLinecap="round"/>
      <ellipse cx="32" cy="52" rx="18" ry="15" fill="#374151"/>
      <ellipse cx="32" cy="55" rx="11" ry="10" fill="#4b5563"/>
      <circle cx="32" cy="26" r="17" fill="#374151"/>
      <polygon points="20,13 16,2 26,10" fill="#374151"/><polygon points="20,12 17,4 25,10" fill="#fda4af"/>
      <polygon points="44,13 48,2 38,10" fill="#374151"/><polygon points="44,12 47,4 39,10" fill="#fda4af"/>
      <circle cx="26" cy="24" r="4.5" fill="white"/><circle cx="38" cy="24" r="4.5" fill="white"/>
      <circle cx="27" cy="24" r="3"   fill="#1a1f2e"/><circle cx="39" cy="24" r="3"   fill="#1a1f2e"/>
      <circle cx="28" cy="23" r="1.2" fill="white"/> <circle cx="40" cy="23" r="1.2" fill="white"/>
      <polygon points="32,30 30,33 34,33" fill="#fda4af"/>
      <path d="M30,33 Q32,35 34,33" fill="none" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round"/>
      <line x1="20" y1="29" x2="28" y2="30" stroke="#9ca3af" strokeWidth="0.8"/><line x1="18" y1="31" x2="27" y2="31" stroke="#9ca3af" strokeWidth="0.8"/>
      <line x1="44" y1="29" x2="36" y2="30" stroke="#9ca3af" strokeWidth="0.8"/><line x1="46" y1="31" x2="37" y2="31" stroke="#9ca3af" strokeWidth="0.8"/>
      <ellipse cx="22" cy="65" rx="9" ry="5" fill="#374151"/><ellipse cx="42" cy="65" rx="9" ry="5" fill="#374151"/>
    </svg>
  );
}

// ── SVG: Sleeping ────────────────────────────────────────────────────────
function SleepingCat() {
  return (
    <svg width={96} height={48} viewBox="0 0 96 48" style={{ overflow:"visible" }}>
      <path d="M 8 30 C 4 24 6 14 14 12 C 18 10 18 18 14 18" fill="none" stroke="#374151" strokeWidth="5.5" strokeLinecap="round"/>
      <ellipse cx="48" cy="34" rx="32" ry="11" fill="#374151"/><ellipse cx="49" cy="37" rx="20" ry="7" fill="#4b5563"/>
      <ellipse cx="76" cy="28" rx="9" ry="9" fill="#374151"/>
      <circle cx="82" cy="20" r="13" fill="#374151"/>
      <polygon points="73,10 69,1 78,8" fill="#374151"/><polygon points="73,10 70,3 77,8" fill="#fda4af"/>
      <polygon points="88,9 92,0 84,7"  fill="#374151"/><polygon points="88,9 91,2 85,7"  fill="#fda4af"/>
      <path d="M74,18 Q77,15 80,18" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round"/>
      <path d="M83,17 Q86,14 89,17" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round"/>
      <polygon points="82,22 80,25 84,25" fill="#fda4af"/>
      <ellipse cx="65" cy="44" rx="8" ry="4" fill="#374151"/><ellipse cx="30" cy="44" rx="8" ry="4" fill="#374151"/>
      <text x="88" y="12" fontSize="9"  fill="#58a6ff" style={{ animation:"petZzz 2s infinite 0s"   }}>z</text>
      <text x="94" y="6"  fontSize="11" fill="#58a6ff" style={{ animation:"petZzz 2s infinite 0.5s" }}>z</text>
    </svg>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────
// Bottom nav height on mobile (matches .mobile-bottom-nav-inner 56px + some padding)
const MOBILE_NAV_H = 60;

export function DesktopPet() {
  const [x,   setX]   = useState(140);
  const [posY, setPosY] = useState(0);
  const [scl, setScl] = useState({ sx: 1, sy: 1 });
  // When airborne or perching: top/left override (null = use ground coords)
  const [air, setAir] = useState<{ top: number; left: number } | null>(null);
  const [state, setState]   = useState<PetState>("walk");
  const [dir, setDir]       = useState<1|-1>(1);
  const [tickling, setTickling] = useState(false);
  const [bubble,  setBubble]  = useState<string|null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const xRef      = useRef(140);
  const dirRef    = useRef<1|-1>(1);
  const stateRef  = useRef<PetState>("walk");
  const walkRaf   = useRef(0);
  const jumpRaf   = useRef(0);
  const timerRef  = useRef<ReturnType<typeof setTimeout>>();
  const perchElem = useRef<Element|null>(null);
  const airRef    = useRef<{ top: number; left: number } | null>(null);
  const nextStateRef = useRef<() => void>(() => {});

  const setAirSync = (v: typeof air) => { airRef.current = v; setAir(v); };

  const pop = useCallback((msg: string, ms = 2500) => {
    setBubble(msg); setTimeout(() => setBubble(null), ms);
  }, []);

  // ── Walk loop ─────────────────────────────────────────────────────────
  const startWalkLoop = useCallback(() => {
    cancelAnimationFrame(walkRaf.current);
    const loop = () => {
      if (stateRef.current !== "walk") return;
      const mobile = window.innerWidth < 768;
      const petScale = mobile ? 0.5 : 1;
      const effectiveW = PET_W * petScale;
      const max = window.innerWidth - effectiveW;
      xRef.current += WALK_SPEED * dirRef.current;
      if (xRef.current >= max) { xRef.current = max; dirRef.current = -1; setDir(-1); }
      if (xRef.current <= 0)   { xRef.current = 0;   dirRef.current =  1; setDir(1);  }
      setX(xRef.current);
      walkRaf.current = requestAnimationFrame(loop);
    };
    walkRaf.current = requestAnimationFrame(loop);
  }, []);

  // ── Unified arc: works ground→element and element→ground ─────────────
  // Formula: top = lerp(sTop→eTop) − sin(t·π)·peak  (peak lifts arc above straight line)
  const jumpArc = useCallback((sX:number, eX:number, sTop:number, eTop:number, dur:number, peak=90): Promise<void> => {
    cancelAnimationFrame(walkRaf.current);
    cancelAnimationFrame(jumpRaf.current);
    const start = performance.now();
    return new Promise(resolve => {
      const step = (now: number) => {
        const t  = Math.min((now - start) / dur, 1);
        const et = eio(t);
        const top  = sTop + (eTop - sTop) * et - Math.sin(t * Math.PI) * peak;
        const left = sX   + (eX   - sX)   * et;
        const sy = t < 0.12 ? 0.72 : t > 0.85 ? 0.68 : 1.14;
        const sx = t < 0.12 ? 1.22 : t > 0.85 ? 1.26 : 0.88;
        if (eX !== sX) { const d = eX > sX ? 1 : -1 as 1|-1; setDir(d); dirRef.current = d; }
        setAirSync({ top, left });
        setScl({ sx, sy });
        if (t < 1) { jumpRaf.current = requestAnimationFrame(step); }
        else { setScl({ sx:1, sy:1 }); resolve(); }
      };
      jumpRaf.current = requestAnimationFrame(step);
    });
  }, []);

  // ── Return to ground ──────────────────────────────────────────────────
  const returnToGround = useCallback(async () => {
    stateRef.current = "returning"; setState("returning");
    const cur  = airRef.current ?? { top: window.innerHeight - WALK_H, left: xRef.current };
    const endX = Math.max(10, Math.min(window.innerWidth - PET_W - 10, cur.left + SIT_W/2 - PET_W/2));
    const gTop = window.innerHeight - WALK_H;
    await jumpArc(cur.left, endX, cur.top, gTop, 600, 60);
    xRef.current = endX; setX(endX);
    setAirSync(null); setPosY(0);
    perchElem.current = null;
    stateRef.current = "walk"; setState("walk");
    startWalkLoop();
    timerRef.current = setTimeout(() => nextStateRef.current(), 2000 + Math.random() * 2000);
  }, [jumpArc, startWalkLoop]);

  // ── Run to bowl + eat ────────────────────────────────────────────────
  const runToBowl = useCallback(() => {
    const s = stateRef.current;
    if (s === "eating" || s === "running" || s === "jumping" || s === "returning") return;
    clearTimeout(timerRef.current);
    cancelAnimationFrame(walkRaf.current);
    cancelAnimationFrame(jumpRaf.current);

    // Bowl: right:90, width:68 → stop just left of it
    const bowlLeft = window.innerWidth - 90 - 68;
    const targetX  = Math.max(0, bowlLeft - 6);
    const d        = targetX > xRef.current ? 1 : -1 as 1|-1;
    setDir(d); dirRef.current = d;
    stateRef.current = "running"; setState("running");

    const run = () => {
      const dist = targetX - xRef.current;
      if (Math.abs(dist) < RUN_SPEED) {
        xRef.current = targetX; setX(targetX);
        stateRef.current = "eating"; setState("eating");
        pop("Nom nom nom!", 3200);
        timerRef.current = setTimeout(() => {
          window.dispatchEvent(new CustomEvent("pet-bowl-eaten"));
          stateRef.current = "walk"; setState("walk");
          startWalkLoop();
          setTimeout(nextState, 3000 + Math.random() * 3000);
        }, 3500);
      } else {
        xRef.current += Math.sign(dist) * RUN_SPEED;
        setX(xRef.current);
        walkRaf.current = requestAnimationFrame(run);
      }
    };
    walkRaf.current = requestAnimationFrame(run);
  }, [pop, startWalkLoop]);

  // ── Jump to a DOM element ─────────────────────────────────────────────
  const jumpToElement = useCallback(async () => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(el => {
      // skip elements inside nav/header
      if (el.closest("nav, header")) return false;
      const r = el.getBoundingClientRect();
      // must be clearly visible with room above for the cat
      return r.top > 100 && r.top < window.innerHeight - 120 && r.width > 40 && r.height > 12;
    });
    if (!nodes.length) { stateRef.current = "walk"; setState("walk"); startWalkLoop(); return; }

    const el    = nodes[Math.floor(Math.random() * nodes.length)];
    const rect  = el.getBoundingClientRect();
    const endL  = Math.max(4, Math.min(window.innerWidth - SIT_W - 4, rect.left + rect.width/2 - SIT_W/2));
    const endT  = Math.max(68, rect.top - SIT_H); // never above 68px (below nav)
    const startL = xRef.current + PET_W/2 - SIT_W/2;
    const startT = window.innerHeight - WALK_H;

    stateRef.current = "jumping"; setState("jumping");
    await jumpArc(startL, endL, startT, endT, 700, 100);

    const r2    = el.getBoundingClientRect();
    const snapL = Math.max(4, Math.min(window.innerWidth - SIT_W - 4, r2.left + r2.width/2 - SIT_W/2));
    const snapT = Math.max(68, r2.top - SIT_H);
    perchElem.current = el;
    setAirSync({ top: snapT, left: snapL });
    stateRef.current = "perching"; setState("perching");
    pop(PERCH_LINES[Math.floor(Math.random() * PERCH_LINES.length)], 2500);
    timerRef.current = setTimeout(returnToGround, 3500 + Math.random() * 2500);
  }, [jumpArc, pop, returnToGround, startWalkLoop]);

  // ── Scroll tracking while perching ───────────────────────────────────
  useEffect(() => {
    if (state !== "perching") return;
    const el = perchElem.current; if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const t = Math.max(68, r.top - SIT_H);
      const l = Math.max(4, Math.min(window.innerWidth - SIT_W - 4, r.left + r.width/2 - SIT_W/2));
      setAirSync({ top: t, left: l });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [state]);

  // ── Bowl event listener ───────────────────────────────────────────────
  useEffect(() => {
    window.addEventListener("pet-bowl-filled", runToBowl);
    return () => window.removeEventListener("pet-bowl-filled", runToBowl);
  }, [runToBowl]);

  // ── Click / touch ─────────────────────────────────────────────────────
  const handlePet = useCallback(() => {
    const s = stateRef.current;
    if (s === "tickled" || s === "jumping" || s === "returning") return;
    if (s === "perching") { clearTimeout(timerRef.current); returnToGround(); return; }
    clearTimeout(timerRef.current); cancelAnimationFrame(walkRaf.current);
    stateRef.current = "tickled"; setState("tickled");
    setTickling(true);
    pop(TICKLES[Math.floor(Math.random() * TICKLES.length)], 900);
    timerRef.current = setTimeout(() => {
      setTickling(false);
      const mobile = window.innerWidth < 768;
      if (mobile) {
        // On mobile: just resume walking, no hop (jump arc doesn't account for scale/offset)
        stateRef.current = "walk"; setState("walk");
        startWalkLoop();
        timerRef.current = setTimeout(() => nextStateRef.current(), 1500 + Math.random() * 2000);
      } else {
        // On desktop: hop to a random ground position
        const gTop   = window.innerHeight - WALK_H;
        const startL = xRef.current + PET_W/2 - SIT_W/2;
        const maxX   = window.innerWidth - PET_W - 10;
        const endX   = Math.max(10, Math.floor(Math.random() * maxX));
        const endL   = endX + PET_W/2 - SIT_W/2;
        stateRef.current = "jumping"; setState("jumping");
        jumpArc(startL, endL, gTop, gTop, 550, 85).then(() => {
          xRef.current = endX; setX(endX);
          setAirSync(null);
          stateRef.current = "walk"; setState("walk");
          startWalkLoop();
          timerRef.current = setTimeout(() => nextStateRef.current(), 1500 + Math.random() * 2000);
        });
      }
    }, 750);
  }, [jumpArc, pop, returnToGround, startWalkLoop]);

  // ── Idle state machine ────────────────────────────────────────────────
  const nextState = useCallback(() => {
    if (!["walk","sit","sleep"].includes(stateRef.current)) return;
    const mobile = window.innerWidth < 768;
    const r = Math.random();
    // On mobile: only walk/sit/sleep — no jumping to elements
    const next: PetState = r < 0.5 ? "walk" : r < 0.8 ? "sit" : "sleep";
    stateRef.current = next; setState(next);
    if (next === "walk") startWalkLoop();
    if (next === "sit")  pop(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    const dur = next === "walk" ? 3000 + Math.random()*5000 : next === "sit" ? 2000 + Math.random()*3000 : 5000 + Math.random()*6000;
    timerRef.current = setTimeout(nextState, dur);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop, startWalkLoop]);

  // Keep ref in sync so callbacks defined before nextState can call it
  useEffect(() => { nextStateRef.current = nextState; }, [nextState]);

  useEffect(() => {
    startWalkLoop();
    timerRef.current = setTimeout(nextState, 3000);
    return () => { cancelAnimationFrame(walkRaf.current); cancelAnimationFrame(jumpRaf.current); clearTimeout(timerRef.current); };
  }, [startWalkLoop, nextState]);

  const isFlying = state === "jumping" || state === "returning";
  const useSit   = state === "sit" || state === "perching" || isFlying || state === "tickled" || state === "eating";

  const mobileBottom = isMobile ? MOBILE_NAV_H : 0;

  return (
    <div
      className="hidden md:block select-none"
      style={{
        position: "fixed",
        zIndex: 49, // below bottom nav (z-50) but above content
        cursor: "pointer",
        pointerEvents: "auto",
        transform: isMobile ? 'scale(0.5)' : undefined,
        transformOrigin: 'bottom left',
        ...(air ? { top: air.top, left: air.left } : { bottom: posY + mobileBottom, left: x }),
      }}
      onClick={handlePet}
      onTouchEnd={e => { e.preventDefault(); handlePet(); }}
    >
      {bubble && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap
          text-[10px] font-medium text-foreground px-2.5 py-1.5 rounded-xl
          border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] shadow-lg"
          style={{ animation:"petBubbleIn 0.25s ease-out", zIndex:1 }}>
          {bubble}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
            border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent
            border-t-[5px] border-t-[var(--gh-border)]"/>
        </div>
      )}
      <div style={{
        transformOrigin: "50% 100%",
        transform:  tickling ? undefined : `scaleX(${scl.sx}) scaleY(${scl.sy})`,
        animation:  tickling ? "petTickle 0.75s ease-in-out"
          : state === "eating" ? "petEat 0.45s ease-in-out infinite" : undefined,
      }}>
        {useSit ? <SittingCat/> : state === "sleep" ? <SleepingCat/> : <WalkingCat dir={dir} fast={state==="running"}/>}
      </div>
      <style>{`
        @keyframes petLegA       { 0%,100%{transform:rotate(-28deg)} 50%{transform:rotate(22deg)} }
        @keyframes petLegB       { 0%,100%{transform:rotate(22deg)}  50%{transform:rotate(-28deg)} }
        @keyframes petBodyBounce { 0%,100%{transform:translateY(-1px)} 50%{transform:translateY(2px)} }
        @keyframes petTailWalk   { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(18deg)} }
        @keyframes petZzz        { 0%,100%{opacity:0;transform:translateY(0)} 50%{opacity:1;transform:translateY(-5px)} }
        @keyframes petBubbleIn   { from{opacity:0;transform:translateX(-50%) translateY(4px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes petTickle {
          0%,100%{transform:rotate(0deg)scale(1)} 10%{transform:rotate(-16deg)scale(1.15)translateY(-6px)}
          20%{transform:rotate(16deg)scale(0.87)translateY(2px)} 35%{transform:rotate(-13deg)scale(1.12)translateY(-5px)}
          50%{transform:rotate(13deg)scale(0.9)translateY(1px)} 65%{transform:rotate(-10deg)scale(1.08)translateY(-3px)}
          80%{transform:rotate(10deg)scale(0.95)} 90%{transform:rotate(-5deg)scale(1.03)}
        }
        @keyframes petEat {
          0%,100%{transform:translateY(0) rotate(0deg)}
          35%{transform:translateY(9px) rotate(8deg)}
          70%{transform:translateY(5px) rotate(-4deg)}
        }
      `}</style>
    </div>
  );
}
