import React, { useState } from 'react';
import { Type, Copy, Check, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('Modern UtilityHub is an ultra-fast client-side suite of productivity utilities.');
  const [copied, setCopied] = useState<boolean>(false);

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const transform = (fn: (s: string) => string) => {
    setText(fn(text));
    confetti({ particleCount: 20, spread: 45 });
  };

  return (
    <div className="space-y-6">
      {/* Transformation Action Buttons */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Transform Text Case
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => transform(s => s.toUpperCase())}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            UPPERCASE
          </button>

          <button
            type="button"
            onClick={() => transform(s => s.toLowerCase())}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            lowercase
          </button>

          <button
            type="button"
            onClick={() => transform(toTitleCase)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Title Case
          </button>

          <button
            type="button"
            onClick={() => transform(toSentenceCase)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            Sentence case
          </button>

          <button
            type="button"
            onClick={() => transform(toCamelCase)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            camelCase
          </button>

          <button
            type="button"
            onClick={() => transform(toPascalCase)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            PascalCase
          </button>

          <button
            type="button"
            onClick={() => transform(toSnakeCase)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            snake_case
          </button>

          <button
            type="button"
            onClick={() => transform(toKebabCase)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-400 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            kebab-case
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Text Content
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
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert case..."
          className="w-full p-4 text-sm sm:text-base font-sans rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-xs resize-y"
        />
      </div>
    </div>
  );
};
