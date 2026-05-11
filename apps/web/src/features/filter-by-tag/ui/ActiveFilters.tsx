'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedTags: string[];
}

/**
 * ActiveFilters component displays currently selected filter tags
 * and allows users to remove individual tags or clear all filters
 */
export function ActiveFilters({ selectedTags }: ActiveFiltersProps): React.JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Filters');

  if (selectedTags.length === 0) {
    return null;
  }

  const removeTag = (tagToRemove: string): void => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.getAll('tag');
    
    // Remove all tags and re-add only the ones we want to keep
    params.delete('tag');
    currentTags
      .filter(tag => tag !== tagToRemove)
      .forEach(tag => params.append('tag', tag));
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = (): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-2 pb-6 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          {t('activeFilters')}
        </h4>
        <button
          onClick={clearAll}
          className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          {t('clearAll')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
