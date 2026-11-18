import { useMutation, useQuery } from "@tanstack/react-query";

import { getRawInitData, initializeTelegram, isTelegramEnvironment } from "@/lib/telegram";
import { removeAccessToken, saveAccessToken } from "@/api/client";

import { authenticateWithTelegram } from "@/api/auth/auth";

function useTelegramAuth() {
  return useMutation({ mutationFn: authenticateWithTelegram });
}

export { useTelegramAuth };

export function useStartupAuth() {
  return useQuery({
    queryKey: ["startup-auth"],
    queryFn: async ({ signal }) => {
      removeAccessToken();
      if (!isTelegramEnvironment()) return null;

      initializeTelegram();
      const initData = getRawInitData();
      if (!initData) throw new Error("Откройте приложение через Telegram. Данные для входа отсутствуют.");
      const response = await authenticateWithTelegram({ initData, signal });
      if (!signal.aborted) saveAccessToken(response.access_token);
      return response;
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
