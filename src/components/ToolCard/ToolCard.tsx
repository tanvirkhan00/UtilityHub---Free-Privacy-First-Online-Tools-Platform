import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ToolMeta } from '../../types';
import { CATEGORIES } from '../../data/categoriesData';

interface ToolCardProps {
  tool: ToolMeta;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  // Dynamically resolve icon from lucide-react with fallback
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);

  return (
    <Link
      to={`/tool/${tool.slug}`}
      className="group relative flex flex-col justify-between p-5 sm:p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300/80 dark:hover:border-indigo-500/60 transition-all duration-200 hover:-translate-y-1"
    >
      <div>
        {/* Top bar with icon & badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-600/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 dark:group-hover:text-white group-hover:scale-105 transition-all duration-200 shadow-xs">
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.badge === 'Featured Game' && (
              <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs animate-pulse">
                Game 🎮
              </span>
            )}
            {tool.badge === 'Signature' && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Signature
              </span>
            )}
            {tool.badge === 'Popular' && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Popular
              </span>
            )}
            {tool.badge === 'New' && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                New
              </span>
            )}
            {categoryInfo && (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                {categoryInfo.shortName}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 flex items-center gap-1.5">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Bottom status & action link */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          100% Client-side
        </span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Open Tool &rarr;
        </span>
      </div>
    </Link>
  );
};
