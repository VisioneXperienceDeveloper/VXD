'use client';

import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge, AnimatedSection, SectionContainer } from '@/shared/ui';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeatureSectionProps {
  id?: string;
  badge: string;
  title: string;
  description: string;
  bullets?: string[];
  stats?: { value: string; label: string }[];
  visual?: ReactNode;
  reverse?: boolean;
  className?: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
}

export function FeatureSection({
  id,
  badge,
  title,
  description,
  bullets = [],
  stats = [],
  visual,
  reverse = false,
  className,
  cta,
}: FeatureSectionProps) {
  return (
    <SectionContainer id={id} className={cn("overflow-hidden", className)}>
      <div className={cn(
        "flex flex-col lg:flex-row items-center gap-12 lg:gap-20",
        reverse && "lg:flex-row-reverse"
      )}>
        {/* Content Side */}
        <AnimatedSection className="flex-1 space-y-6">
          <Badge variant="accent" className="font-semibold uppercase tracking-wider">
            {badge}
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {title}
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {description}
          </p>

          {bullets.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-accent-brand/10 flex items-center justify-center">
                    <Check className="text-accent-brand" size={14} strokeWidth={3} />
                  </div>
                  <span className="text-foreground/80 font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-border">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-bold text-accent-brand">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {cta && (
            <div className="pt-4">
              {cta.external ? (
                <a 
                  href={cta.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent-brand text-white px-8 py-3 rounded-full text-base font-bold hover:scale-105 transition-all shadow-lg shadow-accent-brand/20 group"
                >
                  {cta.label}
                  <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <Link 
                  href={cta.href}
                  className="inline-flex items-center gap-2 bg-accent-brand text-white px-8 py-3 rounded-full text-base font-bold hover:scale-105 transition-all shadow-lg shadow-accent-brand/20 group"
                >
                  {cta.label}
                  <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          )}
        </AnimatedSection>

        {/* Visual Side */}
        <AnimatedSection className="flex-1 w-full flex justify-center">
          {visual || (
            <div className="relative aspect-square w-full max-w-[500px] rounded-3xl bg-linear-to-br from-muted to-accent-brand/5 border border-border flex items-center justify-center p-8 group overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent-brand)_0%,transparent_70%)] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
               <div className="text-muted-foreground/20 font-black text-8xl select-none uppercase tracking-tighter">
                 {badge.split(' ')[0]}
               </div>
            </div>
          )}
        </AnimatedSection>
      </div>
    </SectionContainer>
  );
}
