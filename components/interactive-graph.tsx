"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface DayData {
  date: string; // "Mar 15"
  fullDate: string; // "2025-03-15"
  count: number;
  level: number;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


/**
 * Interactive SVG contribution graph with hover tooltips and month filter.
 * Fetches real contribution data via server-side scraping of GitHub.
 */
export function InteractiveGraph({ isDark }: { isDark: boolean }) {
  const [allDays, setAllDays] = useState<ContributionDay[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(new Date().getMonth());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real GitHub contribution data via server-side API
  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("/api/contributions");
        const data = await res.json();
        if (data.days && data.days.length > 0) {
          setAllDays(data.days);
        }
      } catch {
        setAllDays([]);
      }
    }
    fetchContributions();
  }, []);

  // Build available years from the data
  const availableYears = useMemo<number[]>(() => {
    if (allDays.length === 0) return [];
    const years = new Set<number>();
    for (const d of allDays) {
      const yr = parseInt(d.date.split("-")[0], 10);
      years.add(yr);
    }
    return Array.from(years).sort((a, b) => b - a); // newest first
  }, [allDays]);

  // Check which months have data for the selected year
  const monthsWithData = useMemo<Set<number>>(() => {
    const set = new Set<number>();
    for (const d of allDays) {
      const dt = new Date(d.date + "T00:00:00");
      if (dt.getFullYear() === selectedYear) {
        set.add(dt.getMonth());
      }
    }
    return set;
  }, [allDays, selectedYear]);

  // Filter data for the selected month
  const dailyData = useMemo<DayData[]>(() => {
    if (allDays.length === 0) return [];

    const filtered = allDays.filter((d) => {
      const dt = new Date(d.date + "T00:00:00");
      return (
        dt.getFullYear() === selectedYear &&
        dt.getMonth() === selectedMonthIdx
      );
    });

    return filtered.map((d) => {
      const dateObj = new Date(d.date + "T00:00:00");
      const label = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return {
        date: label,
        fullDate: d.date,
        count: d.count,
        level: d.level,
      };
    });
  }, [allDays, selectedYear, selectedMonthIdx]);

  // Reset animation when month changes
  useEffect(() => {
    setIsLoaded(false);
    setHoveredIndex(null);
    if (dailyData.length > 0) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [dailyData]);

  // Chart dimensions
  const width = 680;
  const height = 200;
  const padding = { top: 30, right: 20, bottom: 35, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxCount = Math.max(...dailyData.map((d) => d.count), 1);

  const getX = useCallback(
    (i: number) =>
      padding.left +
      (dailyData.length > 1 ? (i / (dailyData.length - 1)) * chartW : 0),
    [dailyData.length, chartW, padding.left]
  );
  const getY = useCallback(
    (count: number) => padding.top + chartH - (count / maxCount) * chartH,
    [maxCount, chartH, padding.top]
  );

  /**
   * Build a smooth SVG path using cardinal spline (catmull-rom to bezier).
   */
  const buildSmoothPath = useCallback(
    (data: DayData[], closed = false) => {
      if (data.length < 2) return "";
      const points = data.map((d, i) => ({ x: getX(i), y: getY(d.count) }));
      const tension = 0.3;

      let path = `M ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
        const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;
        const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
        const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      if (closed) {
        const lastPt = points[points.length - 1];
        const firstPt = points[0];
        path += ` L ${lastPt.x} ${padding.top + chartH}`;
        path += ` L ${firstPt.x} ${padding.top + chartH} Z`;
      }

      return path;
    },
    [getX, getY, chartH, padding.top]
  );

  const linePath = buildSmoothPath(dailyData);
  const areaPath = buildSmoothPath(dailyData, true);

  // Calculate path length for stroke animation
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [dailyData]);

  // Handle mouse move on chart
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || dailyData.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = width / rect.width;
    const scaledX = mouseX * scaleX;

    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < dailyData.length; i++) {
      const dist = Math.abs(getX(i) - scaledX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    setHoveredIndex(closestIdx);

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tipX = e.clientX - containerRect.left;
      const tipY = e.clientY - containerRect.top;
      setTooltipPos({ x: tipX, y: tipY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Theme colors
  const colors = {
    line: isDark ? "#3fb950" : "#2da44e",
    areaFill: isDark ? "rgba(63,185,80,0.15)" : "rgba(45,164,78,0.12)",
    point: isDark ? "#3fb950" : "#2da44e",
    pointHover: isDark ? "#56d364" : "#1a7f37",
    grid: isDark ? "rgba(48,54,61,0.6)" : "rgba(208,215,222,0.6)",
    text: isDark ? "#8b949e" : "#656d76",
    bg: isDark ? "#0d1117" : "#f6f8fa",
    tooltipBg: isDark ? "#30363d" : "#ffffff",
    tooltipBorder: isDark ? "#484f58" : "#d0d7de",
    tooltipText: isDark ? "#e6edf3" : "#1f2328",
    tooltipSub: isDark ? "#8b949e" : "#656d76",
    filterBg: isDark ? "#21262d" : "#f0f3f6",
    filterActiveBg: isDark ? "#30363d" : "#ffffff",
    filterBorder: isDark ? "#30363d" : "#d0d7de",
    filterText: isDark ? "#c9d1d9" : "#24292f",
    filterActiveText: isDark ? "#3fb950" : "#2da44e",
  };

  // Y-axis labels
  const yTicks = [0, Math.ceil(maxCount / 2), maxCount];

  // Monthly total for selected month
  const monthTotal = dailyData.reduce((sum, d) => sum + d.count, 0);

  if (allDays.length === 0) {
    return (
      <div
        className="w-full rounded-md animate-pulse"
        style={{ height: "240px", background: colors.bg }}
      />
    );
  }

  return (
    <div ref={containerRef} className="relative graph-container">
      {/* Year Filter Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                // Auto-select current month if same year, otherwise last available month
                const now = new Date();
                if (yr === now.getFullYear()) {
                  setSelectedMonthIdx(now.getMonth());
                } else {
                  // Find the last month with data for this year
                  const monthsForYear = allDays
                    .filter((d) => d.date.startsWith(`${yr}-`))
                    .map((d) => new Date(d.date + "T00:00:00").getMonth());
                  const maxMonth = Math.max(...monthsForYear);
                  setSelectedMonthIdx(maxMonth >= 0 ? maxMonth : 11);
                }
              }}
              className="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200"
              style={{
                backgroundColor: selectedYear === yr
                  ? colors.filterActiveBg
                  : "transparent",
                color: selectedYear === yr
                  ? colors.filterActiveText
                  : colors.text,
                border: selectedYear === yr
                  ? `1px solid ${colors.filterBorder}`
                  : "1px solid transparent",
                boxShadow: selectedYear === yr
                  ? isDark
                    ? "0 1px 3px rgba(0,0,0,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.1)"
                  : "none",
              }}
            >
              {yr}
            </button>
          ))}
        </div>
        {/* Monthly total badge */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium flex-shrink-0"
          style={{
            backgroundColor: colors.filterBg,
            color: colors.text,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.line }}
          />
          {monthTotal} contributions
        </div>
      </div>

      {/* Month Filter Row: Jan–Dec — horizontal scroll on mobile */}
      <div className="flex items-center gap-1 mb-3 overflow-x-auto no-scrollbar pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {MONTH_LABELS.map((label, idx) => {
          const isActive = selectedMonthIdx === idx;
          const hasData = monthsWithData.has(idx);
          return (
            <button
              key={idx}
              onClick={() => hasData && setSelectedMonthIdx(idx)}
              className="px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive
                  ? colors.filterActiveBg
                  : "transparent",
                color: isActive
                  ? colors.filterActiveText
                  : hasData
                  ? colors.text
                  : isDark
                  ? "rgba(139,148,158,0.35)"
                  : "rgba(101,109,118,0.35)",
                border: isActive
                  ? `1px solid ${colors.filterBorder}`
                  : "1px solid transparent",
                cursor: hasData ? "pointer" : "default",
                opacity: hasData ? 1 : 0.5,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* SVG Chart */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block cursor-crosshair"
        style={{ minHeight: "180px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background */}
        <rect width={width} height={height} rx={6} fill={colors.bg} />

        {/* Grid lines */}
        {yTicks.map((tick) => (
          <line
            key={tick}
            x1={padding.left}
            y1={getY(tick)}
            x2={width - padding.right}
            y2={getY(tick)}
            stroke={colors.grid}
            strokeDasharray="3 3"
            strokeWidth={0.5}
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={`y-${tick}`}
            x={padding.left - 8}
            y={getY(tick) + 3}
            textAnchor="end"
            fontSize={9}
            fill={colors.text}
            fontFamily="var(--font-inter), sans-serif"
          >
            {tick}
          </text>
        ))}

        {/* X-axis labels */}
        {dailyData.map((d, i) => {
          // Show every 5th label or first/last
          const showLabel =
            i === 0 ||
            i === dailyData.length - 1 ||
            i % Math.max(1, Math.floor(dailyData.length / 6)) === 0;
          return showLabel ? (
            <text
              key={`x-${i}`}
              x={getX(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize={8}
              fill={colors.text}
              fontFamily="var(--font-inter), sans-serif"
            >
              {d.date}
            </text>
          ) : null;
        })}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={colors.areaFill}
          className={`transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Animated line */}
        <path
          ref={pathRef}
          d={linePath}
          fill="none"
          stroke={colors.line}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength || 2000,
            strokeDashoffset: isLoaded ? 0 : pathLength || 2000,
            transition:
              "stroke-dashoffset 1.8s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />

        {/* Glow line */}
        <path
          d={linePath}
          fill="none"
          stroke={colors.line}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.2}
          filter="blur(3px)"
          className={`transition-opacity duration-1000 ${
            isLoaded ? "opacity-20" : "opacity-0"
          }`}
          style={{ pointerEvents: "none" }}
        />

        {/* Data points */}
        {dailyData.map((d, i) => (
          <g key={i}>
            {hoveredIndex === i && (
              <line
                x1={getX(i)}
                y1={padding.top}
                x2={getX(i)}
                y2={padding.top + chartH}
                stroke={colors.line}
                strokeWidth={1}
                opacity={0.3}
                strokeDasharray="4 2"
              />
            )}

            <circle
              cx={getX(i)}
              cy={getY(d.count)}
              r={hoveredIndex === i ? 5 : d.count > 0 ? 3 : 1.5}
              fill={
                hoveredIndex === i
                  ? colors.pointHover
                  : d.count > 0
                  ? colors.point
                  : colors.grid
              }
              stroke={hoveredIndex === i ? colors.bg : "none"}
              strokeWidth={2}
              className="transition-all duration-150"
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: `opacity 0.3s ease ${i * 0.03}s, r 0.15s ease, fill 0.15s ease`,
              }}
            />

            {hoveredIndex === i && d.count > 0 && (
              <circle
                cx={getX(i)}
                cy={getY(d.count)}
                r={10}
                fill="none"
                stroke={colors.pointHover}
                strokeWidth={1.5}
                opacity={0.3}
              />
            )}
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 0}
          textAnchor="middle"
          fontSize={9}
          fill={colors.text}
          fontFamily="var(--font-inter), sans-serif"
        >
          Days
        </text>
        <text
          x={6}
          y={padding.top + chartH / 2}
          textAnchor="middle"
          fontSize={9}
          fill={colors.text}
          fontFamily="var(--font-inter), sans-serif"
          transform={`rotate(-90 6 ${padding.top + chartH / 2})`}
        >
          Contributions
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && dailyData[hoveredIndex] && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: Math.min(
              tooltipPos.x + 12,
              (containerRef.current?.offsetWidth ?? 300) - 180
            ),
            top: tooltipPos.y - 70,
            transform: "translateY(-50%)",
          }}
        >
          <div
            className="px-3 py-2 rounded-lg shadow-xl text-xs"
            style={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              minWidth: "140px",
            }}
          >
            <div
              className="font-semibold mb-1"
              style={{ color: colors.tooltipText }}
            >
              {dailyData[hoveredIndex].date}
            </div>
            <div style={{ color: colors.tooltipSub }}>
              <span
                className="font-bold"
                style={{ color: colors.line }}
              >
                {dailyData[hoveredIndex].count}
              </span>{" "}
              {dailyData[hoveredIndex].count === 1
                ? "contribution"
                : "contributions"}
            </div>
            {dailyData[hoveredIndex].count > 0 && (
              <div
                className="mt-1.5 pt-1.5 flex items-center gap-1.5"
                style={{
                  borderTop: `1px solid ${colors.tooltipBorder}`,
                }}
              >
                <span
                  className="text-[10px]"
                  style={{ color: colors.tooltipSub }}
                >
                  Activity:
                </span>
                {[1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{
                      backgroundColor:
                        lvl <= dailyData[hoveredIndex].level
                          ? colors.line
                          : isDark
                          ? "rgba(48,54,61,0.6)"
                          : "rgba(208,215,222,0.6)",
                    }}
                  />
                ))}
              </div>
            )}
            {dailyData[hoveredIndex].count === 0 && (
              <div
                className="text-[10px] mt-0.5 italic"
                style={{ color: colors.tooltipSub }}
              >
                No activity
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
