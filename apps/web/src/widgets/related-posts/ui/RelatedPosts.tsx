'use client';

import { useState } from 'react';
import { Link } from "@/shared/i18n/routing";
import { useTranslations } from 'next-intl';

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
}

interface RelatedPostsProps {
  relatedPosts: Post[];
  noOtherPostsText: string;
}

export function RelatedPosts({ relatedPosts, noOtherPostsText }: RelatedPostsProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const tNav = useTranslations('Navigation');

  if (relatedPosts.length === 0) {
    return <p className="text-sm text-neutral-500">{noOtherPostsText}</p>;
  }

  const visiblePosts = relatedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < relatedPosts.length;

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="space-y-6">
      {visiblePosts.map(relatedPost => (
        <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group block">
          <h4 className="text-base font-medium text-neutral-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {relatedPost.title}
          </h4>
          <time className="text-xs text-neutral-500">{relatedPost.date}</time>
        </Link>
      ))}
      
      {hasMore && (
        <button 
          onClick={handleSeeMore}
          className="w-full text-sm font-medium py-2.5 px-4 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mt-4"
        >
          {tNav('seeMore')}
        </button>
      )}
    </div>
  );
}
