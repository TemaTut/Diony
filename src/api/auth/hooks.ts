import { useMutation, useQuery } from "@tanstack/react-query";

import { getRawInitData, initializeTelegram, isTelegramEnvironment } from "@/lib/telegram";

import { authenticateWithTelegram } from "@/api/auth/auth";

function useTelegramAuth() {
  return useMutation({ mutationFn: authenticateWithTelegram });
}

export { useTelegramAuth };

export function useStartupAuth() {
  return useQuery({
    queryKey: ["startup-auth"],
    queryFn: async () => {
      if (!isTelegramEnvironment()) return null;

      initializeTelegram();
      getRawInitData();
      return null;
    },
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
