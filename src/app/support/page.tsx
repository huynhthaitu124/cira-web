import React from 'react';

export default function Support() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-6 py-20 flex flex-col justify-center items-center text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">Cira Support</h1>
      <p className="text-xl mb-12 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Need help with the Cira app? We're here for you. Whether you have questions, feedback, or need technical assistance, feel free to reach out.
      </p>
      
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800/80 max-w-md w-full text-left">
        <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">Contact Us</h2>
        <div className="space-y-6">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wider font-semibold mb-1">Email</p>
            <a href="mailto:cira.app.sp@gmail.com" className="text-blue-600 dark:text-blue-400 font-medium text-lg hover:underline transition-colors">
              cira.app.sp@gmail.com
            </a>
          </div>
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wider font-semibold mb-1">Response Time</p>
            <p className="text-zinc-900 dark:text-zinc-300 font-medium">Usually within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
