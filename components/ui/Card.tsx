import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-surface-container-lowest shadow-elevation-1 border border-surface-container-high/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LeafCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("leaf-corner bg-surface-container-lowest shadow-elevation-1", className)} {...props}>
      {children}
    </div>
  );
}

type BadgeVariant = "ai" | "usk" | "eco" | "halal" | "neutral" | "success" | "warning";

const badgeStyles: Record<BadgeVariant, string> = {
  ai: "bg-secondary-fixed text-on-secondary-fixed-variant",
  usk: "bg-primary-fixed text-on-primary-fixed-variant",
  eco: "bg-[#dceee0] text-patchouli-deep",
  halal: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  neutral: "bg-surface-container-high text-on-surface-variant",
  success: "bg-[#dceee0] text-[#1a4d2e]",
  warning: "bg-error-container text-on-error-container",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-label-md uppercase tracking-[0.15em] text-clay-earth mb-3", className)}>
      {children}
    </p>
  );
}
