"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export default function Toggle({ checked, onChange, label, className, disabled, ...props }: ToggleProps) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn("inline-flex items-center gap-2 rounded-full text-small outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50", className)}
    >
      <span>{label}</span>
      <span className={cn("flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors duration-300 motion-reduce:transition-none", checked ? "bg-success" : "bg-black")}>
        <span className={cn("size-4 rounded-full transition-[transform,background-color] duration-300 ease-in-out motion-reduce:transition-none", checked ? "translate-x-5 bg-accent" : "translate-x-0 bg-muted")} />
      </span>
    </button>
  );
}
