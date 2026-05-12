"use client";

export default function TamagoPrivacyPage() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = "wjd516";
    const domain = "gmail.com";
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-800 dark:text-neutral-200">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mb-16">Effective Date: March 19, 2026</p>

        <section className="space-y-12">
          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
              Data Collection
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              &quot;Tamago-bot&quot; respects your privacy. We do not collect, transmit, distribute, or sell your personal data or personally identifiable information (PII).
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm">2</span>
              Data Usage
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              The extension uses the <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded">chrome.storage.local</code> API exclusively to save the state of your virtual pixel-art pet locally on your device. This saved data includes the pet&apos;s current life stage and stats. This data is required solely to keep the virtual pet persisting across sessions.
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">3</span>
              Third-Party Sharing
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              No data is ever sent to external servers, cloud services, or third parties. Your data never leaves your personal device.
            </p>
          </div>

          <div className="group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm">4</span>
              Data Retention and Deletion
            </h2>
            <p className="leading-relaxed opacity-90 pl-10">
              The saved data remains on your local browser. If you wish to delete your data, you can simply uninstall the extension, which will permanently clear all associated local storage data.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none text-center">
              <h2 className="text-2xl font-bold mb-4">5. Contact</h2>
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

