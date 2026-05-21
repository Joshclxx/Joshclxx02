"use client";

import { useState, useCallback, useEffect } from "react";

function BowlSVG({ filled }: { filled: boolean }) {
  return (
    <svg width="68" height="48" viewBox="0 0 68 48" style={{ overflow: "visible" }}>
      {/* Shadow */}
      <ellipse cx="34" cy="45" rx="24" ry="4" fill="rgba(0,0,0,0.25)"/>
      {/* Bowl body */}
      <path d="M 8 22 Q 8 40 34 40 Q 60 40 60 22 Z" fill="#374151"/>
      {/* Rim */}
      <ellipse cx="34" cy="22" rx="26" ry="8" fill="#4b5563"/>
      {/* Inner bowl */}
      <ellipse cx="34" cy="23" rx="22" ry="6" fill="#1f2937"/>

      {/* Kibble — only when filled */}
      {filled && (
        <g style={{ animation:"bowlFoodIn 0.35s cubic-bezier(0.34,1.56,0.64,1)", transformOrigin:"34px 34px" }}>
          {/* Base mound */}
          <ellipse cx="34" cy="19" rx="19" ry="7" fill="#92400e"/>
          {/* Kibble pieces */}
          <ellipse cx="24" cy="15" rx="4.5" ry="3" fill="#ea580c" transform="rotate(-20,24,15)"/>
          <ellipse cx="34" cy="11" rx="5"   ry="3" fill="#f97316" transform="rotate(5,34,11)"/>
          <ellipse cx="44" cy="15" rx="4.5" ry="3" fill="#ea580c" transform="rotate(20,44,15)"/>
          <ellipse cx="27" cy="19" rx="4"   ry="2.5" fill="#fb923c" transform="rotate(-10,27,19)"/>
          <ellipse cx="41" cy="19" rx="4"   ry="2.5" fill="#fb923c" transform="rotate(10,41,19)"/>
          <ellipse cx="34" cy="21" rx="3.5" ry="2"   fill="#ea580c"/>
        </g>
      )}

      {/* Name tag */}
      <text x="34" y="-4" textAnchor="middle" fontSize="9" fill="#6b7280"
        fontFamily="ui-monospace,monospace">
        {filled ? "nom nom..." : "hover to feed"}
      </text>
    </svg>
  );
}

export function FoodBowl() {
  const [filled, setFilled]   = useState(false);
  const [glowing, setGlowing] = useState(false);

  const handleHover = useCallback(() => {
    if (filled) return;
    setFilled(true);
    setGlowing(true);
    window.dispatchEvent(new CustomEvent("pet-bowl-filled"));
  }, [filled]);

  useEffect(() => {
    const onEaten = () => { setFilled(false); setGlowing(false); };
    window.addEventListener("pet-bowl-eaten", onEaten);
    return () => window.removeEventListener("pet-bowl-eaten", onEaten);
  }, []);

  return (
    <div
      onMouseEnter={handleHover}
      className="hidden md:block"
      style={{
        position:      "fixed",
        right:         90,
        bottom:        0,
        zIndex:        9997,
        cursor:        "pointer",
        pointerEvents: "auto",
        userSelect:    "none",
        filter:   glowing
          ? "drop-shadow(0 0 12px rgba(249,115,22,0.8)) drop-shadow(0 0 4px rgba(249,115,22,0.5))"
          : "none",
        transition: "filter 0.4s ease",
      }}
    >
      <BowlSVG filled={filled}/>
      <style>{`
        @keyframes bowlFoodIn {
          from { transform: scale(0.4) translateY(10px); opacity: 0; }
          to   { transform: scale(1)   translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
