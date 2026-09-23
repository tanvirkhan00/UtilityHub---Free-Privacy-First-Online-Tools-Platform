import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { RotateCw, Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const PdfRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pageScope, setPageScope] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setError(null);
    setOutputUrl(null);
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(f);
      setTotalPages(doc.getPageCount());
      setCustomRange(`1-${Math.min(doc.getPageCount(), 3)}`);
    } catch (err: any) {
      setError('Failed to open PDF: ' + err.message);
    }
  };

  const handleRotate = async () => {
    if (!file || totalPages === 0) return;
    try {
      setIsProcessing(true);
      setError(null);
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const targetPages: number[] = [];
      if (pageScope === 'all') {
        for (let i = 0; i < totalPages; i++) targetPages.push(i);
      } else {
        const parts = customRange.split(',').map(s => s.trim()).filter(Boolean);
        for (const p of parts) {
          if (p.includes('-')) {
            const [s, e] = p.split('-').map(n => parseInt(n, 10));
            if (!isNaN(s) && !isNaN(e)) {
              for (let i = Math.max(1, s); i <= Math.min(totalPages, e); i++) {
                targetPages.push(i - 1);
              }
            }
          } else {
            const n = parseInt(p, 10);
            if (!isNaN(n) && n >= 1 && n <= totalPages) targetPages.push(n - 1);
          }
        }
      }

      for (const pageIdx of targetPages) {
        const page = doc.getPage(pageIdx);
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + rotationAngle) % 360));
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      setError('Rotation failed: ' + err.message);
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
          title="Upload a PDF to permanently rotate pages"
          subtitle="Fix sideways or inverted scans with permanent angle changes"
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
                <p className="text-xs text-slate-400">{totalPages} pages • {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setOutputUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different file
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3 uppercase tracking-wider">
                Rotation Angle:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { angle: 90, label: '90° Clockwise' },
                  { angle: 180, label: '180° Flip' },
                  { angle: 270, label: '270° (90° CCW)' },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => setRotationAngle(item.angle)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      rotationAngle === item.angle
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <RotateCw className={`w-4 h-4 ${rotationAngle === item.angle ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Target Pages:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="pageScope"
                    checked={pageScope === 'all'}
                    onChange={() => setPageScope('all')}
                  />
                  <span>Rotate all {totalPages} pages</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="pageScope"
                    checked={pageScope === 'custom'}
                    onChange={() => setPageScope('custom')}
                  />
                  <span>Specific pages only</span>
                </label>
              </div>

              {pageScope === 'custom' && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                    placeholder="e.g. 1, 3, 5-8"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRotate}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rotating PDF...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  <span>Apply Rotation & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {outputUrl && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                Rotation Applied!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your rotated PDF has been generated with permanent angle orientation.
              </p>
            </div>
          </div>
          <a
            href={outputUrl}
            download={`rotated_${file?.name || 'document.pdf'}`}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Rotated PDF</span>
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
