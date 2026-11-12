import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, children, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("relative overflow-hidden rounded-card bg-white/[0.08]", className)}
            {...props}
        >
            <div className="absolute inset-0 animate-skeletonPulse bg-white/[0.03]" />

            <div className="absolute -left-[60%] top-0 h-full w-[55%] animate-skeletonShimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {children}
        </div>
    );
}
