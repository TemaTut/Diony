// "use client";
//
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { Dumbbell } from "lucide-react";
//
// import { useTelegramAuth } from "@/api/auth/hooks";
// import { saveAccessToken } from "@/api/client";
// import Paper from "@/components/UI/Paper";
// import { getRawInitData } from "@/lib/telegram";
// import { useTelegramContext } from "@/lib/telegram-context";
// import Loader from "@/components/UI/Loader";
//
// type AuthState = "greeting" | "loading" | "error";
//
// export default function AuthScreen() {
//     const { ready } = useTelegramContext();
//     const router = useRouter();
//     const [state, setState] = useState<AuthState>("greeting");
//     const hasAuthStartedRef = useRef(false);
//     const authControllerRef = useRef<AbortController | null>(null);
//     const { mutateAsync: authenticateWithTelegram } = useTelegramAuth();
//
//     useEffect(() => {
//         if (!ready || hasAuthStartedRef.current) {
//             return;
//         }
//
//         hasAuthStartedRef.current = true;
//         authControllerRef.current?.abort();
//         const controller = new AbortController();
//         authControllerRef.current = controller;
//
//         const auth = async () => {
//             const rawInitData = getRawInitData();
//             console.log("INITDATA", rawInitData);
//
//             if (!rawInitData) {
//                 setState("error");
//                 hasAuthStartedRef.current = false;
//                 return;
//             }
//
//             setState("loading");
//
//             try {
//                 const response = await authenticateWithTelegram({
//                     initData: rawInitData,
//                     signal: controller.signal,
//                 });
//
//                 if (controller.signal.aborted) {
//                     return;
//                 }
//
//                 saveAccessToken(response.access_token);
//                 setTimeout(() => {
//                     router.replace("/main");
//                 }, 800);
//             } catch (error) {
//                 if (controller.signal.aborted || axios.isCancel(error)) {
//                     return;
//                 }
//
//                 setState("error");
//                 hasAuthStartedRef.current = false;
//             }
//         };
//
//         auth();
//
//         return () => {
//             controller.abort();
//             if (authControllerRef.current === controller) {
//                 authControllerRef.current = null;
//             }
//             hasAuthStartedRef.current = false;
//         };
//     }, [authenticateWithTelegram, ready, router]);
//
//     return (
//         <main className="flex min-h-dvh items-center justify-center px-4 text-foreground">
//             {(state === "greeting" || state === "loading") && (
//                 <div className="flex flex-col items-center text-center">
//                     <span className="grid size-20 place-items-center rounded-shell border border-line bg-surface text-foreground">
//                         <Dumbbell size={36} strokeWidth={1.8} />
//                     </span>
//                     <h1 className="mt-6 text-h1">Diony</h1>
//                     <p className="mt-2 text-base text-muted">Вдохновение и идеи</p>
//                     <Loader className="mt-8" size={48} />
//                 </div>
//             )}
//             {state === "error" && (
//                 <Paper className="max-w-sm p-6 text-center">
//                     <h1 className="text-h2">Не удалось войти</h1>
//                     <p className="mt-2 text-base text-muted">
//                         Перезапустите приложение в Telegram
//                     </p>
//                 </Paper>
//             )}
//         </main>
//     );
// }

// Authorization screen source is retained above as comments and is inactive.
