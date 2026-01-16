"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CommentFormProps {
  postId: string;
  onCommentSubmitted: () => void;
}

export function CommentForm({ postId, onCommentSubmitted }: CommentFormProps) {
  const t = useTranslations('Comments');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    
    try {
      console.log(postId, comment);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, comment }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: data.message || t('submitSuccess') });
        setComment('');
        onCommentSubmitted();
      } else {
        setMessage({ type: 'error', text: data.error || t('submitError') });
      }
    } catch {
      setMessage({ type: 'error', text: t('submitError') });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {t('writeComment')}
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={t('commentPlaceholder')}
          minLength={1}
          maxLength={1000}
          required
          disabled={isSubmitting}
        />
        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {comment.length}/1000 {t('characters')}
        </div>
      </div>
      
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting || comment.trim().length < 1}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
