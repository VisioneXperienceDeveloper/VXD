'use client';

import { AnimatedSection, SectionContainer, Badge } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Link } from '@/shared/i18n/routing';
import { motion } from 'framer-motion';

export function CollaborationPlans() {
  const t = useTranslations('Collaboration');

  const PLANS = [
    {
      name: t('plan1Name'),
      description: t('plan1Desc'),
      features: [t('plan1F1'), t('plan1F2'), t('plan1F3')],
      highlight: false
    },
    {
      name: t('plan2Name'),
      description: t('plan2Desc'),
      features: [t('plan2F1'), t('plan2F2'), t('plan2F3'), t('plan2F4')],
      highlight: true
    },
    {
      name: t('plan3Name'),
      description: t('plan3Desc'),
      features: [t('plan3F1'), t('plan3F2'), t('plan3F3')],
      highlight: false
    }
  ];

  return (
    <SectionContainer>
      <div className="space-y-16">
        <AnimatedSection className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <AnimatedSection key={i} className="flex h-full">
              <div className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] w-full ${
                plan.highlight 
                  ? 'border-accent-brand bg-accent-brand/3 shadow-xl shadow-accent-brand/10' 
                  : 'border-border bg-card'
              }`}>
                {plan.highlight && (
                  <motion.div 
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <Badge className="px-4 py-1.5 shadow-lg shadow-accent-brand/20 bg-linear-to-r from-accent-brand to-indigo-500 text-white border-0 flex items-center gap-1.5 whitespace-nowrap">
                      <Star size={12} className="fill-current" />
                      {t('mostPopular')}
                    </Badge>
                  </motion.div>
                )}
                
                <div className="space-y-4 mb-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="text-accent-brand mt-0.5" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/contact" 
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-colors ${
                    plan.highlight 
                      ? 'bg-accent-brand text-white hover:bg-accent-brand/90' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {t('contactButton')}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
