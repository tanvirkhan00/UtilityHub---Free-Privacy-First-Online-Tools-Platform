import React, { useState } from 'react';
import { Sparkles, Copy, Check, RotateCcw, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TextCleaner: React.FC = () => {
  const [text, setText] = useState<string>('  Hello   world!  <p>Here is some messy   HTML and text with    extra spaces.</p>  \n\n\n“Smart quotes” and ’apostrophes’...  ');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanExtraSpaces = () => {
    setText(text.replace(/[ \t]+/g, ' ').trim());
  };

  const cleanEmptyLines = () => {
    setText(text.split('\n').filter(line => line.trim() !== '').join('\n'));
  };

  const stripHtmlTags = () => {
    setText(text.replace(/<[^>]*>?/gm, ''));
  };

  const normalizeQuotes = () => {
    setText(
      text
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
    );
  };

  const stripNumbers = () => {
    setText(text.replace(/[0-9]/g, ''));
  };

  const runAllCleaners = () => {
    let t = text;
    t = t.replace(/<[^>]*>?/gm, '');
    t = t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    t = t.split('\n').filter(line => line.trim() !== '').join('\n');
    t = t.replace(/[ \t]+/g, ' ').trim();
    setText(t);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Cleaning Utilities Buttons */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            One-Click Cleaning Filters
          </span>
          <button
            type="button"
            onClick={runAllCleaners}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply All Filters</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={cleanExtraSpaces}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Strip Extra Spaces
          </button>
          <button
            type="button"
            onClick={cleanEmptyLines}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Remove Blank Lines
          </button>
          <button
            type="button"
            onClick={stripHtmlTags}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Strip HTML Tags
          </button>
          <button
            type="button"
            onClick={normalizeQuotes}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Normalize Smart Quotes
          </button>
          <button
            type="button"
            onClick={stripNumbers}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Strip Digits
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Text Buffer ({text.length} characters)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Clean Text'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste messy text with extra spaces, smart quotes, HTML tags, or blank rows..."
          className="w-full p-4 font-sans text-sm sm:text-base rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-xs resize-y"
        />
      </div>
    </div>
  );
};
