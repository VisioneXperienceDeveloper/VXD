import { AnimatedSection, SectionContainer, Badge } from '@/shared/ui';
import { Github, Monitor, Server, Cloud, Database } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { getTranslations } from 'next-intl/server';

const TECH_TIERS = [
  { 
    name: 'Frontend', 
    icon: <Monitor className="text-blue-500" />, 
    level: 'Expert', 
    techs: ['TypeScript', 'JavaScript', 'Next.js', 'React', 'SwiftUI', 'Tailwind'],
    color: 'bg-blue-500'
  },
  { 
    name: 'Backend', 
    icon: <Server className="text-emerald-500" />, 
    level: 'Expert', 
    techs: ['Node.js', 'Express.js', 'NestJS', 'Java', 'Spring', 'WordPress/PHP'],
    color: 'bg-emerald-500'
  },
  { 
    name: 'Cloud & DevOps', 
    icon: <Cloud className="text-orange-500" />, 
    level: 'Advanced', 
    techs: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel'],
    color: 'bg-orange-500'
  },
  { 
    name: 'Database & AI', 
    icon: <Database className="text-slate-700" />, 
    level: 'Advanced', 
    techs: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Supabase', 'Claude', 'Gemini'],
    color: 'bg-slate-700'
  },
];

export default async function ProjectsPage() {
  const t = await getTranslations('ProjectsPage');

  const projects = t.raw('list') as Array<{
    title: string;
    description: string;
  }>;

  const clientProjects = t.raw('clientProjects.list') as Array<{
    client: string;
    field: string;
    tech: string;
    role: string;
    impact: string;
  }>;

  const projectTags = [
    ["TypeScript", "Next.js", "React", "Notion API", "Tailwind v4"],
    ["Node.js", "REST APIs", "Express", "Logistics"],
    ["React", "Chrome API", "JavaScript"],
    ["VisionOS", "Python", "Firebase", "Real-time"]
  ];

  const projectLinks = [
    "https://github.com/VisioneXperienceDeveloper/VXD_Blog",
    "#",
    "https://chromewebstore.google.com/detail/tamago-bot/egjdcglbmfnpdbabandhhhfiidpdcloa",
    "#"
  ];

  const projectColors = [
    "from-blue-500/20 to-indigo-500/20",
    "from-emerald-500/20 to-teal-500/20",
    "from-red-500/20 to-orange-500/20",
    "from-purple-500/20 to-pink-500/20"
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      <SectionContainer>
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <Badge variant="accent" className="px-4 py-1">SHOWCASE</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </AnimatedSection>

        {/* Tech Tiers Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {TECH_TIERS.map((tier, i) => (
            <AnimatedSection key={i} className="p-8 rounded-3xl bg-card border border-border hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-muted">{tier.icon}</div>
                <Badge variant="accent" className="text-[10px] uppercase font-black">{tier.level}</Badge>
              </div>
              <h3 className="text-xl font-bold mb-4">{tier.name}</h3>
              <div className="flex flex-wrap gap-2">
                {tier.techs.map(tech => (
                  <span key={tech} className="text-xs font-medium text-muted-foreground">{tech}</span>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
          {projects.map((project, idx) => (
            <AnimatedSection key={idx} className="group relative">
              <div className={cn(
                "h-full flex flex-col p-8 rounded-3xl border border-border bg-card hover:border-accent-brand/50 transition-all duration-500 overflow-hidden",
                idx === 0 && "lg:col-span-2 lg:flex-row lg:items-center gap-12"
              )}>
                <div className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
                  projectColors[idx]
                )} />

                <div className={cn(
                  "relative aspect-video rounded-2xl bg-muted border border-border/50 shrink-0 flex items-center justify-center overflow-hidden",
                  idx === 0 ? "w-full lg:w-1/2" : "w-full mb-8"
                )}>
                  <span className="text-muted-foreground/30 font-black text-4xl uppercase select-none">{project.title}</span>
                </div>

                <div className="flex flex-col flex-1 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold group-hover:text-accent-brand transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {projectTags[idx]?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[10px] uppercase font-black">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <a 
                      href={projectLinks[idx]} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold hover:text-accent-brand transition-colors"
                    >
                      GitHub / Live <Github size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Comparison Table Section */}
        <AnimatedSection className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">{t('clientProjects.title')}</h2>
            <p className="text-muted-foreground">{t('clientProjects.description')}</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('clientProjects.headers.client')}</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('clientProjects.headers.field')}</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">{t('clientProjects.headers.role')}</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground text-right">{t('clientProjects.headers.impact')}</th>
                </tr>
              </thead>
              <tbody>
                {clientProjects.map((item, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors last:border-0">
                    <td className="p-6">
                      <div className="font-bold">{item.client}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.tech}</div>
                    </td>
                    <td className="p-6 text-sm font-medium">{item.field}</td>
                    <td className="p-6 text-sm font-medium">{item.role}</td>
                    <td className="p-6 text-sm font-black text-accent-brand text-right">{item.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </SectionContainer>
    </main>
  );
}
