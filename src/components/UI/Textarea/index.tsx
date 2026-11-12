import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export default function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full resize-none rounded-card border border-line bg-surface px-3 py-2.5 text-base text-foreground outline-none placeholder:text-quiet focus:border-muted", className)} {...props} />;
}
