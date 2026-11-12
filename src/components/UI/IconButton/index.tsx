import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export default function IconButton({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:bg-surface-raised hover:text-foreground disabled:cursor-default disabled:opacity-35", className)} {...props} />;
}
