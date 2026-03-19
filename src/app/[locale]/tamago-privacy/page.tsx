export default async function TamagoPrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        Effective Date: March 19, 2026

        1. Data Collection &quot;Tamago-bot&quot; respects your privacy. We do not collect, transmit, distribute, or sell your personal data or personally identifiable information (PII).

        2. Data Usage The extension uses the chrome.storage.local API exclusively to save the state of your virtual pixel-art pet locally on your device. This saved data includes the pet&apos;s current life stage, hunger, mood, energy, and cleanliness stats. This data is required solely to keep the virtual pet persisting across your browser sessions.

        3. Third-Party Sharing No data is ever sent to external servers, cloud services, or third parties. Your data never leaves your personal device.

        4. Data Retention and Deletion The saved data remains on your local browser. If you wish to delete your data, you can simply uninstall the Tamago-bot extension from your Chrome browser, which will permanently clear all associated local storage data.

        5. Contact If you have any questions or concerns regarding this Privacy Policy, please contact the developer at: [EMAIL_ADDRESS].
      </div>
    </main>
  );
}

