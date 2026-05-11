"use client"


import { Link } from "@/shared/i18n/routing";
import { BlogPost } from "@/entities/lib/types";
import { usePrefetch } from "../hooks";

export function PostCard({ post }: { post: BlogPost }) {
  const { prefetch, cancel } = usePrefetch(`/blog/${post.slug}`);

  return (
    <Link
      href={`/blog/${post.slug}`}
      onMouseEnter={prefetch}
      onMouseLeave={cancel}
      className="group block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-6 md:p-8"
    >
      <div className="flex justify-between items-center gap-2 text-sm font-medium text-neutral-500 mb-3 uppercase tracking-wider">
        <span className="text-blue-600 dark:text-blue-400 font-semibold">{post.group ?? post.tags[0]}</span>
        <time dateTime={post.date}>{post.date}</time>
      </div>
      
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {post.title}
      </h2>
      
      {post.description && (
        <p className="text-neutral-600 dark:text-neutral-400 text-base line-clamp-2 leading-relaxed mb-6">
          {post.description}
        </p>
      )}

      <div className="flex items-center text-sm font-medium text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        Read more <span className="ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300">→</span>
      </div>
    </Link>
  );
}
