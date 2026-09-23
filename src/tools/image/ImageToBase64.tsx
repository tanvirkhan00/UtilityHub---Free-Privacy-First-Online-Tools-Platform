import React, { useState } from 'react';
import { Binary, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const ImageToBase64: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataUri, setDataUri] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) => {
      setDataUri(e.target?.result as string);
    };
    reader.readAsDataURL(f);
  };

  const copySnippet = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rawBase64 = dataUri.split(',')[1] || '';
  const htmlTag = `<img src="${dataUri}" alt="${file?.name || 'Embedded Image'}" />`;
  const cssBackground = `background-image: url("${dataUri}");`;

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={5}
          onFilesSelected={handleFileSelected}
          title="Upload image to encode into Base64"
          subtitle="Generate Data URIs, CSS background snippets, and HTML tags"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
              <p className="text-xs text-slate-400">
                Size: {(file.size / 1024).toFixed(1)} KB • Base64 Length: {rawBase64.length.toLocaleString()} characters
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setDataUri(''); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-4 flex flex-col items-center justify-center">
              <img
                src={dataUri}
                alt="Preview"
                className="max-h-56 object-contain rounded-xl shadow-xs"
              />
              <span className="text-xs text-slate-400 mt-3 font-medium">Image Preview</span>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {/* Data URI */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Data URI (Base64)
                  </span>
                  <button
                    type="button"
                    onClick={() => copySnippet(dataUri, 'dataUri')}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'dataUri' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dataUri' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={2}
                  value={dataUri}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 resize-none select-all"
                />
              </div>

              {/* HTML <img> Tag */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    HTML &lt;img&gt; Element
                  </span>
                  <button
                    type="button"
                    onClick={() => copySnippet(htmlTag, 'html')}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'html' ? 'Copied' : 'Copy HTML'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={2}
                  value={htmlTag}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 resize-none select-all"
                />
              </div>

              {/* CSS Snippet */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    CSS Background Snippet
                  </span>
                  <button
                    type="button"
                    onClick={() => copySnippet(cssBackground, 'css')}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'css' ? 'Copied' : 'Copy CSS'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={2}
                  value={cssBackground}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 resize-none select-all"
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
