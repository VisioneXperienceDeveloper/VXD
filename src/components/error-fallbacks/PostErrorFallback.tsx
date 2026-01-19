import { Link } from "@/i18n/routing";

export function PostErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">📄</div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Failed to load post
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          We couldn&apos;t load this blog post. It might have been removed or there was a connection issue.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to homepage
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
