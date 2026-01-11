import { Link } from "@/i18n/routing";
import Image from "next/image";
import { BlogPost } from "@/lib/services/posts.service";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/${post.id}`}
      className="group flex flex-col bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-[1.6/1] overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700">
            <span className="text-4xl">📄</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-center gap-2 text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">
          <span>{post.group ?? post.tags[0]}</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
        
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
        
        {post.description && (
          <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {post.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
          Read more <span className="ml-1">→</span>
        </div>
      </div>
    </Link>
  );
}
