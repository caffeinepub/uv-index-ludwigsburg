export type UVRiskLevel = "Low" | "Moderate" | "High" | "Very High" | "Extreme";

export interface HourlyForecastEntry {
  time: string;
  uvIndex: number;
}

export interface UVData {
  currentUVIndex: number;
  currentRiskLevel: string;
  hourlyForecast: HourlyForecastEntry[];
  lastUpdated: string;
}

export interface UVRiskInfo {
  level: UVRiskLevel;
  range: string;
  /** CSS variable name for accent color, e.g. "var(--uv-low-accent)" */
  colorVar: string;
  bgStyle: string;
  textStyle: string;
  borderStyle: string;
  badgeClass: string;
  recommendation: string;
  tips: string[];
  safeExposure: string;
}

export const UV_RISK_TABLE: UVRiskInfo[] = [
  {
    level: "Low",
    range: "0–2",
    colorVar: "var(--uv-low-accent)",
    bgStyle: "var(--uv-low-bg)",
    textStyle: "var(--uv-low-text)",
    borderStyle: "var(--uv-low-border)",
    badgeClass: "uv-badge-safe",
    recommendation: "No protection needed. Safe to be outside.",
    tips: ["No special protection required", "Enjoy the outdoors"],
    safeExposure: "Up to 60 minutes",
  },
  {
    level: "Moderate",
    range: "3–5",
    colorVar: "var(--uv-moderate-accent)",
    bgStyle: "var(--uv-moderate-bg)",
    textStyle: "var(--uv-moderate-text)",
    borderStyle: "var(--uv-moderate-border)",
    badgeClass: "uv-badge-low",
    recommendation: "Some protection recommended. Wear sunscreen.",
    tips: [
      "Apply SPF 30+ sunscreen",
      "Wear a hat outdoors",
      "Seek shade near noon",
    ],
    safeExposure: "Up to 30 minutes",
  },
  {
    level: "High",
    range: "6–7",
    colorVar: "var(--uv-high-accent)",
    bgStyle: "var(--uv-high-bg)",
    textStyle: "var(--uv-high-text)",
    borderStyle: "var(--uv-high-border)",
    badgeClass: "uv-badge-moderate",
    recommendation: "Protection required. Seek shade during midday.",
    tips: [
      "Wear SPF 30+ sunscreen",
      "Wear protective clothing & hat",
      "Seek shade from 11am–3pm",
    ],
    safeExposure: "15–20 minutes",
  },
  {
    level: "Very High",
    range: "8–10",
    colorVar: "var(--uv-veryhigh-accent)",
    bgStyle: "var(--uv-veryhigh-bg)",
    textStyle: "var(--uv-veryhigh-text)",
    borderStyle: "var(--uv-veryhigh-border)",
    badgeClass: "uv-badge-high",
    recommendation: "Extra protection required. Minimize outdoor time.",
    tips: [
      "Apply SPF 50+ sunscreen every 2h",
      "Wear full-coverage clothing",
      "Avoid sun 10am–4pm",
    ],
    safeExposure: "10 minutes or less",
  },
  {
    level: "Extreme",
    range: "11+",
    colorVar: "var(--uv-extreme-accent)",
    bgStyle: "var(--uv-extreme-bg)",
    textStyle: "var(--uv-extreme-text)",
    borderStyle: "var(--uv-extreme-border)",
    badgeClass: "uv-badge-extreme",
    recommendation: "Danger — avoid outdoor exposure at peak hours.",
    tips: [
      "Avoid outdoor activities at midday",
      "Maximum sun protection required",
      "Stay indoors when possible",
    ],
    safeExposure: "Avoid entirely",
  },
];

export function getUVRisk(uvIndex: number): UVRiskInfo {
  if (uvIndex <= 2) return UV_RISK_TABLE[0];
  if (uvIndex <= 5) return UV_RISK_TABLE[1];
  if (uvIndex <= 7) return UV_RISK_TABLE[2];
  if (uvIndex <= 10) return UV_RISK_TABLE[3];
  return UV_RISK_TABLE[4];
}

export function getUVRiskByLevel(level: string): UVRiskInfo {
  const normalized = level.trim();
  const match = UV_RISK_TABLE.find(
    (r) => r.level.toLowerCase() === normalized.toLowerCase(),
  );
  return match ?? UV_RISK_TABLE[0];
}
