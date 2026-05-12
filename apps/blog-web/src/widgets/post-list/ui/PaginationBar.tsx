'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, usePathname } from '@/shared/i18n/routing';

export function PaginationBar({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const t = useTranslations('Navigation');

  const createPageUrl = (pageOption: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageOption.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-3 mt-16 mb-8">
      {currentPage > 1 ? (
        <Link 
          href={createPageUrl(currentPage - 1)} 
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium border rounded-xl hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-all duration-200 text-neutral-600 dark:text-neutral-400"
          aria-label={t('back')}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('back')}</span>
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-4 py-2 text-sm font-medium border rounded-xl opacity-30 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('back')}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link 
            key={page}
            href={createPageUrl(page)}
            className={`w-10 h-10 flex border rounded-xl items-center justify-center text-sm font-bold transition-all duration-200 ${
              page === currentPage 
              ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-900 shadow-md transform scale-110' 
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link 
          href={createPageUrl(currentPage + 1)} 
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium border rounded-xl hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 transition-all duration-200 text-neutral-600 dark:text-neutral-400"
          aria-label={t('seeMore')}
        >
          <span className="hidden sm:inline">{t('seeMore')}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-4 py-2 text-sm font-medium border rounded-xl opacity-30 cursor-not-allowed border-neutral-200 dark:border-neutral-800 text-neutral-400">
          <span className="hidden sm:inline">{t('seeMore')}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
