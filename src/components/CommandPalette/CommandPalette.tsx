import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Sun, Moon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { TOOLS } from '../../data/toolsData';
import { ToolMeta } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const q = query.toLowerCase().trim();
  const showThemeAction =
    !q ||
    q.includes('theme') ||
    q.includes('dark') ||
    q.includes('light') ||
    q.includes('mode') ||
    q.includes('mood');

  const filteredTools = TOOLS.filter(t => {
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  // Total items including optional theme action
  const totalItems = (showThemeAction ? 1 : 0) + filteredTools.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
        return;
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (showThemeAction && selectedIndex === 0) {
          toggleTheme();
          onClose();
        } else {
          const toolIndex = showThemeAction ? selectedIndex - 1 : selectedIndex;
          if (filteredTools[toolIndex]) {
            navigate(`/tool/${filteredTools[toolIndex].slug}`);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems, showThemeAction, filteredTools, navigate, onClose, toggleTheme]);

  if (!isOpen) return null;

  const handleSelectTool = (tool: ToolMeta) => {
    navigate(`/tool/${tool.slug}`);
    onClose();
  };

  const handleToggleTheme = () => {
    toggleTheme();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 md:p-20 flex justify-center animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden self-start mt-8 sm:mt-16 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all utilities or type 'dark' / 'light' for theme..."
            className="w-full bg-transparent px-3 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-2 py-1 text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {/* Quick Theme Toggle Action if applicable */}
          {showThemeAction && (
            <div
              onClick={handleToggleTheme}
              onMouseEnter={() => setSelectedIndex(0)}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                selectedIndex === 0
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                  : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedIndex === 0 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                }`}>
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200">
                      Appearance
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Toggle system theme appearance (Shortcut: Ctrl+J)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Ctrl+J
                </kbd>
                {selectedIndex === 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                    <span>Toggle</span>
                    <CornerDownLeft className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tools List */}
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const itemIdx = (showThemeAction ? 1 : 0) + idx;
              const IconComp = (Icons as unknown as Record<string, React.ElementType>)[tool.iconName] || Icons.Wrench;
              const isSelected = itemIdx === selectedIndex;

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  onMouseEnter={() => setSelectedIndex(itemIdx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          ) : !showThemeAction ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <p className="text-sm">No utilities found matching "{query}"</p>
              <p className="text-xs text-slate-400">Try searching for "pdf", "image", "fiverr", "color", or "qr"</p>
            </div>
          ) : null}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="font-mono bg-white dark:bg-slate-700 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-600">↑</kbd> <kbd className="font-mono bg-white dark:bg-slate-700 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-600">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-700 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-600">↵</kbd> to open</span>
          </div>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <Sparkles className="w-3 h-3" />
            29+ Tools Ready
          </span>
        </div>
      </div>
    </div>
  );
};
