import { type UVRiskInfo, UV_RISK_TABLE, getUVRisk } from "@/types/uv";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";

interface SunSafetyTableProps {
  currentUVIndex?: number;
}

const PROTECTION_MEASURES = [
  "No protection needed",
  "SPF 30+ sunscreen",
  "Hat & sunglasses",
  "Protective clothing",
  "Limit outdoor time",
  "Avoid peak hours",
];

const PROTECTION_MATRIX: boolean[][] = [
  // Low   Mod   High  VHigh  Extreme
  [true, false, false, false, false], // No protection
  [false, true, true, true, true], // SPF 30+
  [false, true, true, true, true], // Hat & sunglasses
  [false, false, true, true, true], // Protective clothing
  [false, false, false, true, true], // Limit outdoors
  [false, false, false, true, true], // Avoid peak hours
];

function ActiveRiskCard({ risk }: { risk: UVRiskInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-4"
      style={{
        backgroundColor: risk.bgStyle,
        borderColor: risk.borderStyle,
      }}
      data-ocid="active-risk-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Sun Safety Tips
          </p>
          <ul className="space-y-1">
            {risk.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-1.5 text-sm">
                <CheckCircle2
                  className="mt-0.5 flex-shrink-0"
                  size={13}
                  style={{ color: risk.colorVar }}
                />
                <span style={{ color: risk.textStyle }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="text-right flex-shrink-0"
          style={{ color: risk.textStyle }}
        >
          <p className="text-xs font-medium text-muted-foreground">
            Estimated safe
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            sun exposure:
          </p>
          <p className="text-sm font-bold mt-0.5">{risk.safeExposure}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function SunSafetyTable({ currentUVIndex }: SunSafetyTableProps) {
  const currentRisk =
    currentUVIndex !== undefined ? getUVRisk(currentUVIndex) : null;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
      <h2 className="text-base font-semibold text-foreground">
        Sun Protection Guide
      </h2>

      {currentRisk && <ActiveRiskCard risk={currentRisk} />}

      {/* Protection matrix table */}
      <div className="overflow-x-auto">
        <table
          className="w-full text-xs border-collapse"
          data-ocid="sun-safety-table"
        >
          <thead>
            <tr>
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium min-w-[150px]">
                Protection Measure
              </th>
              {UV_RISK_TABLE.map((r) => (
                <th key={r.level} className="px-2 py-2 text-center">
                  <span
                    className="inline-block text-[10px] font-bold leading-tight"
                    style={{ color: r.colorVar }}
                  >
                    {r.range}
                    <br />
                    <span className="font-semibold">{r.level}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROTECTION_MEASURES.map((measure, mi) => (
              <tr
                key={measure}
                className="border-t border-border/50 hover:bg-muted/40 transition-colors"
              >
                <td className="py-2 pr-3 text-foreground font-medium">
                  {measure}
                </td>
                {UV_RISK_TABLE.map((r, ri) => (
                  <td key={r.level} className="px-2 py-2 text-center">
                    {PROTECTION_MATRIX[mi][ri] ? (
                      <CheckCircle2
                        size={14}
                        className="inline-block"
                        style={{ color: r.colorVar }}
                        aria-label="Required"
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className="inline-block text-muted-foreground/30"
                        aria-label="Not required"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safe exposure times */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Safe Exposure Time
        </p>
        <div className="flex flex-wrap gap-2">
          {UV_RISK_TABLE.map((r) => (
            <div
              key={r.level}
              className="rounded-lg border px-3 py-1.5 text-xs"
              style={{
                backgroundColor: r.bgStyle,
                borderColor: r.borderStyle,
              }}
            >
              <span className="font-semibold" style={{ color: r.colorVar }}>
                {r.level}:
              </span>{" "}
              <span style={{ color: r.textStyle }}>{r.safeExposure}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
