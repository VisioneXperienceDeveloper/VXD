"use client"

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/shared/i18n/routing';

export function LanguageToggle({ translationSlug }: { translationSlug?: string | null }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    if (translationSlug) {
      router.replace(`/${translationSlug}`, { locale: nextLocale });
    } else {
      router.replace(pathname, { locale: nextLocale });
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium text-xs w-9 h-9 flex items-center justify-center"
      aria-label="Toggle language"
    >
      {locale === 'ko' ? 'KR' : 'EN'}
    </button>
  )
}
