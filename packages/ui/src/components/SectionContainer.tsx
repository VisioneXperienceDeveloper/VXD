import React, { ReactNode } from "react";
import { cn } from "../lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

export function SectionContainer({ children, className, id, fullWidth = false }: SectionContainerProps) {
  return (
    <section id={id} className={cn("py-12 md:py-24", className)}>
      <div className={cn(
        "mx-auto px-4 md:px-6",
        fullWidth ? "w-full" : "container"
      )}>
        {children}
      </div>
    </section>
  );
}
