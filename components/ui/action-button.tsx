import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function ActionButton({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={cn("action-button", `action-button--${variant}`, `action-button--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="action-button__spinner" size={17} /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
