import * as Telegram from "@telegram-apps/sdk";

import { colors } from "../../tailwind.config";

let initialized = false;

export { Telegram };

const MOCK_INIT_DATA = process.env.NEXT_PUBLIC_MOCK_INIT_DATA;

export function isTelegramEnvironment(): boolean {
  return typeof window !== "undefined" && Telegram.isTMA();
}

export function initializeTelegram(): void {
  if (initialized) {
    return;
  }

  if (!isTelegramEnvironment()) {
    initialized = true;
    return;
  }

  Telegram.init();
  initialized = true;

  try {
    Telegram.postEvent("web_app_expand");
    Telegram.postEvent("web_app_request_fullscreen");
    Telegram.postEvent("web_app_setup_swipe_behavior", {
      allow_vertical_swipe: false,
    });
    Telegram.postEvent("web_app_set_background_color", {
      color: colors.background,
    });
    Telegram.postEvent("web_app_set_header_color", {
      color: colors.background,
    });
  } catch {}
}

export function getRawInitData(): string | undefined {
  if (!isTelegramEnvironment()) {
    return process.env.NODE_ENV === "development" ? MOCK_INIT_DATA : undefined;
  }

  return Telegram.retrieveRawInitData();
}
