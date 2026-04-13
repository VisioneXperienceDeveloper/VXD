"use client";

import { Link } from '@/shared/i18n/routing';
import React from 'react';

export default function YouTubeSubscriptionManagerPrivacyPage() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = "wjd516";
    const domain = "gmail.com";
    window.location.href = `mailto:${user}@${domain}`;
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-neutral-800 dark:text-neutral-200">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-12 group/back"
        >
          <span className="mr-2 group-hover/back:-translate-x-1 transition-transform">←</span>
          Back to Home
        </Link>

        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-neutral-900 dark:text-white">
          Privacy Policy for YouTube Subscription Manager
        </h1>
        <p className="text-sm text-neutral-500 mb-12">Last Updated: April 12, 2026</p>

        <div className="mb-16 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
          <h2 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-300">Google API Limited Use Disclosure</h2>
          <p className="text-sm leading-relaxed text-blue-800/80 dark:text-blue-400/80">
            YouTube Subscription Manager&apos;s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 transition-colors">Google API Service User Data Policy</a>, including the Limited Use requirements.
          </p>
        </div>

        <section className="space-y-16">
          {/* Section 1 */}
          <div className="group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">1</span>
              Information We Collect
            </h2>
            <div className="pl-13 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">A. YouTube Data via Google OAuth</h3>
                <p className="leading-relaxed opacity-90">
                  To provide the core functionality of managing your subscriptions, the extension requests access via the YouTube Data API v3:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 opacity-80">
                  <li><strong>Subscriptions List</strong>: To organize and tag your subscribed channels.</li>
                  <li><strong>Channel Activity</strong>: To analyze whether a channel is active or inactive based on their latest upload date.</li>
                  <li><strong>Scope Used</strong>: <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded text-xs font-mono">youtube.readonly</code></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">B. Local Extension Data</h3>
                <ul className="list-disc pl-5 space-y-2 opacity-80">
                  <li><strong>Tags</strong>: Any custom tags you create for your channels.</li>
                  <li><strong>Settings</strong>: Your preferences for inactivity thresholds, date formats, etc.</li>
                  <li><strong>Cache</strong>: Temporary metadata about your subscriptions to speed up performance.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">2</span>
              How We Use Your Information
            </h2>
            <div className="pl-13 space-y-4 leading-relaxed opacity-90">
              <p>
                <strong>Local Organization</strong>: We use your subscription list only to allow you to categorize and manage them within the extension UI.
              </p>
              <p>
                <strong>Activity Analysis</strong>: We check the latest upload dates of your subscribed channels solely to identify inactive channels for your review.
              </p>
              <p>
                <strong>Performance</strong>: We cache data locally on your device to minimize API calls and provide a faster experience.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">3</span>
              Data Storage and Security
            </h2>
            <div className="pl-13 space-y-4 leading-relaxed opacity-90">
              <p>
                <strong>Privacy-First (No Server Storage)</strong>: We <strong>do not</strong> have a central server. All your channel lists, tag assignments, and settings are stored locally on your own computer using <code className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded text-xs font-mono">chrome.storage</code>.
              </p>
              <p>
                <strong>No Third-Party Sharing</strong>: We do not sell, trade, or otherwise transfer your personal information or YouTube data to outside parties.
              </p>
              <p>
                <strong>OAuth Security</strong>: We use Google&apos;s official OAuth 2.0 flow. We never see or store your Google password.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">4</span>
              Third-Party Services (Google/YouTube)
            </h2>
            <div className="pl-13 leading-relaxed opacity-90">
              <p>
                Our extension interacts with the <strong>YouTube Data API</strong>. By using this extension, you are also bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 transition-colors underline">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 transition-colors underline">Google Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">5</span>
              Payments (External)
            </h2>
            <div className="pl-13 leading-relaxed opacity-90">
              <p>
                If you purchase a premium license, your payment information (e.g., credit card details) is processed by our third-party payment provider (<strong>Stripe</strong>). We do not store your full payment card details on our systems.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="group">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">6</span>
              Compliance with Chrome Store Policies
            </h2>
            <div className="pl-13 leading-relaxed opacity-90 space-y-2">
              <p>
                This extension complies with the <strong>Chrome Web Store User Data Policy</strong>, including the Limited Use requirements.
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2 opacity-80 text-sm">
                <li>We only request the minimum permissions necessary for the clinical function of the app.</li>
                <li>We do not use your data for marketing, advertising, or credit-worthiness purposes.</li>
              </ul>
            </div>
          </div>

          {/* Contact Section - Section 7 */}
          <div className="mt-20 pt-16 border-t border-neutral-200 dark:border-neutral-800">
            <div className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-none text-center transform hover:-translate-y-1 transition-transform">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">7. Contact Us</h2>
              <p className="mb-8 opacity-80 max-w-md mx-auto">
                If you have any questions or concerns regarding this Privacy Policy, please contact the developer:
              </p>
              <button 
                onClick={handleEmailClick}
                className="inline-flex items-center px-10 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-neutral-400/20 dark:hover:shadow-neutral-950/20"
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
