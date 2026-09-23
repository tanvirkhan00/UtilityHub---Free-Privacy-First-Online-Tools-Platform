import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy — Modern UtilityHub';
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Privacy by Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: September 2026
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. No File Uploads (Zero Data Retention)
          </h2>
          <p>
            When you use UtilityHub to merge PDFs, compress photos, crop graphics, or inspect document metadata, your files are processed directly on your local device using standard browser APIs (Canvas, ArrayBuffers, and Web Cryptography). We do not transmit, receive, or store your documents or images on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Fiverr Message Scanner Privacy
          </h2>
          <p>
            When you type or paste message drafts into the Fiverr Communication Safety Checker, the heuristic scanning and regex rule validation run entirely inside your browser's JavaScript execution engine. Your drafts are never sent to external AI APIs, third-party language models, or remote databases.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Cookies and Local Storage
          </h2>
          <p>
            We use minimal browser local storage strictly for functional preferences (such as remembering your Dark/Light theme mode). We do not use persistent tracking cookies or user fingerprinting technologies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Third-Party Advertising Policy
          </h2>
          <p>
            If non-intrusive sponsorships or advertising banners are displayed, they adhere strictly to standard contextual placement guidelines. We do not permit intrusive pop-ups, misleading download buttons, or malicious script redirects.
          </p>
        </section>
      </div>
    </div>
  );
};
