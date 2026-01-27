import { Link } from '@/shared/i18n/routing';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/about"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t('about')}
          </Link>
          <Link
            href="/privacy"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t('privacy')}
          </Link>
          <Link
            href="/terms"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t('terms')}
          </Link>
          <a
            href="mailto:visionexperiencedeveloper@gmail.com"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t('contact')}
          </a>
        </nav>
        <p className="text-neutral-500 text-sm">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
