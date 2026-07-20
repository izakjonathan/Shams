import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type NeumorphicButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
};

export function NeumorphicButton({ children, icon, className, ...props }: NeumorphicButtonProps) {
  return (
    <button className={cn("neo-button", className)} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
