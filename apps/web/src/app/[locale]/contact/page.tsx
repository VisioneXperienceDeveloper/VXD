export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 dark:text-white mb-6">
          Get in Touch
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          I&apos;m always open to discussing product design work or partnership opportunities.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100 dark:border-neutral-800">
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                Name
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-semibold text-neutral-900 dark:text-neutral-200">
              Message
            </label>
            <textarea 
              id="message" 
              name="message" 
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="How can I help you?"
            ></textarea>
          </div>

          <button 
            type="button" 
            className="w-full md:w-auto px-10 py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Send Message
          </button>
        </form>
      </div>
      
      <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 text-neutral-600 dark:text-neutral-400">
        <a href="mailto:hello@example.com" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
          <span>✉️</span> hello@vxd-blog.app
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium">
          <span>🐙</span> GitHub
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-700 dark:hover:text-blue-400 transition-colors font-medium">
          <span>💼</span> LinkedIn
        </a>
      </div>
    </div>
  );
}
