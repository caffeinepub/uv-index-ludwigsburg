import { getUVRisk } from "@/types/uv";

interface UVBadgeProps {
  uvIndex: number;
  size?: "sm" | "md" | "lg";
}

export function UVBadge({ uvIndex, size = "md" }: UVBadgeProps) {
  const risk = getUVRisk(uvIndex);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClasses[size]}`}
      style={{
        backgroundColor: risk.bgStyle,
        color: risk.textStyle,
        borderColor: risk.borderStyle,
      }}
      data-ocid="uv-badge"
    >
      {risk.level}
    </span>
  );
}

interface UVScaleBarProps {
  uvIndex: number;
}

const SCALE_SEGMENTS = [
  { label: "Low", max: 2, colorVar: "var(--uv-low-accent)" },
  { label: "Mod", max: 5, colorVar: "var(--uv-moderate-accent)" },
  { label: "High", max: 7, colorVar: "var(--uv-high-accent)" },
  { label: "V.High", max: 10, colorVar: "var(--uv-veryhigh-accent)" },
  { label: "Extreme", max: 14, colorVar: "var(--uv-extreme-accent)" },
];

export function UVScaleBar({ uvIndex }: UVScaleBarProps) {
  const clampedUV = Math.min(uvIndex, 14);
  const pct = (clampedUV / 14) * 100;
  const indicatorColor =
    SCALE_SEGMENTS.find((s) => uvIndex <= s.max)?.colorVar ??
    "var(--uv-extreme-accent)";

  return (
    <div
      className="w-full space-y-1.5"
      aria-label={`UV Index scale: ${uvIndex}`}
    >
      <div className="relative h-3 rounded-full overflow-hidden flex">
        {SCALE_SEGMENTS.map((seg) => (
          <div
            key={seg.label}
            className="flex-1 h-full opacity-30"
            style={{ backgroundColor: seg.colorVar }}
          />
        ))}
        {/* Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-md transition-all duration-500"
          style={{
            left: `calc(${pct}% - 8px)`,
            backgroundColor: indicatorColor,
            borderColor: "white",
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        {SCALE_SEGMENTS.map((seg) => (
          <span key={seg.label}>{seg.label}</span>
        ))}
      </div>
    </div>
  );
}
