import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Eye, Code, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_MARKDOWN = `# Modern UtilityHub Documentation

Welcome to **UtilityHub**! A high-performance suite of client-side browser tools.

## Key Highlights
* **Zero Cloud Leaks**: 100% processed locally on your machine
* **No Artificial Limits**: Unlimited runs and batch operations
* **Privacy Focused**: No tracking cookies or telemetry

### Sample Code Block
\`\`\`javascript
const optimizeImage = async (canvas, quality) => {
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });
};
\`\`\`

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

Check out our tool categories:
1. PDF Power Tools
2. Image & Graphics
3. Creator & Social Media
4. Text & Productivity
`;

export const MarkdownPreviewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);

  // Client-side markdown renderer parser (safe subset without external dependency)
  const parseMarkdown = (md: string): string => {
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2 pb-1 border-b border-slate-200 dark:border-slate-700">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-slate-900 dark:text-white mt-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">$1</h1>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 my-3 italic text-slate-600 dark:text-slate-300 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-r-lg">$1</blockquote>')
      // Bold & Italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Inline Code
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">$1</code>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs my-3 overflow-x-auto"><code>$1</code></pre>')
      // Unordered lists
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-700 dark:text-slate-300">$1</li>')
      // Paragraphs
      .replace(/\n\n/gim, '</p><p class="my-2 leading-relaxed text-slate-700 dark:text-slate-300">');

    return `<p class="leading-relaxed text-slate-700 dark:text-slate-300">${html}</p>`;
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(parseMarkdown(markdown));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showCheatsheet ? 'Hide Syntax Guide' : 'Markdown Cheatsheet'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied HTML!' : 'Copy Raw HTML'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Cheatsheet Accordion */}
      {showCheatsheet && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 dark:text-slate-300 animate-in fade-in">
          <div><code className="font-mono font-bold"># Heading 1</code></div>
          <div><code className="font-mono font-bold">## Heading 2</code></div>
          <div><code className="font-mono font-bold">**Bold Text**</code></div>
          <div><code className="font-mono font-bold">*Italic Text*</code></div>
          <div><code className="font-mono font-bold">&gt; Blockquote</code></div>
          <div><code className="font-mono font-bold">\`code inline\`</code></div>
          <div><code className="font-mono font-bold">* Bullet item</code></div>
          <div><code className="font-mono font-bold">1. Numbered item</code></div>
        </div>
      )}

      {/* Editor & Preview Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Editor */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Markdown Source Editor
          </label>
          <textarea
            rows={18}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full p-4 font-mono text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-xs resize-y"
          />
        </div>

        {/* Live Render */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Live Formatted Preview
          </label>
          <div
            className="w-full p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 overflow-y-auto max-h-[460px] shadow-xs text-sm"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          />
        </div>

      </div>
    </div>
  );
};
