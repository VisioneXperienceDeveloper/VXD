'use client';

import { useTranslations } from 'next-intl';

const skillCategories = [
  {
    name: 'Languages & Frameworks',
    skills: ['TypeScript', 'JavaScript', 'Java', 'Swift', 'Next.js', 'React', 'Node.js', 'Express.js', 'NestJS', 'SwiftUI', 'Spring']
  },
  {
    name: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'GCP', 'GitHub Actions', 'Vercel']
  },
  {
    name: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Supabase', 'Swift Data']
  },
  {
    name: 'Tools & Methodology',
    skills: ['Git', 'Agile/Scrum', 'OOP', 'TDD', 'Vitest', 'Playwright', 'Swagger', 'Postman', 'GraphQL', 'Chrome Extension API', 'Jira', 'Slack', 'Webpack']
  }
];

export function SkillShowcase() {
  const t = useTranslations('Resume');

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-100 dark:border-neutral-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center text-neutral-900 dark:text-white">
          {t('skillsTitle')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <div key={category.name} className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 border-b border-neutral-100 dark:border-neutral-800 outline-none pb-2">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map(skill => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50 dark:hover:text-blue-300 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
