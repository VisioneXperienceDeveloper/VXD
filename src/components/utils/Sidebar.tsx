'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { SortDropdown } from "./SortDropdown";
import { ActiveFilters } from "./ActiveFilters";

interface SidebarProps {
  groups: string[];
  topTags: string[];
  selectedGroup?: string;
  selectedTags: string[];
  className?: string;
}

export function Sidebar({ groups, topTags, selectedGroup, selectedTags, className }: SidebarProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Common');

  const toggleTag = (tag: string): void => {
    const params = new URLSearchParams(searchParams.toString());
    const existingTags = params.getAll('tag');
    
    if (existingTags.includes(tag)) {
      // Remove tag
      params.delete('tag');
      existingTags
        .filter(t => t !== tag)
        .forEach(t => params.append('tag', t));
    } else {
      // Add tag
      params.append('tag', tag);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const navigateToGroup = (group?: string): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (group) {
      params.set('group', group);
    } else {
      params.delete('group');
      params.delete('tag');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className={cn("space-y-8", className)}>
      {/* Active Filters */}
      <ActiveFilters selectedTags={selectedTags} />

      {/* Sort Dropdown */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wider">
          {t('sort')}
        </h3>
        <SortDropdown />
      </div>

      {/* Categories (Groups) */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wider">
          {t('categories')}
        </h3>
        <nav className="flex flex-col space-y-2 ml-2">
          <button
            data-testid="all-posts-button"
            onClick={() => navigateToGroup()}
            className={cn(
              "text-sm text-left transition-colors hover:text-neutral-900 dark:hover:text-neutral-100",
              !selectedGroup && selectedTags.length === 0
                ? "font-medium text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            {t('allPosts')}
          </button>
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => navigateToGroup(group)}
              className={cn(
                "text-sm text-left transition-colors hover:text-neutral-900 dark:hover:text-neutral-100",
                selectedGroup === group
                  ? "font-medium text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 dark:text-neutral-400"
              )}
            >
              {group}
            </button>
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
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                selectedTags.includes(tag)
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-600 border-neutral-200 hover:border-neutral-300 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
