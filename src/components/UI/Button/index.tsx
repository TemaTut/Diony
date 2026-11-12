import { cn } from "@/utils/cn";

import Loader from "@/components/UI/Loader";

import type { ButtonProps } from "./types";

const variantClasses = {
  primary: "bg-accent text-background hover:bg-white/80",
  secondary: "border border-line bg-white/5 text-foreground hover:bg-white/10",
  surface: "border border-line bg-surface text-foreground hover:bg-surface-raised",
  danger: "border border-red-400/25 bg-red-400/10 text-red-200",
};

export default function Button({
  children,
  className,
  iconLeft,
  iconRight,
  isLoading = false,
  rounded = false,
  type = "button",
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex min-h-8 items-center justify-center gap-2 px-4 py-2 text-center text-small transition disabled:cursor-not-allowed disabled:opacity-50",
        rounded ? "rounded-full" : "rounded-card",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader size={18} className="text-current" />
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </button>
  );
}
