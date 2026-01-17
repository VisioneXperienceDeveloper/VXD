import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getTranslations } from 'next-intl/server';

interface SidebarProps {
  groups: string[];
  topTags: string[];
  selectedGroup?: string;
  selectedTag?: string;
  className?: string;
}

export async function Sidebar({ groups, topTags, selectedGroup, selectedTag, className }: SidebarProps) {
  const t = await getTranslations('Common');

  return (
    <aside className={cn("space-y-8", className)}>
      {/* Categories (Groups) */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wider">
          {t('categories')}
        </h3>
        <nav className="flex flex-col space-y-2 ml-2">
          <Link
            href="/"
            className={cn(
              "text-sm transition-colors hover:text-neutral-900 dark:hover:text-neutral-100",
              !selectedGroup && !selectedTag
                ? "font-medium text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            {t('allPosts')}
          </Link>
          {groups.map((group) => (
            <Link
              key={group}
              href={`/?group=${group}`}
              className={cn(
                "text-sm transition-colors hover:text-neutral-900 dark:hover:text-neutral-100",
                selectedGroup === group
                  ? "font-medium text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              {group}
            </Link>
          ))}
        </nav>
      </div>

      {/* Top Tags */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wider">
          {t('topTags')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {topTags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${tag}`}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                selectedTag === tag
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-600 border-neutral-200 hover:border-neutral-300 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700"
              )}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
