"use client"

import { useState, useEffect } from 'react';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { Comment } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const t = useTranslations('Comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/comments/${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      setError(t('loadError'));
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);
  
  return (
    <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        {t('title')} ({comments.length})
      </h2>
      
      {/* Comment Form */}
      <div className="mb-8">
        <CommentForm postId={postId} onCommentSubmitted={fetchComments} />
      </div>
      
      {/* Comment List */}
      {isLoading ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          {t('loading')}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <CommentList comments={comments} />
      )}
    </div>
  );
}
