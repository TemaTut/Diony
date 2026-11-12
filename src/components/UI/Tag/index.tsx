import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export type TagVariant = "solid" | "glass" | "outline" | "muted";

const variants: Record<TagVariant, string> = {
  solid: "border-transparent bg-accent text-background",
  glass: "border-white/10 bg-black/50 text-foreground backdrop-blur-md",
  outline: "border-line bg-transparent text-foreground",
  muted: "border-transparent bg-white/10 text-muted",
};

export default function Tag({
  variant = "glass",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: TagVariant }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2 py-1 text-caption", variants[variant], className)}
      {...props}
    />
  );
}
