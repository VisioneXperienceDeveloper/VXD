'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/shared/i18n/routing';
import { Link } from '@/shared/i18n/routing';
import { cn } from '@/shared/lib/utils';
import { ModeToggle } from '@/features/theme';
import { LanguageToggle } from '@/features/language';
import { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const BLOG_URL = process.env.NODE_ENV === 'production' ? 'https://vxd-blog-web.vercel.app' : 'http://localhost:5100';

  interface SubNavItem {
    name: string;
    href: string;
    external?: boolean;
    disabled?: boolean;
  }

  interface NavItemWithChildren {
    name: string;
    id: string;
    items: SubNavItem[];
  }

  interface NavItemSimple {
    name: string;
    href: string;
  }

  type NavItem = NavItemSimple | NavItemWithChildren;

  const navItems: NavItem[] = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { 
      name: t('communities'), 
      id: 'communities',
      items: [
        { name: t('vxdBlog'), href: BLOG_URL, external: true },
        { name: t('youtubeChannels'), href: 'https://youtube.com', external: true },
        { name: t('slackChat'), href: 'https://slack.com', external: true },
        { name: t('linkedin'), href: 'https://linkedin.com', external: true },
        { name: t('github'), href: 'https://github.com', external: true },
      ]
    },
    { 
      name: t('policies'), 
      id: 'policies',
      items: [
        { name: t('termsOfUse'), href: '/terms' },
        { name: t('privacyPolicy'), href: '/privacy' },
        { name: t('tamagoPolicy'), href: '/policies/tamago' },
        { name: t('canvasSyncPolicy'), href: '/policies/canvas-sync' },
        { name: t('ytSubsMgmtPolicy'), href: '/policies/yt-subs' },
      ]
    },
    { 
      name: t('services'), 
      id: 'services',
      items: [
        { name: t('slackChat'), href: 'https://slack.com', external: true },
        { name: t('vxdBlog'), href: BLOG_URL, external: true },
        { name: t('comingSoon'), href: '#', disabled: true },
      ]
    },
  ];

  const isNavActive = (href: string) => {
    if (href.startsWith('http')) return false;
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
            <Link href="/" className="text-2xl font-black tracking-tighter text-foreground group">
              VXD<span className="text-accent-brand group-hover:animate-pulse">.</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-border/50">
              {navItems.map((item) => (
                'items' in item ? (
                  <div 
                    key={item.id} 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className={cn(
                      "px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1",
                      activeDropdown === item.id 
                        ? "bg-muted text-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}>
                      {item.name}
                      <ChevronDown size={14} className={cn("transition-transform", activeDropdown === item.id && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-2xl z-50"
                        >
                          {item.items.map((subItem) => (
                            subItem.external ? (
                              <a
                                key={subItem.href}
                                href={subItem.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground group"
                              >
                                {subItem.name}
                                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ) : (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "block px-3 py-2 text-sm font-medium rounded-xl transition-colors",
                                  subItem.disabled 
                                    ? "opacity-50 cursor-not-allowed text-muted-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                                onClick={(e) => subItem.disabled && e.preventDefault()}
                              >
                                {subItem.name}
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href as string}
                    className={cn(
                      "px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300",
                      isNavActive(item.href as string)
                        ? "bg-foreground text-background shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
               <ModeToggle />
               <LanguageToggle />
            </div>
            
            <Link 
              href="/contact"
              className="hidden md:flex items-center gap-2 bg-accent-brand text-white px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-accent-brand/20"
            >
              {t('startProject')}
              <ArrowUpRight size={16} />
            </Link>

            {/* Mobile Actions Only */}
            <div className="sm:hidden flex items-center gap-1">
               <ModeToggle />
               <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile nav - bottom bar style */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <nav className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-2xl p-2 flex justify-around shadow-2xl">
          {navItems.map((item) => (
            'id' in item ? (
               <div key={item.id} className="p-2">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">{item.name}</span>
               </div>
            ) : (
              <Link
                key={item.href}
                href={item.href as string}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isNavActive(item.href as string)
                    ? "bg-accent-brand/10 text-accent-brand"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
              </Link>
            )
          ))}
        </nav>
      </div>
    </header>
  );
}
