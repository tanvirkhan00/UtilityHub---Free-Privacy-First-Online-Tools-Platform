import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, RotateCcw, Link2, Binary } from 'lucide-react';
import confetti from 'canvas-confetti';

export const UrlEncoder: React.FC = () => {
  const [inputText, setInputText] = useState<string>('https://utilityhub.dev/search?q=modern web tools & category=pdf');
  const [outputText, setOutputText] = useState<string>('');
  const [mode, setMode] = useState<'url' | 'base64'>('url');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const processText = () => {
    if (!inputText) {
      setOutputText('');
      setError(null);
      return;
    }

    try {
      if (mode === 'url') {
        if (direction === 'encode') {
          setOutputText(encodeURIComponent(inputText));
        } else {
          setOutputText(decodeURIComponent(inputText));
        }
      } else {
        // Base64 with UTF-8 support
        if (direction === 'encode') {
          const utf8Bytes = encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          );
          setOutputText(btoa(utf8Bytes));
        } else {
          const binary = atob(inputText);
          const decoded = decodeURIComponent(
            Array.from(binary)
              .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
              .join('')
          );
          setOutputText(decoded);
        }
      }
      setError(null);
    } catch (err: any) {
      setError(`Decoding error: ${err.message}`);
    }
  };

  useEffect(() => {
    processText();
  }, [inputText, mode, direction]);

  const handleSwap = () => {
    setInputText(outputText);
    setDirection(direction === 'encode' ? 'decode' : 'encode');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Settings Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'url'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            URL Percent Encoding
          </button>
          <button
            type="button"
            onClick={() => setMode('base64')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'base64'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Base64 Encoding
          </button>
        </div>

        {/* Direction Switcher & Swap */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setDirection('encode')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                direction === 'encode' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setDirection('decode')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                direction === 'decode' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Decode
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            disabled={!outputText}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
            title="Swap input & output"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Input String ({direction === 'encode' ? 'Raw Plaintext' : 'Encoded Cipher'})
          </label>
          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-xs resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resulting {direction === 'encode' ? 'Encoded' : 'Decoded'} Output
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputText}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={12}
            value={outputText}
            className="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all shadow-xs resize-y"
          />
        </div>
      </div>
    </div>
  );
};
