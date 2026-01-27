import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

import { Link } from '@/shared/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Privacy' });

  return {
    title: t('title'),
    description: t('metaDescription'),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-8"
        >
          <span className="mr-2">←</span>
          {t('back')}
        </Link>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
          {t('title')}
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {t('lastUpdated')}: 2026-01-10
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('section1Title')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('section1Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('section2Title')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('section2Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('section3Title')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('section3Content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('section4Title')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('section4Content')}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
