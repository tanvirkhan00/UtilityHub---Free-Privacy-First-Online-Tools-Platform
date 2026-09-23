import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileStack, ArrowUp, ArrowDown, Trash2, Download, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface UploadedPdf {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState<string>('merged-document.pdf');
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setError(null);
    setOutputUrl(null);

    const newItems: UploadedPdf[] = [];
    for (const f of selectedFiles) {
      if (!f.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are supported.');
        continue;
      }
      try {
        const arrayBuffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size,
          pageCount: doc.getPageCount()
        });
      } catch (err) {
        console.error('Error loading PDF preview:', err);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size
        });
      }
    }

    setFiles(prev => [...prev, ...newItems]);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFiles(updated);
  };

  const removeItem = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const bytes = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch (err: any) {
      console.error(err);
      setError('Failed to merge documents: ' + (err.message || 'Corrupted or password-protected PDF.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <FileUploader
        accept=".pdf,application/pdf"
        multiple={true}
        maxSizeMB={50}
        onFilesSelected={handleFilesSelected}
        title="Upload PDF files to merge"
        subtitle="Select multiple PDF documents to organize and combine into one"
      />

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>PDF Files to Combine ({files.length})</span>
              <span className="text-xs text-slate-400 font-normal">
                (Use arrows to arrange page sequence)
              </span>
            </h3>
            <button
              type="button"
              onClick={() => { setFiles([]); setOutputUrl(null); }}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(item.size / (1024 * 1024)).toFixed(2)} MB • {item.pageCount ? `${item.pageCount} pages` : 'PDF'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Controls */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Output filename:</label>
              <input
                type="text"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Merging Documents...</span>
                </>
              ) : (
                <>
                  <FileStack className="w-4 h-4" />
                  <span>Merge {files.length} PDFs</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Output Download Banner */}
      {outputUrl && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                PDFs Merged Successfully!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your merged document is prepared and ready for download.
              </p>
            </div>
          </div>
          <a
            href={outputUrl}
            download={outputName || 'merged.pdf'}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Merged PDF</span>
          </a>
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
