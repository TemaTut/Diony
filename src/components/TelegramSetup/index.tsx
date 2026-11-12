"use client";

import { useEffect } from "react";

import { initializeTelegram } from "@/lib/telegram";

export default function TelegramSetup() {
  useEffect(() => {
    try {
      initializeTelegram();
    } catch (error) {
      console.warn("Не удалось применить настройки Telegram Mini App.", error);
    }
  }, []);

  return null;
}
