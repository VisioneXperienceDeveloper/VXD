'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Share2, Check } from 'lucide-react';

interface PostEngagementProps {
  viewCount?: number;
}

export function PostEngagement({ viewCount }: PostEngagementProps) {
  const t = useTranslations('Common');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tooltipText = copied ? t('copied') : t('copy');

  return (
    <div className="flex justify-end items-center gap-4 my-4 text-neutral-500 dark:text-neutral-400">
      {/* Share Button */}
      <button
        onClick={handleCopyLink}
        className="relative flex items-center gap-2 cursor-pointer group"
        aria-label={t('copy')}
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Share2 className="w-5 h-5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
        )}
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-neutral-800 dark:bg-neutral-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {tooltipText}
        </span>
      </button>

      {/* View Count */}
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5" />
        <span className="text-sm font-medium">
          {viewCount !== undefined ? viewCount.toLocaleString() : 0}
        </span>
      </div>
    </div>
  );
}
