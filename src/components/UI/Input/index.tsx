import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "w-full rounded-card border border-line bg-surface px-3 py-2.5 text-base text-foreground outline-none placeholder:text-quiet focus:border-muted",
                className,
            )}
            {...props}
        />
    );
}
