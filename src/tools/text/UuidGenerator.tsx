import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, RefreshCw, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';

export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id: string = crypto.randomUUID();
      if (!includeHyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
  }, [count, uppercase, includeHyphens]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    confetti({ particleCount: 25, spread: 45 });
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopySingle = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <label className="text-slate-400">Quantity:</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              {[1, 5, 10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n} UUIDs</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHyphens}
              onChange={(e) => setIncludeHyphens(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Hyphens</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={generateUuids}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied All!' : 'Copy All UUIDs'}</span>
          </button>
        </div>
      </div>

      {/* UUID List Display */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Generated Cryptographically Secure UUIDs (v4)
        </span>

        <div className="space-y-1.5">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 select-none w-6 text-right">
                  {index + 1}.
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 select-all">
                  {id}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopySingle(id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                title="Copy this UUID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
