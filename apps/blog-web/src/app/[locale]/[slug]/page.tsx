import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';

import { CommentSection } from "@/widgets/comment-section";
import { ViewTracker } from "@/features/track-views";
import { 
  getPageContent, 
  getPostBySlug,
  getPublishedPosts
} from "@/entities/lib/services";
import { PostEngagement } from "@/entities/post";
import { BlockRenderer } from "@/entities/content";
import { Link } from "@/shared/i18n/routing";
import { ErrorBoundary, CommentErrorFallback } from "@/shared/ui";
import { Block } from "@/entities/lib/types";
import { RelatedPosts } from "@/widgets/related-posts";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  if (!posts) return [];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description || `Read ${post.title} on VXD Blog`,
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.title,
      description: post.description || `Read ${post.title} on VXD Blog`,
      type: 'article',
      publishedTime: post.date,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `Read ${post.title} on VXD Blog`,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const tNav = await getTranslations('Navigation');
  const tCommon = await getTranslations('Common');
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = await getPageContent(post.id);

  // Fetch related posts (same part)
  let relatedPosts: typeof post[] = [];
  if (post.part) {
    const allPosts = await getPublishedPosts({ locale });
    if (allPosts) {
      relatedPosts = allPosts.filter(p => p.part === post.part && p.id !== post.id);
    }
  }

  return (
    <article className="selection:bg-blue-100 dark:selection:bg-blue-900">
      <ViewTracker postId={post.id} />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            {tNav('back')}
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <header className="mb-12">
              <div className="flex items-center text-sm text-neutral-500 mb-6 uppercase tracking-wider font-medium">
                {post.group && (
                  <>
                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                      {post.group}
                    </span>
                  </>
                )}
                {post.part && (
                  <>
                    <span className="text-neutral-900 dark:text-neutral-100 ml-1 mr-3 font-semibold">|</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                      {post.part}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl leading-tight">
                {post.title}
              </h1>

              <PostEngagement viewCount={post.viewCount} />

              {post.cover && (
                <div className="aspect-2/1 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-sm relative">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-cover"
                    priority
                    unoptimized={true}
                  />
                </div>
              )}
              
              {post.description && (
                  <p className="mt-8 text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl font-serif italic">
                      {post.description}
                  </p>
              )}
            </header>

            <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight 
                prose-p:leading-relaxed prose-p:text-neutral-700 dark:prose-p:text-neutral-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md">
              {blocks.map((block: Block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
            
            <div className="mt-20 pt-10 border-t border-neutral-100 dark:border-neutral-800">
                <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    ← {tNav('readMore')}
                </Link>
            </div>

            {/* Comments Section */}
            <ErrorBoundary fallback={<CommentErrorFallback />}>
              <CommentSection postId={post.id} />
            </ErrorBoundary>
          </div>

          {/* Sidebar: Related Posts */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 uppercase tracking-wider">
                {tNav('moreIn', { part: post.part || tCommon('thisBlog') })}
              </h3>
              <RelatedPosts 
                relatedPosts={relatedPosts} 
                noOtherPostsText={tCommon('noOtherPosts')} 
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
