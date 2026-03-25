import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy for Cira</h1>
        <div className="space-y-8 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">1. Introduction</h2>
            <p>Welcome to Cira. This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile application.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> When you create an account, we may collect your name, email address, password, or phone number.</li>
              <li><strong>User Content:</strong> Any photos, videos, posts (Stories), and text messages (including AI Chat interactions) you upload or share via the app.</li>
              <li><strong>Device & Usage Analytics:</strong> We may collect device identifiers and crash logs to improve app performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">3. How We Use Your Information</h2>
            <p className="mb-3">We use the collected data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the social and AI functionalities of the app.</li>
              <li>Personalize your experience.</li>
              <li>Ensure the safety and security of our users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">4. Data Sharing</h2>
            <p>We do not sell your personal data to third parties. Your data is only shared with trusted service providers (such as cloud hosting and AI APIs) strictly necessary for operating the app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">5. Your Rights</h2>
            <p>You have the right to access, edit, or delete your personal data at any time through the app settings or by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">6. Contact Us</h2>
            <p>If you have any questions or concerns about this privacy policy, please contact us at: <strong className="text-zinc-900 dark:text-zinc-100">support@cira.app</strong></p>
          </section>

          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            Last updated: March 25, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
