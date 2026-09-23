import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Zap, Lock, Heart, Award, ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About UtilityHub — Fast, Free Online Web Tools';
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          About UtilityHub
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          UtilityHub was created to solve a frustrating problem with everyday online tools: intrusive ads, deceptive download buttons, paywalls, and privacy risks from uploading personal files to mysterious cloud servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Client-Side Architecture
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Whenever technically viable, our tools run 100% inside your browser using HTML5 Canvas, the Web Cryptography API, and local WebAssembly. Your files never transfer across the internet to our backend.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Arbitrary Restrictions
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We don't limit you to 2 PDF merges per hour or downgrade your image resolution to force a monthly subscription. Tools are built to be genuinely useful and completely free.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Fiverr Safety Checker Disclaimer
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The Fiverr Communication Safety Checker is an independent pre-flight tool created by UtilityHub. It is neither authorized, sponsored, nor endorsed by Fiverr International Ltd. Fiverr and all related logos are trademarks of Fiverr International Ltd. We cannot guarantee account immunity; always comply directly with official Fiverr Community Standards.
        </p>
      </div>

      <div className="text-center pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-xs transition-colors"
        >
          <span>Explore All 29+ Tools</span>
        </Link>
      </div>
    </div>
  );
};
