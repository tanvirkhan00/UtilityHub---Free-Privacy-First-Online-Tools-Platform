import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronRight, ShieldCheck, Lock, HelpCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { ToolMeta } from '../../types';
import { CATEGORIES } from '../../data/categoriesData';
import { TOOLS } from '../../data/toolsData';
import { ToolCard } from '../ToolCard/ToolCard';

interface ToolLayoutProps {
  tool: ToolMeta;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;

  // Find related tools in same category
  const relatedTools = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb navigation */}
        <nav className="flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-x-2">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {categoryInfo && (
            <>
              <Link to={`/category/${categoryInfo.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {categoryInfo.shortName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
            {tool.name}
          </span>
        </nav>

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center shadow-xs">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {tool.name}
                  </h1>
                  {tool.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium self-start md:self-auto shadow-xs">
            <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Private • Local Browser Execution</span>
          </div>
        </div>

        {/* Main Tool Interactive Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-8">
          {children}
        </div>

        {/* Instructions / How It Works */}
        {tool.instructions && tool.instructions.length > 0 && (
          <div className="bg-slate-50/70 dark:bg-slate-900/40 rounded-3xl border border-slate-200/70 dark:border-slate-800/60 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-center font-mono">
                ?
              </span>
              How to Use {tool.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tool.instructions.map((inst) => (
                <div key={inst.step} className="space-y-2 relative">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {inst.step}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {inst.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {inst.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {tool.faqs && tool.faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {tool.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-sm font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Related {categoryInfo?.shortName}
              </h2>
              <Link
                to={`/category/${categoryInfo?.id}`}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all in {categoryInfo?.shortName} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((rt) => (
                <ToolCard key={rt.id} tool={rt} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
