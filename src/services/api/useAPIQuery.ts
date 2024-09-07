import { useQuery } from "@tanstack/react-query";
import { getAIResponse } from "@/services/api";

export function useAIQuery(input: string) {
  return useQuery({
    queryKey: ["ai", input],
    queryFn: () => getAIResponse(input),
    staleTime: 1000 * 60 * 5, // Consider responses stale after 5 minutes
    enabled: false,
  });
}
