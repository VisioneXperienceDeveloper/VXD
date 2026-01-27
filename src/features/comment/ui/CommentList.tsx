"use client"

import { Comment } from '@/entities/lib/types';
import { useTranslations } from 'next-intl';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  const t = useTranslations('Comments');
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
        {t('noComments')}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id}
          className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {new Date(comment.createdTime).toLocaleString()}
            </span>
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
