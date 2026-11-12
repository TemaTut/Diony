"use client";

import { useCallback, useState, type ReactNode } from "react";

import LoginModal from "@/components/LoginModal";
import MobileNavigation from "@/components/MobileNavigation";
import SidebarNavigation from "@/components/SidebarNavigation";
import Button from "@/components/UI/Button";
import BrandLogo from "@/components/UI/BrandLogo";

export default function AppShell({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background font-sans text-foreground md:grid-cols-[16rem_minmax(0,1fr)]">
      <SidebarNavigation />
      <div className="col-span-full flex items-center justify-between border-b border-line bg-background/90 px-4 py-3 backdrop-blur-xl md:hidden">
        <BrandLogo size="mobile" />
        <Button onClick={() => setLoginOpen(true)}>Войти</Button>
      </div>
      <div className="flex min-h-dvh min-w-0 flex-col px-10 pt-4 max-lg:px-6 max-md:min-h-[calc(100dvh-3.5rem)] max-md:px-4 max-md:pb-28 md:col-start-2 md:row-start-1">
        <main className="mx-auto w-full max-w-content flex-1 pb-12">
          <div className="mb-4 hidden h-9 justify-end md:flex">
            <Button onClick={() => setLoginOpen(true)}>Войти</Button>
          </div>
          {children}
        </main>
      </div>
      <MobileNavigation />
      {loginOpen && <LoginModal onClose={closeLogin} />}
    </div>
  );
}
