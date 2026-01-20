import { getPublishedPosts, getAllGroups, getTopTags } from "@/lib/services/posts.service";
import { getTranslations } from 'next-intl/server';
import { SortOption } from "@/lib/types";

export const revalidate = 3600; // Revalidate every 1 hour

import { ModeToggle } from "@/components/utils/ModeToggle";
import { LanguageToggle } from "@/components/utils/LanguageToggle";
import { Search } from "@/components/utils/Search";
import { SortDropdown } from "@/components/utils/SortDropdown";
import { Sidebar } from "@/components/utils/Sidebar";
import { PostList } from "@/components/posts/PostList";
import { Footer } from "@/components/utils/Footer";

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

  const selectedTag = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag : undefined;
  const selectedGroup = typeof resolvedSearchParams.group === 'string' ? resolvedSearchParams.group : undefined;
  const searchQuery = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const sortBy = (typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'published_date') as SortOption;
  
  const allPosts = await getPublishedPosts({ 
    tag: selectedTag, 
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
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex items-center gap-2 z-50">
          <Search />
          <SortDropdown />
          <ModeToggle />
          <LanguageToggle />
        </div>
        
        <header className="mb-12 text-center space-y-4 pt-8">
          <div className="inline-block p-3 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm mb-4">
            <span role="img" aria-label="writing" className="text-2xl">✍️</span>
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
                selectedTag={selectedTag} 
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
                tag={selectedTag}
                search={searchQuery}
                group={selectedGroup}
                locale={locale}
              />
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
