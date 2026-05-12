"use client";

export default function CanvasSyncPrivacyPage() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = "wjd516";
    const domain = "gmail.com";
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-800 dark:text-neutral-200">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Privacy Policy for Canvas Sync</h1>
        <p className="text-sm text-neutral-500 mb-16">Effective Date: April 10, 2026</p>

        <section className="space-y-12">
          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
              Data Access
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              Canvas Sync (&quot;the Extension&quot;) values your privacy. The extension accesses your Canvas LMS data (courses, assignments, calendar) using your provided Access Token to provide a unified timeline and notifications.
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm">2</span>
              Storage
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              All data, including your Access Token and Canvas URL, is stored locally on your device via <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">chrome.storage</code>. This ensures that your sensitive information never leaves your local environment without your direct interaction.
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">3</span>
              Transmission
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              No data is ever sent to our servers or any third-party. All API calls are made directly from your browser to your specified Canvas instance. Your credentials and academic data remain private to your browser session.
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm">4</span>
              Tracking
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              We do not use any tracking pixels, analytics, or telemetry. We do not monitor your usage patterns or collect any diagnostic data.
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-sm">5</span>
              Visual Assets
            </h2>
            <div className="leading-relaxed opacity-90 pl-10 space-y-4">
              <p>For store listing and promotional purposes, the following assets are utilized:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Promotional Image</strong>: Utilizing <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">store_promotional_tile.png</code> for the Chrome Web Store.</li>
                <li><strong>Screenshots</strong>: Localized screenshots of the popup in English and Korean are provided to ensure the best user experience and conversion.</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none text-center">
              <h2 className="text-2xl font-bold mb-4">6. Contact</h2>
              <p className="mb-6 opacity-80">
                If you have any questions or concerns regarding this Privacy Policy, please contact the developer:
              </p>
              <button 
                onClick={handleEmailClick}
                className="inline-flex items-center px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg"
              >
                Send an Email
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

