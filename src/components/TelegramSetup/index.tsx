"use client";

import { useEffect } from "react";

import { initializeTelegram, isTelegramEnvironment } from "@/lib/telegram";

const TELEGRAM_BODY_PADDING = "pt-[15dvh]";

export default function TelegramSetup() {
  useEffect(() => {
    const body = document.body;
    const hadPadding = body.classList.contains(TELEGRAM_BODY_PADDING);

    try {
      if (!isTelegramEnvironment()) return;
      body.classList.add(TELEGRAM_BODY_PADDING);
      initializeTelegram();
    } catch (error) {
      console.warn("Не удалось применить настройки Telegram Mini App.", error);
    }

    return () => {
      if (!hadPadding) body.classList.remove(TELEGRAM_BODY_PADDING);
    };
  }, []);

  return null;
}
