import React, { ReactNode } from "react";
import { cn } from "../lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'outline';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    accent: "bg-accent-brand-soft text-accent-brand-text",
    outline: "border border-border text-foreground",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
