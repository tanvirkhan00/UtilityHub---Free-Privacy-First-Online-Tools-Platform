import React, { useState } from 'react';
import { Type, Clock, Mic, RotateCcw, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = cleanText ? (cleanText.match(/[^.!?]+[.!?]+(\s|$)/g) || [cleanText]).length : 0;
  const paragraphs = cleanText ? cleanText.split(/\n+/).filter(Boolean).length : 0;

  // Average reading speed: ~225 wpm, speaking speed: ~130 wpm
  const readingTimeMin = Math.ceil(words / 225) || (words > 0 ? 1 : 0);
  const speakingTimeMin = Math.ceil(words / 130) || (words > 0 ? 1 : 0);

  // Keyword density
  const getTopKeywords = () => {
    if (!cleanText) return [];
    const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me']);
    const wordList = cleanText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
    const counts: Record<string, number> = {};
    wordList.forEach(w => counts[w] = (counts[w] || 0) + 1);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const topKeywords = getTopKeywords();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: words.toLocaleString(), highlight: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Characters', value: charsWithSpaces.toLocaleString() },
          { label: 'No Spaces', value: charsWithoutSpaces.toLocaleString() },
          { label: 'Sentences', value: sentences.toLocaleString() },
          { label: 'Paragraphs', value: paragraphs.toLocaleString() },
          { label: 'Reading Time', value: `~${readingTimeMin} min`, icon: Clock },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
            <span className={`text-xl font-bold mt-2 ${item.highlight || 'text-slate-900 dark:text-white'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Editor Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Text Input
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText('')}
              disabled={!text}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to inspect word count, reading pace, and sentence statistics in real-time..."
          className="w-full p-4 text-sm sm:text-base font-sans rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Keyword Density Breakdown */}
      {topKeywords.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Top Keyword Frequency
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {topKeywords.map(([word, count]) => {
              const density = ((count / words) * 100).toFixed(1);
              return (
                <div key={word} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{word}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    {count}× ({density}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
