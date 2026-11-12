"use client";

import { Clock3, Compass, Handshake, House, Settings2, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";

import BrandLogo from "@/components/UI/BrandLogo";
import { cn } from "@/utils/cn";

const primaryLinks = [
  { href: "/", label: "Главная", Icon: House },
  { href: "/trends", label: "Тренды", Icon: Compass },
  { href: "/create", label: "Создать", Icon: Sparkles },
  { href: "/history", label: "История", Icon: Clock3 },
  { href: "/profile", label: "Профиль", Icon: UserRound },
] as const;

const secondaryLinks = [
  { href: "/partnership", label: "Партнёрская программа", Icon: Handshake },
  { href: "/settings", label: "Настройки", Icon: Settings2 },
] as const;

function NavLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href as Route}
      className={cn(
        "flex min-h-13 items-center gap-4 rounded-r-xl border-l-2 border-transparent px-3 text-base text-muted transition-colors hover:bg-surface hover:text-foreground",
        active && "border-l-foreground bg-surface/50 text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="col-start-1 row-span-2 row-start-1 hidden min-h-dvh w-sidebar flex-col bg-background px-3 py-6 md:flex">
      <BrandLogo />

      <nav className="mt-11 grid gap-1.5" aria-label="Главная навигация">
        {primaryLinks.map(({ href, ...link }) => (
          <NavLink
            key={href}
            href={href}
            {...link}
            active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
          />
        ))}
      </nav>

      <nav className="mt-auto grid gap-1" aria-label="Дополнительная навигация">
        {secondaryLinks.map(({ href, ...link }) => (
          <NavLink key={href} href={href} {...link} active={pathname.startsWith(href)} />
        ))}
      </nav>
    </aside>
  );
}
