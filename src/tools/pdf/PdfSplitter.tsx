import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Scissors, Download, FileText, CheckCircle2, Loader2, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<{ name: string; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setError(null);
    setDownloadUrls([]);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = doc.getPageCount();
      setFile(f);
      setTotalPages(pages);
      setRangeInput(pages > 1 ? `1-${Math.min(pages, 2)}` : '1');
    } catch (err: any) {
      setError('Could not load PDF: ' + (err.message || 'Invalid format'));
    }
  };

  const parsePageNumbers = (str: string, max: number): number[] => {
    const indices: Set<number> = new Set();
    const parts = str.split(',').map(s => s.trim()).filter(Boolean);
    for (const p of parts) {
      if (p.includes('-')) {
        const [startStr, endStr] = p.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const minP = Math.max(1, Math.min(start, end));
          const maxP = Math.min(max, Math.max(start, end));
          for (let i = minP; i <= maxP; i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const page = parseInt(p, 10);
        if (!isNaN(page) && page >= 1 && page <= max) {
          indices.add(page - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || totalPages === 0) return;

    try {
      setIsProcessing(true);
      setError(null);
      const arrayBuffer = await file.arrayBuffer();
      const originalDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      if (splitMode === 'range') {
        const targetIndices = parsePageNumbers(rangeInput, totalPages);
        if (targetIndices.length === 0) {
          setError(`Invalid page range. Please enter numbers between 1 and ${totalPages}.`);
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(originalDoc, targetIndices);
        copiedPages.forEach(p => newDoc.addPage(p));
        const bytes = await newDoc.save();
        const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrls([{ name: `${file.name.replace('.pdf', '')}_extracted_pages.pdf`, url }]);
        confetti({ particleCount: 40, spread: 60 });
      } else {
        // Split each page into separate download
        const generated: { name: string; url: string }[] = [];
        for (let i = 0; i < totalPages; i++) {
          const singleDoc = await PDFDocument.create();
          const [copied] = await singleDoc.copyPages(originalDoc, [i]);
          singleDoc.addPage(copied);
          const bytes = await singleDoc.save();
          const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
          generated.push({
            name: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
            url: URL.createObjectURL(blob)
          });
        }
        setDownloadUrls(generated);
        confetti({ particleCount: 50, spread: 70 });
      }
    } catch (err: any) {
      console.error(err);
      setError('Splitting error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept=".pdf,application/pdf"
          maxSizeMB={50}
          onFilesSelected={handleFileSelected}
          title="Upload a PDF to split or extract pages"
          subtitle="Extract single pages, ranges, or separate all pages"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">Total {totalPages} pages • {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setTotalPages(0); setDownloadUrls([]); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different file
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === 'range'}
                  onChange={() => setSplitMode('range')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Extract specific page range</span>
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === 'all'}
                  onChange={() => setSplitMode('all')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Separate into individual pages ({totalPages} files)</span>
              </label>
            </div>

            {splitMode === 'range' && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Page numbers or ranges (e.g. "1-3, 5, 7-{totalPages}"):
                </label>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder={`1-${Math.min(totalPages, 3)}`}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400">
                  Total document has {totalPages} pages. Only selected pages will be extracted.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Extraction...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Extract PDF Pages</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Download list */}
      {downloadUrls.length > 0 && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Successfully Extracted ({downloadUrls.length} file{downloadUrls.length > 1 ? 's' : ''})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {downloadUrls.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                download={item.name}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700/60 hover:shadow-xs transition-shadow text-xs font-semibold text-slate-800 dark:text-slate-100"
              >
                <span className="truncate pr-2">{item.name}</span>
                <span className="shrink-0 text-emerald-600 flex items-center gap-1 font-bold">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};
