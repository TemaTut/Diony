"use client";

// Kept ready for integration; no current route renders this screen.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useTelegramAuth } from "@/api/auth/hooks";
import { saveAccessToken } from "@/api/client";
import Loader from "@/components/UI/Loader";
import Paper from "@/components/UI/Paper";
import SectionHeading from "@/components/UI/SectionHeading";
import { getRawInitData } from "@/lib/telegram";
import { useTelegramContext } from "@/lib/telegram-context";

type AuthState = "greeting" | "loading" | "error";

export default function AuthScreen() {
  const { ready } = useTelegramContext();
  const router = useRouter();
  const [state, setState] = useState<AuthState>("greeting");
  const { mutateAsync: authenticateWithTelegram } = useTelegramAuth();

  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();

    async function authenticate() {
      const initData = getRawInitData();
      if (!initData) { setState("error"); return; }
      setState("loading");
      try {
        const response = await authenticateWithTelegram({ initData, signal: controller.signal });
        if (controller.signal.aborted) return;
        saveAccessToken(response.access_token);
        router.replace("/");
      } catch (error) {
        if (controller.signal.aborted || axios.isCancel(error)) return;
        setState("error");
      }
    }

    void authenticate();
    return () => controller.abort();
  }, [authenticateWithTelegram, ready, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 text-foreground">
      {state === "error" ? (
        <Paper className="max-w-sm space-y-3 p-6">
          <SectionHeading as="h1" title="Не удалось войти" description="Перезапустите приложение в Telegram." />
        </Paper>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <SectionHeading as="h1" title="Diony" description="Вход через Telegram" />
          <Loader size={48} />
        </div>
      )}
    </main>
  );
}
