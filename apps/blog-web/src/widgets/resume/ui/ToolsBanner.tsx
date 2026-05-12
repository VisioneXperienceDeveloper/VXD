'use client';

const TOOLS = [
  'TypeScript', 'JavaScript', 'Java', 'Swift',
  'Next.js', 'React', 'Node.js', 'NestJS', 'Spring',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Vercel', 'GitHub Actions',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Firebase', 'Supabase',
  'GraphQL', 'WordPress', 'Notion', 'Jira',
];

export function ToolsBanner() {
  return (
    <div className="bg-muted/30 border-y border-border py-10 overflow-hidden">
      <div className="flex gap-12 items-center whitespace-nowrap animate-scroll">
        {[...TOOLS, ...TOOLS].map((tool, i) => (
          <div 
            key={i} 
            className="text-2xl md:text-3xl font-bold text-muted-foreground/40 hover:text-accent-brand transition-colors cursor-default select-none"
          >
            {tool}
          </div>
        ))}
      </div>
    </div>
  );
}
