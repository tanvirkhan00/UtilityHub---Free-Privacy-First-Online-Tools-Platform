import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Lock, Cpu, Heart } from 'lucide-react';
import { CATEGORIES } from '../../data/categoriesData';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      {/* Privacy Promise Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 py-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Zero Server Uploads</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Files and messages are processed right on your device memory.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Instant Client Speed</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by WebAssembly and HTML5 Canvas with zero queue delays.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Independent Freelance Utility</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tested heuristic patterns to protect freelance communications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                UtilityHub
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Modern, privacy-first productivity utilities designed for developers, creators, freelancers, and students. No sign-up required, no paywalls, and no telemetry tracking.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                All Systems 100% Client-Side
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Featured Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/tool/fiverr-safety-checker"
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Fiverr Safety Checker
                </Link>
              </li>
              <li>
                <Link to="/tool/pdf-merger" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Merger
                </Link>
              </li>
              <li>
                <Link to="/tool/image-compressor" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link to="/tool/qr-code-generator" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link to="/tool/markdown-previewer" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Markdown Previewer
                </Link>
              </li>
              <li>
                <Link to="/tool/json-formatter" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  JSON Formatter
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About UtilityHub
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer section for Fiverr & general utilities */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            <strong>Disclaimer:</strong> UtilityHub is an independent software tool suite. The Fiverr Safety Checker is an educational and pre-flight message review utility and is not endorsed, sponsored, or certified by Fiverr International Ltd. "Fiverr" is a registered trademark of Fiverr International Ltd. Always review Fiverr's official Terms of Service and Community Standards for authoritative guidelines.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 text-xs text-slate-400 dark:text-slate-500 gap-2">
            <div>
              &copy; {new Date().getFullYear()} UtilityHub. Built with privacy and performance in mind.
            </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for the digital creator community.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
