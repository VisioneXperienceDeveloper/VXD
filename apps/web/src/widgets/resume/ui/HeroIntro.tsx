import { useTranslations } from 'next-intl';
import { Link } from '@/shared/i18n/routing';
import { FileDown, ExternalLink } from 'lucide-react';

export function HeroIntro() {
  const t = useTranslations('Resume');

  return (
    <section className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative min-h-[70vh]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-900/20 dark:via-neutral-950 dark:to-neutral-950"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
          {t('heroTitle')} <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight pb-2">{t('heroRole')}</span>
        </h1>
        
        <p className="text-xl md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
          {t('heroSummary')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/projects" 
            className="px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            {t('viewProjects')}
          </Link>
          <a 
            href="/resume.pdf" 
            download
            className="px-8 py-3.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex items-center gap-2"
          >
            <FileDown size={18} />
            {t('downloadResume')}
          </a>
          <a 
            href={process.env.NODE_ENV === 'production' ? 'https://vxd-blog-web.vercel.app' : 'http://localhost:5100'} 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-transparent text-neutral-700 dark:text-neutral-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            {t('readBlog')} <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
