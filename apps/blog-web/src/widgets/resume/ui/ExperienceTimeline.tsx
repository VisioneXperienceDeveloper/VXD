'use client';

import { useTranslations } from 'next-intl';

const experiences = [
  {
    role: 'Coding Instructor',
    company: 'The Robot Coding, Sydney',
    period: 'Feb 2026 – Present',
    bullets: [
      'Enhanced team communication by translating complex technical concepts into accessible language for diverse learners.',
      'Solidified mastery of programming fundamentals and algorithmic logic through continuous code reviews and instruction.',
      'Diagnosed and resolved logic errors in varied codebases, sharpening debugging efficiency and technical adaptability.'
    ]
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Meyd.it, Sydney',
    period: 'Sep 2025 – Jan 2026',
    bullets: [
      'Collaborated with a cross-functional team to redesign the company\'s main website, ensuring SEO optimisation and responsive UI.',
      'Developed and maintained frontend components using modern frameworks, improving user engagement and site performance.',
      'Managed backend user data and integrated APIs, ensuring secure and reliable data flow for the renewal project.'
    ]
  },
  {
    role: 'Freelance Full Stack Developer',
    company: 'Freelancing, Sydney',
    period: 'May 2024 – Present',
    bullets: [
      '**Wise Express**: Designed and deployed a logistics portal using Node.js and REST APIs, reducing manual booking errors by 35% through an automated parcel request system.',
      '**The Varai**: Developed a brand-focused website for a natural skincare brand, integrating colour themes for identity.',
      '**CPR Learning System**: Co-led backend development for a custom LMS, building custom WordPress blocks with PHP and React and designing MySQL databases.'
    ]
  }
];

export function ExperienceTimeline() {
  const t = useTranslations('Resume');

  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center text-neutral-900 dark:text-white">
          {t('experienceTitle')}
        </h2>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 dark:before:via-neutral-800 before:to-transparent">
          {experiences.map((exp, i) => (
            <div key={i} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-neutral-950 bg-neutral-200 dark:bg-neutral-800 group-hover:bg-blue-500 group-hover:border-blue-100 dark:group-hover:border-blue-900 transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2 h-2 rounded-full bg-white dark:bg-neutral-950" />
              </div>
              
              {/* Content box */}
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{exp.role}</h3>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                    {exp.period.includes('Present') ? exp.period.replace('Present', t('present')) : exp.period}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-4">{exp.company}</h4>
                <ul className="space-y-2 text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm list-none pl-0">
                  {exp.bullets.map((bullet, idx) => {
                    // Simple bold parser for markdown-like syntax
                    const isBold = bullet.includes('**');
                    let formatted = <>{bullet}</>;
                    if (isBold) {
                      const parts = bullet.split('**');
                      formatted = (
                        <>
                          {parts[0]}<strong className="font-semibold text-neutral-800 dark:text-neutral-200">{parts[1]}</strong>{parts[2]}
                        </>
                      );
                    }
                    
                    return (
                      <li key={idx} className="relative pl-4">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full"></span>
                        {formatted}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
