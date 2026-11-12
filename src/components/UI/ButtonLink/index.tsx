import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/utils/cn";

type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

export default function ButtonLink({ className, href, ...props }: ButtonLinkProps) {
  return <Link href={href as Route} className={cn("inline-flex min-h-11 items-center justify-center rounded-card border border-line bg-surface px-4 py-2 text-small text-foreground transition hover:bg-surface-raised", className)} {...props} />;
}
