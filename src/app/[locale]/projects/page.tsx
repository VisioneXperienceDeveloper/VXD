export default function ProjectsPage() {
  const projects = [
    {
      title: "VXD Blog",
      description: "A minimalistic blog and portfolio built with Next.js, Notion API, and Tailwind CSS. Features dynamic content loading, multilingual support, and responsive design.",
      tags: ["Next.js", "React", "TypeScript", "Notion API", "Tailwind"],
      link: "https://vxd-blog.vercel.app"
    },
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory tracking, secure payments processing, and an intuitive admin dashboard.",
      tags: ["React", "Express", "PostgreSQL", "Stripe", "Docker"],
      link: "#"
    },
    {
      title: "Task Management App",
      description: "A collaborative project management tool featuring real-time updates, kanban boards, and progress tracking visualizations.",
      tags: ["Vue", "Node.js", "MongoDB", "Socket.io"],
      link: "#"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 dark:text-white mb-6">
          Projects
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400">
          A showcase of things I&apos;ve built, focusing on performance, elegant user interfaces, and robust architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <div 
            key={idx}
            className="group block p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-blue-500/30 dark:hover:border-blue-400/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 relative z-10">
              {project.title}
            </h3>
            
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed relative z-10">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8 relative z-10">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline relative z-10"
            >
              View Project <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
