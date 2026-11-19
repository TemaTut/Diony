import axios from "axios";

interface AuthResponse {
  access_token: string;
  token_type: "Bearer";
}

interface TelegramAuthInput {
  initData: string;
  signal?: AbortSignal;
}

async function authenticateWithTelegram({ initData, signal }: TelegramAuthInput) {
  const baseURL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
  if (!baseURL) throw new Error("Не настроен адрес сервиса авторизации.");
  const url = `${baseURL.replace(/\/+$/, "")}/auth/telegram`;
  const { data } = await axios.post<AuthResponse>(url, { initData }, { signal, timeout: 15_000 });
  if (typeof data?.access_token !== "string" || !data.access_token || data.token_type !== "Bearer") {
    throw new Error("Сервис авторизации вернул некорректный токен.");
  }
  return data;
}

export function authErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = error.response?.data?.error?.code;
    if (code === "telegram_data_expired") return "Данные Telegram устарели. Закройте и заново откройте Mini App.";
    if (code === "telegram_data_invalid") return "Не удалось подтвердить вход через Telegram. Проверьте токен бота и заново откройте Mini App.";
    if (code === "user_blocked") return "Доступ к аккаунту заблокирован.";
    if (!error.response) return "Сервис авторизации недоступен. Проверьте адрес API, подключение и ALLOWED_ORIGIN.";
    return `Ошибка авторизации (HTTP ${error.response.status}). Попробуйте открыть приложение заново.`;
  }
  return error instanceof Error ? error.message : "Не удалось войти.";
}

export type { AuthResponse, TelegramAuthInput };
export { authenticateWithTelegram };
