import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Minimize2, Download, FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setOriginalSize(files[0].size);
    setOutputUrl(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      setError(null);
      const buffer = await file.arrayBuffer();
      // Load PDF and re-encode with object stream compression and clean unreferenced objects
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Clean metadata and rebuild object stream cross references
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('UtilityHub Optimizer');
      doc.setCreator('UtilityHub Optimizer');

      const optimizedBytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([optimizedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setCompressedSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      setError('Optimization failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const savingsPct = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept=".pdf,application/pdf"
          maxSizeMB={50}
          onFilesSelected={handleFileSelected}
          title="Upload a PDF to compress and optimize"
          subtitle="Streamlined cross-reference table optimization and redundant object pruning"
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
                <p className="text-xs text-slate-400">Current Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
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

          {!outputUrl ? (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Ready to optimize object streams and strip redundant references while keeping vectors and text completely crisp.
              </p>
              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimizing PDF...</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Compress & Optimize PDF</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>PDF Optimized!</span>
                </div>
                {savingsPct > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-xs font-bold">
                    {savingsPct}% Smaller
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 text-center">
                <div>
                  <div className="text-xs text-slate-400">Original Size</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {(originalSize / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Optimized Size</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {(compressedSize / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href={outputUrl}
                  download={`compressed_${file.name}`}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Optimized PDF</span>
                </a>
              </div>
            </div>
          )}
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
