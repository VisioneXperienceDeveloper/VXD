import { getPageContent, getPostById, getPublishedPosts } from "@/lib/notion";
import { BlockRenderer } from "@/components/notion/BlockRenderer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  if (!posts) return [];
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const blocks = await getPageContent(post.id);

  // Fetch related posts (same group)
  let relatedPosts: typeof post[] = [];
  if (post.group) {
    const allGroupPosts = await getPublishedPosts(undefined, undefined, post.group);
    if (allGroupPosts) {
      relatedPosts = allGroupPosts.filter(p => p.id !== post.id);
    }
  }

  return (
    <article className="min-h-screen bg-white dark:bg-neutral-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link
            href="/"
            className="group inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Garden
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <header className="mb-12">
              <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6 uppercase tracking-wider font-medium">
                <time dateTime={post.date}>{post.date}</time>
                {post.group && (
                  <>
                    <span>•</span>
                    <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                      {post.group}
                    </span>
                  </>
                )}
                {post.tags.length > 0 && (
                    <>
                        <span>•</span>
                        <div className="flex gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-blue-600 dark:text-blue-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </>
                )}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl mb-8 leading-tight">
                {post.title}
              </h1>

              {post.cover && (
                <div className="aspect-2/1 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-sm relative">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
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
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
            
            <div className="mt-20 pt-10 border-t border-neutral-100 dark:border-neutral-800">
                <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    ← Read more posts
                </Link>
            </div>
          </div>

          {/* Sidebar: Related Posts */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 uppercase tracking-wider">
                More in {post.group || 'this blog'}
              </h3>
              {relatedPosts.length > 0 ? (
                <div className="space-y-6">
                  {relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.id} href={`/${relatedPost.id}`} className="group block">
                      <h4 className="text-base font-medium text-neutral-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {relatedPost.title}
                      </h4>
                      <time className="text-xs text-neutral-500">{relatedPost.date}</time>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No other posts in this category.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
