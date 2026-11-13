"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { createGeneration, getGeneration, getGenerationPhoto } from "@/api/generations/generations";

export function useGenerationPhoto(url: string | null) {
  return useQuery({
    queryKey: ["generation-photo", url],
    queryFn: ({ signal }) => getGenerationPhoto(url!, signal),
    enabled: Boolean(url),
    staleTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateGeneration() {
  return useMutation({ mutationFn: createGeneration, retry: false });
}

export function useGenerationResult(id: string | null) {
  return useQuery({
    queryKey: ["generation", id],
    queryFn: ({ signal }) => getGeneration(id!, signal),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      if (query.state.status === "error") return false;
      return !query.state.data || ["pending", "processing"].includes(query.state.data.status) ? 5000 : false;
    },
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
