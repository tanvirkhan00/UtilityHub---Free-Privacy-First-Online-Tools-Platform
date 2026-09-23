import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryById, CATEGORIES } from '../data/categoriesData';
import { getToolsByCategory } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard/ToolCard';
import { ChevronRight, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { ToolCategory } from '../types';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const tools = categoryId ? getToolsByCategory(categoryId as ToolCategory) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (category) {
      document.title = `${category.name} — Modern UtilityHub`;
    }
  }, [category]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Category Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400">
          We couldn't find this tools category.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700"
        >
          Return to Tools Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {category.name}
        </span>
      </nav>

      {/* Category Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
            {tools.length}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>

        {/* Client-side guarantee badge */}
        <div className="pt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>All {tools.length} utilities in this category operate with local client-side processing.</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Available Utilities ({tools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Other Categories */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Explore Other Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter(c => c.id !== category.id).map(c => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
