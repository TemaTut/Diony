import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type ButtonVariant = "primary" | "secondary" | "surface" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  isLoading?: boolean;
  variant?: ButtonVariant;
  rounded?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export type { ButtonProps, ButtonVariant };
