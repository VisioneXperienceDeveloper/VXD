'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const currentSort = (searchParams.get('sort') as SortOption) || 'published_date';

  const handleSortChange = (sortBy: SortOption): void => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortBy === 'published_date') {
      params.delete('sort'); // Default, no need to add to URL
    } else {
      params.set('sort', sortBy);
    }
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        aria-label={t('sortBy')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">
          {t(SORT_OPTIONS.find(opt => opt.value === currentSort)?.labelKey || 'publishedDate')}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg z-20">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentSort === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
