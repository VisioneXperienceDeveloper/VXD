import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Metadata } from 'next';
import { ExternalLink, Mail } from 'lucide-react';

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
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('aboutBlogTitle')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('aboutBlogContent')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('aboutAuthorTitle')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('aboutAuthorContent')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {t('contactTitle')}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {t('contactContent')}
            </p>
            <Link 
              href="https://github.com/visionexperiencedeveloper" 
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
              target="_blank" 
              rel="noopener noreferrer"
            >
              VXD&apos;s GitHub
              <ExternalLink className="w-4 h-4" />
            </Link>
            <a 
              href="mailto:visionexperiencedeveloper@gmail.com" 
              className="inline-flex items-center gap-2 mt-4 ml-4 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
            >
              {t('emailLabel')}
              <Mail className="w-4 h-4" />
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
