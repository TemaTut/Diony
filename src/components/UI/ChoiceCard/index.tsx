import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type ChoiceCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
  className?: string;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] }
);

export default function ChoiceCard({ title, description, icon, trailing, selected = false, className, href, onClick }: ChoiceCardProps) {
  const styles = cn(
    "flex items-center gap-3 rounded-card border p-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
    selected ? "border-foreground bg-accent text-background" : "border-line bg-surface text-foreground hover:bg-surface-raised",
    className,
  );
  const content = <>
    {icon && <span className="flex size-8 shrink-0 items-center justify-center">{icon}</span>}
    <span className="min-w-0 flex-1 break-words"><span className="block text-lead font-semibold">{title}</span>{description && <span className={cn("mt-1 block text-base", selected ? "text-background/70" : "text-muted")}>{description}</span>}</span>
    {trailing}
  </>;

  return href !== undefined
    ? <Link href={href as Route} className={styles}>{content}</Link>
    : <button type="button" aria-pressed={selected} onClick={onClick} className={styles}>{content}</button>;
}
