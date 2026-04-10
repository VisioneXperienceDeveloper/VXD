import { getTranslations } from 'next-intl/server';
import Link from "next/link";

import { Sidebar } from "@/widgets/sidebar";
import { PostList } from "@/widgets/post-list";
import { Footer } from "@/widgets/footer";
import { SortOption } from "@/entities/lib/types";
import { 
  getPublishedPosts,
  getAllGroups,
  getTopTags
} from "@/entities/lib/services";

export const revalidate = 3600; // Revalidate every 1 hour

export default async function Home({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;
  const t = await getTranslations('Common');

  // Extract and deduplicate multiple tags from URL parameters
  const rawTags = resolvedSearchParams.tag;
  const selectedTags: string[] = Array.isArray(rawTags)
    ? [...new Set(rawTags)]  // Remove duplicates
    : rawTags ? [rawTags] : [];
  
  const selectedGroup = typeof resolvedSearchParams.group === 'string' ? resolvedSearchParams.group : undefined;
  const searchQuery = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const sortBy = (typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'published_date') as SortOption;
  
  const allPosts = await getPublishedPosts({ 
    tags: selectedTags, 
    searchQuery, 
    group: selectedGroup, 
    locale,
    sortBy
  });
  const groups = await getAllGroups();
  const topTags = await getTopTags();

  const POSTS_PER_PAGE = 6;
  const initialPosts = allPosts ? allPosts.slice(0, POSTS_PER_PAGE) : [];
  const initialHasMore = allPosts ? allPosts.length > POSTS_PER_PAGE : false;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        <header className="mb-12 text-center space-y-4 pt-8">
          <div className="inline-block p-3 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm mb-4">
            <Link href="/blog" aria-label="Blog"><span role="img" aria-label="writing" className="text-2xl">✍️</span></Link>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            {"VXD Blog"}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Sidebar 
                groups={groups} 
                topTags={topTags} 
                selectedGroup={selectedGroup} 
                selectedTags={selectedTags} 
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {allPosts === null ? (
              <div className="text-center py-32 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-red-300 dark:border-red-900/30">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 mb-6">
                   <span className="text-3xl">📡</span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  No Internet Connection
                </h3>
                <p className="text-neutral-500 text-lg max-w-md mx-auto">
                  Please check your network settings and try again.
                </p>
              </div>
            ) : (
              <PostList 
                initialPosts={initialPosts}
                initialHasMore={initialHasMore}
                tag={selectedTags[0]}
                search={searchQuery}
                group={selectedGroup}
                locale={locale}
              />
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
