'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/shared/i18n/routing';
import { Link } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { ModeToggle } from '@/features/theme';
import { LanguageToggle } from '@/features/language';
import { Search } from '@/features/search-posts';

export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('projects'), href: '/projects' },
    { name: t('blog'), href: '/blog' },
    { name: t('contact'), href: '/contact' },
  ];

  const isNavActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              VXD
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                  isNavActive(item.href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Search />
            <ModeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile nav placeholder - can expand later if needed */}
      <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 py-3 px-4 flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-xs font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
              isNavActive(item.href)
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-600 dark:text-neutral-400"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
