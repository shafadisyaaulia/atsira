import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-clay-earth text-white hover:bg-[#8f4f3b] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] focus-visible:outline-clay-earth",
  secondary:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-on-primary",
  ghost: "bg-transparent text-on-surface hover:bg-surface-container-high",
  gold: "bg-secondary-container text-on-secondary-container hover:bg-[#f0b82f] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold transition-all duration-200 whitespace-nowrap",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
