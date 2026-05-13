import { Link } from '@/shared/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { PERSON } from '@/shared/lib/constants';

export async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  const FOOTER_COLS = [
    { 
      title: t('dev'), 
      links: [
        { label: 'GitHub (VXD)', href: PERSON.github }, 
        { label: 'GitHub (cjungwo)', href: PERSON.github2 },
        { label: 'Chrome Extensions', href: '/projects' }
      ] 
    },
    { 
      title: t('explore'), 
      links: [
        { label: t('about'), href: '/about' }, 
        { label: 'Projects', href: '/projects' },
        { label: 'Contact', href: '/contact' }
      ] 
    },
    { 
      title: t('content'), 
      links: [
        { label: 'Blog', href: process.env.NODE_ENV === 'production' ? 'https://vxd-blog-web.vercel.app' : 'http://localhost:5100' },
        { label: 'LinkedIn', href: PERSON.linkedin }
      ] 
    },
    { 
      title: t('connect'), 
      links: [
        { label: 'Email', href: `mailto:${PERSON.email}` }, 
        { label: 'LinkedIn', href: PERSON.linkedin }
      ] 
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-32 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter">
              VXD<span className="text-accent-brand">.</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-[200px] leading-relaxed">
              Different Thinking, Different Making.
            </p>
          </div>
          
          {FOOTER_COLS.map((col, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    {link.href.startsWith('http') ? (
                      <a 
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground hover:text-accent-brand transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.href as string}
                        className="text-sm font-medium text-muted-foreground hover:text-accent-brand transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-medium">
              {t('copyright', { year })}
            </p>
            <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-tighter">
              {PERSON.name} · {PERSON.location} · {PERSON.email}
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
