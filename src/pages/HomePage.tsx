import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  FileText,
  Image as ImageIcon,
  Palette,
  Code
} from 'lucide-react';
import { TOOLS_CATALOG, getToolsByCategory, searchTools } from '../data/toolsData';
import { CATEGORIES } from '../data/categoriesData';
import { ToolCard } from '../components/ToolCard/ToolCard';
import { ToolCategory } from '../types';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    let list = TOOLS_CATALOG;
    if (selectedCategory !== 'all') {
      list = list.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [searchQuery, selectedCategory]);

  const fiverrTool = TOOLS_CATALOG.find(t => t.slug === 'fiverr-safety-checker');

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-4 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>100% Client-Side Processing • Your Files Never Touch a Server</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Fast, Free Online Tools <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500">
              Built for Modern Creators
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Merge PDFs, compress high-res photos, generate QR codes, and safeguard freelance communications — securely processed directly in your browser.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools... (e.g. compress image, merge pdf, fiverr check)"
                className="w-full pl-12 pr-12 py-3.5 text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Execution
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Zero Data Retention
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> No Account Required
            </span>
          </div>

        </div>
      </section>

      {/* Signature Feature Banner: Fiverr Safety Checker */}
      {fiverrTool && (
        <section className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white overflow-hidden shadow-lg border border-emerald-500/30">
            {/* Background Glow Deco */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  Featured Freelancer Utility
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Fiverr Communication Safety Checker
                </h2>

                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                  Prevent accidental Terms of Service violations before hitting send. Real-time scanning for off-platform contact sharing, payment requests, and feedback manipulation traps.
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-emerald-100">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20">✓ WhatsApp / Skype Detection</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20">✓ PayPal & Off-Site Escrow</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20">✓ Compliant Message Templates</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  to="/tool/fiverr-safety-checker"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-emerald-50 transition-all shadow-md inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Launch Scanner</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs & Tool Catalog */}
      <section className="space-y-8">
        
        {/* Category Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Tools ({TOOLS_CATALOG.length})
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredTools.length} tools
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching tools found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any tool matching "{searchQuery}". Try searching for terms like "pdf", "image", "convert", or "compress".
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* Feature Value Props / Privacy Manifesto */}
      <section className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Why Professionals Trust UtilityHub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered with modern WebAssembly and browser APIs for maximum confidentiality and zero cloud exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Local Browser Execution
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your sensitive invoices, financial statements, and client photographs never leave your browser sandbox. All conversions happen entirely on your computer's CPU and GPU.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Zero Queues & No Daily Quotas
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Traditional cloud tool sites enforce daily limits or 15-minute wait queues to force paid upgrades. UtilityHub has no artificial delays or paywalls.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Clean, Uncluttered Experience
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No deceptive "Download Now" clickbait banners, pop-unders, or forced newsletter modals. Just lightning-fast utility tools that get your job done.
            </p>
          </div>
        </div>
      </section>

      {/* Non-intrusive Sponsor Placement Placeholder */}
      <section className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Partner & Sponsorship Placement
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Interested in supporting free developer utilities? <Link to="/about" className="text-indigo-600 dark:text-indigo-400 underline font-medium">Partner with UtilityHub</Link>
        </p>
      </section>

    </div>
  );
};
