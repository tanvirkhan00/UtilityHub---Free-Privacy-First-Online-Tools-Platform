import React, { useState } from 'react';
import { GitCompare, ArrowRightLeft, Check, Copy } from 'lucide-react';

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(items, discountRate = 0) {
  const sum = items.reduce((acc, item) => acc + item.price, 0);
  const discount = sum * discountRate;
  return sum - discount;
}`;

export const DiffChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>(SAMPLE_ORIGINAL);
  const [modifiedText, setModifiedText] = useState<string>(SAMPLE_MODIFIED);

  // Line-by-line diff algorithm
  const computeDiff = () => {
    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');
    const maxLen = Math.max(origLines.length, modLines.length);

    const diffRows: {
      lineNum: number;
      orig: string | null;
      mod: string | null;
      status: 'added' | 'removed' | 'modified' | 'same';
    }[] = [];

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i] ?? null;
      const mod = modLines[i] ?? null;

      if (orig === null) {
        diffRows.push({ lineNum: i + 1, orig: null, mod, status: 'added' });
      } else if (mod === null) {
        diffRows.push({ lineNum: i + 1, orig, mod: null, status: 'removed' });
      } else if (orig === mod) {
        diffRows.push({ lineNum: i + 1, orig, mod, status: 'same' });
      } else {
        diffRows.push({ lineNum: i + 1, orig, mod, status: 'modified' });
      }
    }

    return diffRows;
  };

  const diffRows = computeDiff();

  return (
    <div className="space-y-6">
      {/* Editor Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Original Text / Version A
          </label>
          <textarea
            rows={8}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Modified Text / Version B
          </label>
          <textarea
            rows={8}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Side-by-Side Diff Visualizer */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-500" />
            Comparison Result
          </h4>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Added
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Removed / Changed
            </span>
          </div>
        </div>

        <div className="font-mono text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {diffRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 p-2 ${
                row.status === 'added'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : row.status === 'removed'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                  : row.status === 'modified'
                  ? 'bg-amber-50/60 dark:bg-amber-950/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="col-span-1 text-slate-400 text-right pr-3 select-none">
                {row.lineNum}
              </div>

              {/* Version A */}
              <div className="col-span-5 pr-2 overflow-x-auto border-r border-slate-200 dark:border-slate-800 whitespace-pre">
                {row.orig !== null ? row.orig : <span className="text-slate-300 italic">--</span>}
              </div>

              {/* Indicator */}
              <div className="col-span-1 text-center font-bold">
                {row.status === 'added' && <span className="text-emerald-500">+</span>}
                {row.status === 'removed' && <span className="text-rose-500">-</span>}
                {row.status === 'modified' && <span className="text-amber-500">≠</span>}
              </div>

              {/* Version B */}
              <div className="col-span-5 pl-2 overflow-x-auto whitespace-pre">
                {row.mod !== null ? row.mod : <span className="text-slate-300 italic">--</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
