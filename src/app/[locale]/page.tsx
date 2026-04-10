
import { Link } from '@/shared/i18n/routing';

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-900/20 dark:via-neutral-950 dark:to-neutral-950"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
            Hi, I&apos;m <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">VXD</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Software Engineer creating exceptional digital experiences. 
            Passionate about modern web technologies and building scalable applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/projects" 
              className="px-8 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              View Projects
            </Link>
            <Link 
              href="/blog" 
              className="px-8 py-3.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Experience / Resume Section Placeholder */}
      <section className="py-24 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-neutral-900 dark:text-white">Experience</h2>
          
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-8 border-l border-neutral-200 dark:border-neutral-800">
                <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[9px] top-1"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Software Engineer</h3>
                  <span className="text-sm font-medium text-neutral-500">2023 - Present</span>
                </div>
                <h4 className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">Tech Company</h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Developed scalable web applications using React, Next.js, and TypeScript. Improved performance by 40% and led a team of 3 developers in a major migration project.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
