'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { useTranslations } from 'next-intl';
import { AnimatedSection, SectionContainer } from '@/shared/ui';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const t = useTranslations('FAQ');

  const FAQS = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
  ];

  return (
    <SectionContainer className="max-w-4xl mx-auto">
      <AnimatedSection className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </AnimatedSection>

      <Accordion.Root type="single" collapsible className="space-y-4">
        {FAQS.map((faq, i) => (
          <AnimatedSection key={i}>
            <Accordion.Item 
              value={`item-${i}`} 
              className="border border-border rounded-2xl overflow-hidden bg-card hover:border-accent-brand/50 transition-colors"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full px-6 py-6 text-left group">
                  <span className="text-lg font-semibold">{faq.q}</span>
                  <ChevronDown 
                    className="text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-300" 
                    size={20} 
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-6 text-muted-foreground leading-relaxed data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
                {faq.a}
              </Accordion.Content>
            </Accordion.Item>
          </AnimatedSection>
        ))}
      </Accordion.Root>
    </SectionContainer>
  );
}
