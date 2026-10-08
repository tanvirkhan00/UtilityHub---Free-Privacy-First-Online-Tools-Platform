import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Wrench, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
  Gamepad2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES } from '../../data/categoriesData';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenCommand?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenCommand }) => {
  const triggerSearch = onOpenCommand || onOpenSearch;
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  UtilityHub
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    Free
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-0.5">
                  100% Client-Side SaaS Tools
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4">
              <Link
                to="/tools"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/tools')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                All Tools
              </Link>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  onMouseEnter={() => setCategoryDropdownOpen(true)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/category')
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4 mr-1 text-slate-400" />
                  Categories
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-400 transition-transform duration-200" />
                </button>

                {categoryDropdownOpen && (
                  <div
                    onMouseLeave={() => setCategoryDropdownOpen(false)}
                    className="absolute left-0 mt-1 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors group"
                      >
                        <div className="mt-0.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${cat.badgeColor}`}>
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {cat.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Signature Fiverr Tool Link */}
              <Link
                to="/tool/fiverr-safety-checker"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/tool/fiverr-safety-checker')
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-300/60'
                    : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Fiverr Safety</span>
                <span className="text-[10px] uppercase font-bold px-1 py-0.2 bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 rounded">
                  Hot
                </span>
              </Link>

              {/* Highlighted Typing Game Link */}
              <Link
                to="/tool/typing-speed-game"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive('/tool/typing-speed-game')
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 ring-1 ring-amber-400/60'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-amber-950/40'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-amber-500" />
                <span>Typing Game</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white rounded-full animate-pulse shadow-xs">
                  Play 🎮
                </span>
              </Link>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={triggerSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer shadow-xs"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search utilities...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-500 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode (Ctrl+J)' : 'Switch to dark mode (Ctrl+J)'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Quick CTA to Signature Tool */}
            <Link
              to="/tool/fiverr-safety-checker"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all shadow-xs"
            >
              <span>Scan Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-3">
          
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            All Tools Catalog
          </Link>

          <Link
            to="/tool/fiverr-safety-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Fiverr Safety Checker
            </span>
            <span className="text-xs bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded font-semibold">
              Signature
            </span>
          </Link>

          <Link
            to="/tool/typing-speed-game"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-amber-500 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30"
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-amber-500" />
              TypeRush: Speed Game
            </span>
            <span className="text-xs bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase animate-pulse">
              Play 🎮
            </span>
          </Link>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 pb-1">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500 px-3">
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/privacy" onClick={() => setMobileMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/terms" onClick={() => setMobileMenuOpen(false)}>Terms of Use</Link>
          </div>
        </div>
      )}
    </header>
  );
};
