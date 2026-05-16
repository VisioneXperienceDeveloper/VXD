import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ExternalLink, Mail } from 'lucide-react';
import { Link } from '@/shared/i18n/routing';
import { AnimatedSection, SectionContainer, Badge } from '@/shared/ui';
import { PERSON } from '@/shared/lib/constants';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });

  return {
    title: t('title'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('About');
  const tp = await getTranslations('AboutPage');
  
  // Use raw to get the array from i18n
  const timeline = tp.raw('timeline') as Array<{
    period: string;
    label: string;
    items: string[];
  }>;

  return (
    <main className="min-h-screen bg-background pt-20">
      <SectionContainer className="max-w-4xl mx-auto">
        <AnimatedSection className="space-y-8 mb-20">
          <Badge variant="accent" className="px-4 py-1">JOURNEY</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            {PERSON.name}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {t('aboutAuthorContent')}
          </p>
          
          <div className="flex gap-4 pt-4">
            <a 
              href={`mailto:${PERSON.email}`}
              className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              <Mail size={18} />
              {t('emailLabel')}
            </a>
            <Link 
              href={PERSON.github}
              className="flex items-center gap-2 border border-border px-6 py-3 rounded-full font-bold hover:bg-muted transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
              <ExternalLink size={18} />
            </Link>
          </div>
        </AnimatedSection>

        {/* Timeline Section */}
        <div className="space-y-12">
          <AnimatedSection className="border-b border-border pb-8">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground/50">Development Timeline</h2>
          </AnimatedSection>

          <div className="relative pl-8 space-y-16">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-linear-to-b from-accent-brand via-border to-transparent" />
            
            {timeline.map((item, index) => (
              <AnimatedSection key={index} className="relative">
                <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-background border-4 border-accent-brand shadow-lg" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-black text-accent-brand tracking-tighter uppercase">{item.period}</div>
                    <Badge variant="outline" className="text-[10px] uppercase">{item.label}</Badge>
                  </div>
                  <ul className="space-y-3">
                    {item.items.map((li, i) => (
                      <li key={i} className="text-lg font-medium text-foreground/80 flex items-start gap-3">
                        <span className="text-accent-brand mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-brand shrink-0" />
                        {li}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

      </SectionContainer>
    </main>
  );
}
