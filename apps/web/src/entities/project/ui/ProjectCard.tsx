import { cn } from '@/shared/lib/utils';
import { Badge, AnimatedSection } from '@/shared/ui';
import { Github } from 'lucide-react';
import { Project } from '../model/types';

interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
}

export const ProjectCard = ({ project, isFeatured }: ProjectCardProps) => {
  return (
    <AnimatedSection className={cn("group relative", isFeatured && "lg:col-span-2")}>
      <div className={cn(
        "h-full flex flex-col p-8 rounded-3xl border border-border bg-card hover:border-accent-brand/50 transition-all duration-500 overflow-hidden",
        isFeatured && "lg:flex-row lg:items-center gap-12"
      )}>
        <div className={cn(
          "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
          project.color
        )} />

        <div className={cn(
          "relative aspect-video rounded-2xl bg-muted border border-border/50 shrink-0 flex items-center justify-center overflow-hidden",
          isFeatured ? "w-full lg:w-1/2" : "w-full mb-8"
        )}>
          <span className="text-muted-foreground/30 font-black text-4xl uppercase select-none">
            {project.title}
          </span>
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
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] uppercase font-black">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <a 
              href={project.link} 
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
  );
};
