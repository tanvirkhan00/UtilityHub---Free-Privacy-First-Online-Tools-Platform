import React, { useState } from 'react';
import { ListFilter, Copy, Check, ArrowDownAZ, ArrowUpAZ, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DuplicateRemover: React.FC = () => {
  const [inputLines, setInputLines] = useState<string>(
    'apple\nbanana\norange\napple\ngrape\nbanana\nwatermelon\npeach\napple'
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  const getDeduplicatedLines = (): { lines: string[]; removedCount: number } => {
    let raw = inputLines.split('\n');
    if (trimWhitespace) raw = raw.map(l => l.trim());
    raw = raw.filter(l => l !== '');

    const seen = new Set<string>();
    const unique: string[] = [];

    raw.forEach((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    });

    if (sortOrder === 'asc') {
      unique.sort((a, b) => a.localeCompare(b));
    } else if (sortOrder === 'desc') {
      unique.sort((a, b) => b.localeCompare(a));
    }

    return {
      lines: unique,
      removedCount: Math.max(0, raw.length - unique.length),
    };
  };

  const { lines, removedCount } = getDeduplicatedLines();
  const outputText = lines.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    confetti({ particleCount: 25, spread: 45 });
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Settings Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Trim Leading/Trailing Spaces</span>
          </label>

          <div className="flex items-center gap-1">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="none">Original Order</option>
              <option value="asc">Alphabetical (A-Z)</option>
              <option value="desc">Alphabetical (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Removed Count Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            {removedCount} Duplicates Removed
          </span>
        </div>
      </div>

      {/* Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Original List ({inputLines.split('\n').filter(Boolean).length} lines)
          </label>
          <textarea
            rows={14}
            value={inputLines}
            onChange={(e) => setInputLines(e.target.value)}
            className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-xs resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Deduplicated Unique List ({lines.length} lines)
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Unique Lines'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={14}
            value={outputText}
            className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all shadow-xs resize-y"
          />
        </div>
      </div>
    </div>
  );
};
