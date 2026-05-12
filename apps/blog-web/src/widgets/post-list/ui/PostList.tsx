import { useTranslations } from 'next-intl';

import { BlogPost } from '@/entities/lib/types';
import { PostCard } from '@/entities/post';
import { PaginationBar } from './PaginationBar';

interface PostListProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
}

export function PostList({ posts, currentPage, totalPages }: PostListProps) {
  const t = useTranslations('Common');

  if (posts.length === 0) {
    return (
      <div className="text-center py-32 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
        <p className="text-neutral-500 text-lg">{t('noPosts')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
