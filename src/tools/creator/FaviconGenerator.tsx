import React, { useState } from 'react';
import { Globe, Download, Copy, Check, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface IconSize {
  size: number;
  label: string;
  tag: string;
}

const SIZES: IconSize[] = [
  { size: 16, label: '16×16 px', tag: 'Standard Browser Tab' },
  { size: 32, label: '32×32 px', tag: 'High-DPI Browser Tab' },
  { size: 48, label: '48×48 px', tag: 'Desktop Shortcut' },
  { size: 180, label: '180×180 px', tag: 'Apple Touch Icon (iOS)' },
  { size: 512, label: '512×512 px', tag: 'PWA Web App Icon' },
];

export const FaviconGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [generatedIcons, setGeneratedIcons] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const results: Record<number, string> = {};
      SIZES.forEach(({ size }) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, size, size);
          results[size] = canvas.toDataURL('image/png');
        }
      });
      setGeneratedIcons(results);
      confetti({ particleCount: 35, spread: 55 });
    };
  };

  const htmlHeadSnippet = `<!-- Favicons and Touch Icons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  const copySnippet = () => {
    navigator.clipboard.writeText(htmlHeadSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!imgSrc ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={15}
          onFilesSelected={handleFileSelected}
          title="Upload logo or graphic for Favicon"
          subtitle="Generates browser tab icons, Apple touch icons, and Android manifest badges"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file?.name}</h4>
            <button
              type="button"
              onClick={() => { setFile(null); setImgSrc(null); setGeneratedIcons({}); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Realistic Browser Tab Mockup */}
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Browser Tab Simulation
            </span>
            <div className="w-full max-w-sm rounded-t-xl bg-slate-200 dark:bg-slate-800 p-2 pb-0 flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-slate-800 px-3 py-2 rounded-t-lg shadow-xs flex items-center gap-2 border-t-2 border-indigo-500">
                {generatedIcons[16] ? (
                  <img src={generatedIcons[16]} alt="Tab icon" className="w-4 h-4 rounded-xs" />
                ) : (
                  <Globe className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  My Awesome Website
                </span>
              </div>
              <div className="w-5 h-5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                +
              </div>
            </div>
          </div>

          {/* Generated Sizes Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Export Ready-to-Use Icon Assets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIZES.map(({ size, label, tag }) => {
                const url = generatedIcons[size];
                return (
                  <div
                    key={size}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1">
                        {url && <img src={url} alt={label} className="max-w-full max-h-full object-contain" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{label}</div>
                        <div className="text-[11px] text-slate-400">{tag}</div>
                      </div>
                    </div>

                    {url && (
                      <a
                        href={url}
                        download={`favicon-${size}x${size}.png`}
                        className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                        title={`Download ${label}`}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HTML Meta Code */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                HTML &lt;head&gt; Implementation Tags
              </span>
              <button
                type="button"
                onClick={copySnippet}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto">
              {htmlHeadSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
