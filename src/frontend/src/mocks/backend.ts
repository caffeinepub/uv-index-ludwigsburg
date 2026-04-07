import type { backendInterface } from "../backend";

export const mockBackend: backendInterface = {
  getUVData: async () => ({
    __kind__: "ok" as const,
    ok: {
      currentUVIndex: 7,
      currentRiskLevel: "High",
      lastUpdated: "2026-04-07T12:00:00Z",
      hourlyForecast: [
        { time: "08:00", uvIndex: 2 },
        { time: "09:00", uvIndex: 3 },
        { time: "10:00", uvIndex: 5 },
        { time: "11:00", uvIndex: 6 },
        { time: "12:00", uvIndex: 7 },
        { time: "13:00", uvIndex: 8 },
        { time: "14:00", uvIndex: 7 },
        { time: "15:00", uvIndex: 5 },
        { time: "16:00", uvIndex: 3 },
        { time: "17:00", uvIndex: 1 },
      ],
    },
  }),
  transform: async (input) => ({
    status: BigInt(200),
    body: new Uint8Array(),
    headers: [],
  }),
};
