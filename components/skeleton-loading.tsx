"use client";

import { useEffect, useState } from "react";

/**
 * GitHub-style skeleton loading screen that mirrors the portfolio layout.
 * Shows while the page hydrates and content loads, then smoothly fades out.
 */
export function SkeletonLoading() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade-out after a minimum display time to avoid flash
    const timer = setTimeout(() => {
      setIsFading(true);
      // Remove from DOM after fade animation completes
      setTimeout(() => setIsVisible(false), 500);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`skeleton-overlay ${isFading ? "skeleton-fade-out" : ""}`}
      aria-hidden="true"
    >
      {/* Nav skeleton */}
      <div className="skeleton-nav">
        <div className="skeleton-nav-inner">
          <div className="skeleton-bone skeleton-circle" style={{ width: 32, height: 32 }} />
          <div className="skeleton-bone" style={{ width: 80, height: 14 }} />
          <div className="skeleton-nav-tabs">
            <div className="skeleton-bone" style={{ width: 64, height: 12 }} />
            <div className="skeleton-bone" style={{ width: 80, height: 12 }} />
            <div className="skeleton-bone" style={{ width: 88, height: 12 }} />
            <div className="skeleton-bone" style={{ width: 64, height: 12 }} />
            <div className="skeleton-bone" style={{ width: 56, height: 12 }} />
          </div>
          <div className="skeleton-bone skeleton-circle" style={{ width: 28, height: 28, marginLeft: "auto" }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="skeleton-content">
        {/* Sidebar + Main layout */}
        <div className="skeleton-layout">
          {/* Sidebar */}
          <aside className="skeleton-sidebar">
            {/* Avatar */}
            <div className="skeleton-bone skeleton-avatar" />
            {/* Name */}
            <div className="skeleton-bone" style={{ width: "75%", height: 20, marginTop: 16 }} />
            {/* Username + badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <div className="skeleton-bone" style={{ width: "45%", height: 14 }} />
              <div className="skeleton-bone" style={{ width: 56, height: 18, borderRadius: 999 }} />
            </div>
            {/* Bio lines */}
            <div className="skeleton-bone" style={{ width: "100%", height: 10, marginTop: 16 }} />
            <div className="skeleton-bone" style={{ width: "90%", height: 10, marginTop: 6 }} />
            <div className="skeleton-bone" style={{ width: "70%", height: 10, marginTop: 6 }} />
            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <div className="skeleton-bone" style={{ width: "55%", height: 32, borderRadius: 6 }} />
              <div className="skeleton-bone" style={{ width: "45%", height: 32, borderRadius: 6 }} />
            </div>
            {/* Meta */}
            <div className="skeleton-bone" style={{ width: "60%", height: 10, marginTop: 20 }} />
            <div className="skeleton-bone" style={{ width: "70%", height: 10, marginTop: 8 }} />
            <div className="skeleton-bone" style={{ width: "55%", height: 10, marginTop: 8 }} />
            {/* Divider */}
            <div className="skeleton-divider" />
            {/* Badges */}
            <div className="skeleton-bone" style={{ width: "40%", height: 8, marginTop: 0 }} />
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" as const }}>
              <div className="skeleton-bone" style={{ width: 88, height: 22, borderRadius: 999 }} />
              <div className="skeleton-bone" style={{ width: 72, height: 22, borderRadius: 999 }} />
              <div className="skeleton-bone" style={{ width: 80, height: 22, borderRadius: 999 }} />
            </div>
          </aside>

          {/* Main content */}
          <div className="skeleton-main">
            {/* README card */}
            <div className="skeleton-card">
              <div className="skeleton-card-header">
                <div className="skeleton-bone" style={{ width: 16, height: 16, borderRadius: 3 }} />
                <div className="skeleton-bone" style={{ width: 80, height: 12 }} />
              </div>
              <div className="skeleton-card-body">
                {/* Heading */}
                <div className="skeleton-bone" style={{ width: "35%", height: 22, marginBottom: 20 }} />
                {/* Paragraphs */}
                <div className="skeleton-bone" style={{ width: "100%", height: 10, marginTop: 12 }} />
                <div className="skeleton-bone" style={{ width: "95%", height: 10, marginTop: 6 }} />
                <div className="skeleton-bone" style={{ width: "80%", height: 10, marginTop: 6 }} />
                <div className="skeleton-bone" style={{ width: "100%", height: 10, marginTop: 16 }} />
                <div className="skeleton-bone" style={{ width: "85%", height: 10, marginTop: 6 }} />
                {/* Quick Facts */}
                <div className="skeleton-divider" />
                <div className="skeleton-bone" style={{ width: "30%", height: 14, marginTop: 4 }} />
                <div className="skeleton-bone" style={{ width: "70%", height: 10, marginTop: 10 }} />
                <div className="skeleton-bone" style={{ width: "65%", height: 10, marginTop: 8 }} />
                <div className="skeleton-bone" style={{ width: "50%", height: 10, marginTop: 8 }} />
                {/* Code tags */}
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  <div className="skeleton-bone" style={{ width: 52, height: 20, borderRadius: 4 }} />
                  <div className="skeleton-bone" style={{ width: 52, height: 20, borderRadius: 4 }} />
                  <div className="skeleton-bone" style={{ width: 72, height: 20, borderRadius: 4 }} />
                </div>
              </div>
            </div>

            {/* Contribution graph card */}
            <div className="skeleton-card" style={{ marginTop: 16 }}>
              <div className="skeleton-card-header">
                <div className="skeleton-bone" style={{ width: 110, height: 12 }} />
                <div className="skeleton-bone" style={{ width: 90, height: 12, marginLeft: "auto" }} />
              </div>
              <div className="skeleton-card-body">
                {/* Graph area */}
                <div className="skeleton-bone" style={{ width: "100%", height: 140, borderRadius: 6 }} />
                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <div className="skeleton-bone" style={{ width: "100%", height: 80, borderRadius: 6 }} />
                  <div className="skeleton-bone" style={{ width: "100%", height: 80, borderRadius: 6 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
