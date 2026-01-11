'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BlogPost } from '@/lib/services/posts.service';
import { PostCard } from '@/components/PostCard';
import { fetchPosts } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PostListProps {
  initialPosts: BlogPost[];
  initialHasMore: boolean;
  tag?: string;
  search?: string;
  group?: string;
  locale?: string;
}

export function PostList({
  initialPosts,
  initialHasMore,
  tag,
  search,
  group,
  locale,
}: PostListProps) {
  const t = useTranslations('Common');
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset state when filters change
  useEffect(() => {
    setPosts(initialPosts);
    setHasMore(initialHasMore);
    setPage(1);
    setLoading(false);
  }, [initialPosts, initialHasMore, tag, search, group]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchPosts({
        page: nextPage,
        tag,
        search,
        group,
        locale,
      });

      setPosts((prev) => [...prev, ...result.posts]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, tag, search, group, locale]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-32 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <p className="text-neutral-500 text-lg">{t('noPosts')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={observerTarget}
          className="flex justify-center py-8"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          ) : (
            <div className="h-8" /> // Spacer for observer
          )}
        </div>
      )}
    </div>
  );
}
