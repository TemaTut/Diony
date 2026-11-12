import * as Telegram from "@telegram-apps/sdk";

import { colors } from "../../tailwind.config";

let initialized = false;

export { Telegram };

const MOCK_INIT_DATA = process.env.NEXT_PUBLIC_MOCK_INIT_DATA;

export function isTelegramEnvironment(): boolean {
  return typeof window !== "undefined" && Telegram.isTMA();
}

export function initializeTelegram(): void {
  if (initialized || !isTelegramEnvironment()) {
    return;
  }

  Telegram.init();
  initialized = true;

  // Skip unsupported methods individually so older clients still get colors
  // and expansion even when fullscreen or swipe control are unavailable.
  const { tgWebAppVersion } = Telegram.retrieveLaunchParams();
  const postEvent = Telegram.createPostEvent(tgWebAppVersion, () => {});
  postEvent("web_app_set_background_color", { color: colors.background });
  postEvent("web_app_set_header_color", { color: colors.background });
  postEvent("web_app_set_bottom_bar_color", { color: colors.background });
  postEvent("web_app_setup_swipe_behavior", { allow_vertical_swipe: false });
  postEvent("web_app_expand");
  postEvent("web_app_request_fullscreen");
  postEvent("web_app_ready");
}

export function getRawInitData(): string | undefined {
  if (!isTelegramEnvironment()) {
    return process.env.NODE_ENV === "development" ? MOCK_INIT_DATA : undefined;
  }

  return Telegram.retrieveRawInitData();
}
