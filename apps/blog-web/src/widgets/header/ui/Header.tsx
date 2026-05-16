'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/shared/i18n/routing';
import { Link } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { ModeToggle } from '@/features/theme';
import { LanguageToggle } from '@/features/language';
import { Search } from '@/features/search-posts';
import { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@vxd/auth';

export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('vision'), href: '/category/vision' },
    { name: t('experience'), href: '/category/experience' },
    { name: t('development'), href: '/category/development' },
  ];

  const isNavActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500",
      scrolled 
        ? "bg-background/70 backdrop-blur-xl border-b border-border/50 py-2 shadow-sm" 
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-foreground group whitespace-nowrap">
              VXD<span className="text-accent-brand group-hover:animate-pulse">.</span>Blog
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-border/50">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300",
                    isNavActive(item.href)
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
               <Search />
               <ModeToggle />
               <LanguageToggle />
            </div>

            <div className="flex items-center gap-2 border-l border-border/50 pl-2">
              <SignedIn>
                <Link 
                  href="/write"
                  className="hidden md:flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                >
                  <Edit3 size={16} />
                  {t('write')}
                </Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold hover:text-accent-brand transition-colors">
                    Log in
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile nav - bottom bar style */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <nav className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl p-2 flex justify-around shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isNavActive(item.href)
                  ? "bg-accent-brand/10 text-accent-brand"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
