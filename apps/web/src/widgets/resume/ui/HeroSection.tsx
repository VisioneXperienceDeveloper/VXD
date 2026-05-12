'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/shared/i18n/routing';
import { Badge, AnimatedSection, SectionContainer } from '@/shared/ui';
import { ChevronRight } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('Home');

  return (
    <SectionContainer className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-brand/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-accent-brand/5 blur-[100px] rounded-full" />
      </div>

      <AnimatedSection className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        <Badge variant="accent" className="px-4 py-1.5 text-sm uppercase tracking-wider font-semibold">
          {t('heroBadge')}
        </Badge>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] md:leading-[1.05]">
          {t('heroTitle1')}
          <br />
          <span className="text-accent-brand">{t('heroTitle2')}</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
          {t('heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
          <Link 
            href="/projects" 
            className="group relative px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">{t('viewProjects')}</span>
            <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
            <div className="absolute inset-0 bg-accent-brand opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          <Link 
            href="/contact" 
            className="px-8 py-4 bg-background text-foreground font-bold rounded-full border border-border hover:bg-muted transition-colors flex items-center gap-2"
          >
            {t('contactMe')}
          </Link>
        </div>
      </AnimatedSection>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-px h-12 bg-linear-to-b from-accent-brand to-transparent" />
      </div>
    </SectionContainer>
  );
}
