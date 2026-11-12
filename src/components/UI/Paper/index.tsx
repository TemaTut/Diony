import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type PaperProps = HTMLAttributes<HTMLDivElement> & {
    loading?: boolean;
};

const Paper = forwardRef<HTMLDivElement, PaperProps>(
    ({ children, className, loading = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("relative overflow-hidden rounded-card border border-line bg-surface", className)}
            {...props}
        >
            {children}

            {loading && (
                <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit] bg-surface">
                    <div className="absolute inset-0 animate-skeletonPulse bg-white/[0.03]" />

                    <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-skeletonShimmer bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                </div>
            )}
        </div>
    ),
);

Paper.displayName = "Paper";

export default Paper;
