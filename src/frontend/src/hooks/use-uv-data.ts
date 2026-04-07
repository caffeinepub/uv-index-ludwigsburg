import { createActor } from "@/backend";
import type { UVData } from "@/types/uv";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useUVData() {
  const { actor, isFetching: actorLoading } = useActor(createActor);

  const query = useQuery<UVData | null>({
    queryKey: ["uvData"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getUVData();
      if (result.__kind__ === "ok") {
        return result.ok as UVData;
      }
      throw new Error(result.err);
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 30 * 60 * 1000, // 30 minutes
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: actorLoading || query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    lastUpdated: query.dataUpdatedAt,
  };
}
