import { Metadata } from 'next';
import { AnimatedSection, SectionContainer, Badge } from '@/shared/ui';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from '@/shared/i18n/routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Projects`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-background pt-20">
      <SectionContainer>
        <AnimatedSection className="mb-12">
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <AnimatedSection className="space-y-6">
              <Badge variant="accent" className="px-4 py-1 uppercase tracking-widest font-black">Featured Project</Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter capitalize">
                {slug.replace(/-/g, ' ')}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A deep dive into the architecture, challenges, and solutions of this project.
              </p>
            </AnimatedSection>

            <AnimatedSection className="aspect-video w-full rounded-3xl bg-muted border border-border overflow-hidden flex items-center justify-center">
              <span className="text-muted-foreground/20 font-black text-6xl uppercase">{slug} Demo</span>
            </AnimatedSection>

            <AnimatedSection className="prose prose-neutral dark:prose-invert max-w-none">
              <h2>Project Overview</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 not-prose my-12">
                <div className="p-8 rounded-2xl bg-card border border-border">
                   <h3 className="text-lg font-bold mb-4">Core Features</h3>
                   <ul className="space-y-3 text-muted-foreground">
                      <li>• Real-time data synchronization</li>
                      <li>• End-to-end encryption</li>
                      <li>• Responsive design system</li>
                      <li>• Automated deployment</li>
                   </ul>
                </div>
                <div className="p-8 rounded-2xl bg-card border border-border">
                   <h3 className="text-lg font-bold mb-4">Technical Challenges</h3>
                   <ul className="space-y-3 text-muted-foreground">
                      <li>• Optimizing database queries</li>
                      <li>• Handling high concurrent traffic</li>
                      <li>• Cross-browser compatibility</li>
                   </ul>
                </div>
              </div>

              <h2>Architecture & Design</h2>
              <p>
                The project follows the <strong>Feature-Sliced Design (FSD)</strong> architecture, ensuring high modularity and maintainability. By separating concerns into distinct layers, we were able to scale the application without increasing complexity.
              </p>
            </AnimatedSection>
          </div>

          <div className="space-y-12">
            <AnimatedSection className="p-8 rounded-3xl border border-border bg-muted/30 space-y-8 sticky top-24">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Links</h3>
                <div className="flex flex-col gap-4">
                  <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-accent-brand transition-colors">
                     <span className="font-bold">Live Preview</span>
                     <ExternalLink size={18} className="text-accent-brand" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-accent-brand transition-colors">
                     <span className="font-bold">GitHub Repository</span>
                     <Github size={18} className="text-accent-brand" />
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                   {['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'PostgreSQL', 'AWS'].map(tech => (
                     <Badge key={tech} variant="outline" className="text-[10px] font-bold">{tech}</Badge>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-card border border-border text-center">
                      <div className="text-2xl font-bold">120+</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Commits</div>
                   </div>
                   <div className="p-4 rounded-xl bg-card border border-border text-center">
                      <div className="text-2xl font-bold">15</div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Features</div>
                   </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}
