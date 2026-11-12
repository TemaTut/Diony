import api from "@/api/client";

interface AuthResponse {
  access_token: string;
  token_type: "Bearer";
}

interface TelegramAuthInput {
  initData: string;
  signal?: AbortSignal;
}

async function authenticateWithTelegram({ initData, signal }: TelegramAuthInput) {
  const { data } = await api.post<AuthResponse>("/auth/telegram", { initData }, { signal });
  return data;
}

export type { AuthResponse, TelegramAuthInput };
export { authenticateWithTelegram };
