import { Skeleton } from "@/components/ui/skeleton";
import { getUVRisk } from "@/types/uv";
import { motion } from "motion/react";
import { UVScaleBar } from "./UVBadge";

interface UVIndexCardProps {
  uvIndex: number;
  riskLevel: string;
  isLoading?: boolean;
}

export function UVIndexCard({
  uvIndex,
  riskLevel,
  isLoading,
}: UVIndexCardProps) {
  const risk = getUVRisk(uvIndex);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
        <Skeleton className="h-5 w-36 mb-6 mx-auto" />
        <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
        <Skeleton className="h-7 w-24 mx-auto mb-2" />
        <Skeleton className="h-4 w-56 mx-auto mb-6" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
    );
  }

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
      data-ocid="uv-index-card"
    >
      {/* Top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: risk.colorVar }}
      />

      <div className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Current UV Index
        </p>

        <motion.div
          key={uvIndex}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <span
            className="font-display font-bold leading-none"
            style={{
              fontSize: "7rem",
              color: risk.colorVar,
              lineHeight: 1,
            }}
            aria-label={`UV Index ${uvIndex}`}
          >
            {uvIndex.toFixed(1).replace(/\.0$/, "")}
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center gap-1.5"
        >
          <span
            className="text-2xl font-bold tracking-tight uppercase"
            style={{ color: risk.colorVar }}
          >
            {riskLevel || risk.level}
          </span>
          <p className="text-sm text-muted-foreground max-w-xs">
            {risk.recommendation}
          </p>
        </motion.div>

        <div className="w-full max-w-xs pt-2">
          <UVScaleBar uvIndex={uvIndex} />
        </div>
      </div>
    </div>
  );
}
