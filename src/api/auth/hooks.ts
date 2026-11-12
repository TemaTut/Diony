import { useMutation } from "@tanstack/react-query";

import { authenticateWithTelegram } from "@/api/auth/auth";

function useTelegramAuth() {
  return useMutation({ mutationFn: authenticateWithTelegram });
}

export { useTelegramAuth };
