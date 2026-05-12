'use client';

import { AnimatedSection, SectionContainer } from '@/shared/ui';
import { useTranslations } from 'next-intl';

export function ProjectCarousel() {
  const t = useTranslations('ProjectCarousel');

  return (
    <SectionContainer fullWidth className="bg-muted/30 py-32 overflow-hidden">
      <AnimatedSection className="container mx-auto px-4 md:px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">{t('title')}</h2>
      </AnimatedSection>

      <div className="flex gap-8 animate-carousel px-4">
        {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[300px] md:w-[600px] aspect-video rounded-3xl bg-card border border-border shadow-lg overflow-hidden group cursor-pointer"
          >
            <div className="w-full h-full bg-linear-to-br from-muted to-accent-brand/5 flex items-center justify-center p-12">
               <div className="w-full h-full rounded-xl bg-background shadow-2xl border border-border/50 group-hover:scale-[1.02] transition-transform duration-500" />
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
