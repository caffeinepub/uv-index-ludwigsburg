import { Skeleton } from "@/components/ui/skeleton";
import { getUVRisk } from "@/types/uv";
import type { HourlyForecastEntry } from "@/types/uv";
import { motion } from "motion/react";

interface HourlyForecastProps {
  forecast: HourlyForecastEntry[];
  isLoading?: boolean;
}

function SunIcon({ colorVar }: { colorVar: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" fill={colorVar} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="12"
          x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
          y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
          stroke={colorVar}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function HourCard({
  entry,
  index,
}: { entry: HourlyForecastEntry; index: number }) {
  const risk = getUVRisk(entry.uvIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col items-center justify-between gap-2 rounded-xl border p-3 min-w-[72px] cursor-default transition-smooth hover:shadow-md"
      style={{
        backgroundColor: risk.bgStyle,
        borderColor: risk.borderStyle,
      }}
      data-ocid={`forecast-hour-${index}`}
    >
      <span className="text-xs font-semibold text-muted-foreground">
        {entry.time}
      </span>
      <span
        className="text-2xl font-bold leading-none"
        style={{ color: risk.colorVar }}
      >
        {Math.round(entry.uvIndex)}
      </span>
      <SunIcon colorVar={risk.colorVar} />
    </motion.div>
  );
}

const SKELETON_KEYS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
] as const;

export function HourlyForecast({ forecast, isLoading }: HourlyForecastProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <h2 className="text-base font-semibold text-foreground mb-4">
        Hourly Forecast
      </h2>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {SKELETON_KEYS.map((k) => (
            <Skeleton
              key={k}
              className="h-24 w-[72px] flex-shrink-0 rounded-xl"
            />
          ))}
        </div>
      ) : forecast.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No forecast data available.
        </p>
      ) : (
        <ul className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin list-none">
          {forecast.slice(0, 12).map((entry, i) => (
            <li key={entry.time} className="flex-shrink-0">
              <HourCard entry={entry} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
