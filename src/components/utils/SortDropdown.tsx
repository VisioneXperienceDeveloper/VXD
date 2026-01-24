'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { SortOption } from '@/lib/types';

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: 'published_date', labelKey: 'publishedDate' },
  { value: 'view_count', labelKey: 'viewCount' },
  { value: 'comment_count', labelKey: 'comments' },
];

/**
 * SortDropdown component for selecting post sorting options
 * Manages sort state via URL parameters for shareability
 */
export function SortDropdown(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Sort');

  const currentSort = (searchParams.get('sort') as SortOption) || 'published_date';

  const handleSortChange = (sortBy: SortOption): void => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortBy === 'published_date') {
      params.delete('sort'); // Default, no need to add to URL
    } else {
      params.set('sort', sortBy);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="flex flex-col space-y-2 ml-2">
      {SORT_OPTIONS.map((option) => (
        <button
          aria-label={t(option.labelKey)}
          key={option.value}
          onClick={() => handleSortChange(option.value)}
          className={`text-sm text-left transition-colors hover:text-neutral-900 dark:hover:text-neutral-100 ${
            currentSort === option.value
              ? 'font-medium text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </nav>
  );
}
