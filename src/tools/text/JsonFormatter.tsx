import React, { useState, useEffect } from 'react';
import { Braces, Copy, Check, Download, AlertCircle, CheckCircle2, Minimize2, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_JSON = `{
  "platform": "UtilityHub",
  "version": "2.4.0",
  "privacy": "local_only",
  "features": [
    "pdf_suite",
    "image_compressor",
    "fiverr_checker"
  ],
  "author": {
    "organization": "UtilityHub Dev Team",
    "license": "MIT"
  }
}`;

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const processJson = (raw: string, indent: number) => {
    if (!raw.trim()) {
      setFormattedJson('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setFormattedJson(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    processJson(inputJson, indentSize);
  }, [inputJson, indentSize]);

  const handleMinify = () => {
    if (!inputJson.trim()) return;
    try {
      const parsed = JSON.parse(inputJson);
      setFormattedJson(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    if (!formattedJson) return;
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson || inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Indentation:</span>
          <button
            type="button"
            onClick={() => setIndentSize(2)}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              indentSize === 2
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            2 Spaces
          </button>
          <button
            type="button"
            onClick={() => setIndentSize(4)}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              indentSize === 4
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            4 Spaces
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3 py-1 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <Minimize2 className="w-3 h-3" />
            <span>Minify Single-Line</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!formattedJson}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON!' : 'Copy Formatted'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!formattedJson}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Error or Success indicator */}
      {error ? (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="font-mono">{error}</span>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Valid JSON Syntax</span>
        </div>
      )}

      {/* Editor & Formatted Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Raw Input JSON
          </label>
          <textarea
            rows={16}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste raw unformatted JSON here..."
            className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-xs resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Beautified / Minified Output
          </label>
          <textarea
            readOnly
            rows={16}
            value={formattedJson}
            className="w-full p-4 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all resize-y shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};
