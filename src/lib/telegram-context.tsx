"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getRawInitData, initializeTelegram } from "@/lib/telegram";

interface TelegramContextValue {
  id: number | null;
  first_name: string | null;
  language_code: string | null;
  ready: boolean;
}

interface TelegramUserData {
  id: number;
  first_name: string;
  language_code?: string;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

function getUserFromInitData(initData: string | undefined): TelegramUserData | null {
  if (!initData) {
    return null;
  }

  try {
    const user = new URLSearchParams(initData).get("user");
    return user ? (JSON.parse(user) as TelegramUserData) : null;
  } catch {
    return null;
  }
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUserData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeTelegram();
    const timeout = window.setTimeout(() => {
      setUser(getUserFromInitData(getRawInitData()));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const value = useMemo(
    () => ({
      id: user?.id ?? null,
      first_name: user?.first_name ?? null,
      language_code: user?.language_code ?? null,
      ready,
    }),
    [user, ready],
  );

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramContext(): TelegramContextValue {
  const context = useContext(TelegramContext);

  if (!context) {
    throw new Error("useTelegramContext must be used within TelegramProvider");
  }

  return context;
}
