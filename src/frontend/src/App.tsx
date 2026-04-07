import { HourlyForecast } from "@/components/HourlyForecast";
import { SunSafetyTable } from "@/components/SunSafetyTable";
import { UVIndexCard } from "@/components/UVIndexCard";
import { Button } from "@/components/ui/button";
import { useUVData } from "@/hooks/use-uv-data";
import { MapPin, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const { data, isLoading, isError, refetch, isRefetching } = useUVData();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight font-display">
                Ludwigsburg, Germany
              </h1>
              {data?.lastUpdated ? (
                <p className="text-xs text-muted-foreground">
                  Last Updated: {data.lastUpdated}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  UV Index Monitor
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefetching || isLoading}
            aria-label="Refresh UV data"
            data-ocid="refresh-button"
            className="rounded-xl border-primary/30 hover:bg-primary/10 transition-smooth"
          >
            <RefreshCw
              size={16}
              className={`text-primary ${isRefetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        {isError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-8 text-center"
            data-ocid="error-state"
          >
            <p className="text-muted-foreground text-sm mb-3">
              Could not load UV data. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              data-ocid="retry-button"
            >
              <RefreshCw size={14} className="mr-2" />
              Retry
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <UVIndexCard
                uvIndex={data?.currentUVIndex ?? 0}
                riskLevel={data?.currentRiskLevel ?? ""}
                isLoading={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <HourlyForecast
                forecast={data?.hourlyForecast ?? []}
                isLoading={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <SunSafetyTable currentUVIndex={data?.currentUVIndex} />
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
