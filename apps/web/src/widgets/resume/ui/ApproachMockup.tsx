'use client';

import { AnimatedSection, SectionContainer, Badge } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { Layers, Zap, ShieldCheck } from 'lucide-react';

export function ApproachMockup() {
  const t = useTranslations('Approach');

  const PILLARS = [
    { 
      icon: <Layers className="text-accent-brand" />, 
      title: t('pillar1Title'), 
      desc: t('pillar1Desc') 
    },
    { 
      icon: <Zap className="text-accent-brand" />, 
      title: t('pillar2Title'), 
      desc: t('pillar2Desc') 
    },
    { 
      icon: <ShieldCheck className="text-accent-brand" />, 
      title: t('pillar3Title'), 
      desc: t('pillar3Desc') 
    },
  ];

  return (
    <SectionContainer className="bg-foreground text-background dark:bg-muted/10 dark:text-foreground">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <AnimatedSection className="space-y-8">
          <Badge variant="outline" className="border-background/20 text-background dark:border-border dark:text-foreground">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            {t('title')}
          </h2>
          <div className="space-y-8">
            {PILLARS.map((pillar, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-background/10 dark:bg-accent-brand/10 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{pillar.title}</h3>
                  <p className="text-background/60 dark:text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="relative">
          <div className="aspect-4/3 w-full rounded-3xl bg-background/5 dark:bg-foreground/5 border border-background/10 dark:border-border overflow-hidden p-4">
             <div className="w-full h-full rounded-2xl bg-background dark:bg-card shadow-2xl p-6 space-y-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-4 pt-4">
                   <div className="h-8 w-[60%] bg-muted rounded-lg animate-pulse" />
                   <div className="h-32 w-full bg-muted rounded-xl animate-pulse" />
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-20 bg-muted rounded-lg animate-pulse" />
                      <div className="h-20 bg-muted rounded-lg animate-pulse" />
                      <div className="h-20 bg-muted rounded-lg animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-brand rounded-full blur-3xl opacity-20" />
        </AnimatedSection>
      </div>
    </SectionContainer>
  );
}
