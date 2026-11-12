"use client";

import { Clock3, Compass, House, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LiquidGlass from "@/components/UI/LiquidGlass";
import { cn } from "@/utils/cn";

const links = [
  { href: "/", label: "Главная", Icon: House },
  { href: "/trends", label: "Тренды", Icon: Compass },
  { href: "/create", label: "Создать", Icon: Sparkles },
  { href: "/history", label: "История", Icon: Clock3 },
  { href: "/profile", label: "Профиль", Icon: UserRound },
] as const;

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 isolate hidden min-h-[76px] grid-cols-5 items-center overflow-hidden rounded-full p-2 shadow-glass-nav max-md:grid"
      aria-label="Основная навигация"
    >
      <LiquidGlass />
      {links.map(({ href, label, Icon }) => {
        const active = href === "/"
          ? pathname === href
          : pathname.startsWith(href) || (href === "/profile" && (
            pathname.startsWith("/settings") || pathname.startsWith("/partnership")
          ));

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative z-10",
              "flex min-h-14 min-w-0 flex-col",
              "items-center justify-center gap-1",
              "rounded-full px-1 py-2",
              "text-caption",
              "transition-all duration-300 ease-out motion-reduce:transition-none",
              "active:scale-95",
              active
                ? cn(
                    "bg-accent/10 text-foreground",
                    "ring-1 ring-inset ring-accent/25",
                    "shadow-glass-active",
                  )
                : cn("text-foreground/80", "hover:bg-accent/5", "hover:text-foreground"),
            )}
          >
            <Icon
              size={21}
              strokeWidth={active ? 2 : 1.8}
              aria-hidden="true"
              className={cn(
                "drop-shadow-glass-label transition-transform duration-300 motion-reduce:transition-none",
                active && "scale-105",
                href === "/create" && "rounded-lg bg-accent p-0.5 text-background",
              )}
            />

            <span className="relative z-10 drop-shadow-glass-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
