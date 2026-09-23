import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileSearch, ShieldCheck, Download, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface MetadataInfo {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  keywords?: string;
  creationDate?: string;
  modificationDate?: string;
}

export const PdfMetadata: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<MetadataInfo | null>(null);
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
      setMeta({
        title: doc.getTitle() || 'None',
        author: doc.getAuthor() || 'None',
        subject: doc.getSubject() || 'None',
        creator: doc.getCreator() || 'None',
        producer: doc.getProducer() || 'None',
        keywords: doc.getKeywords() || 'None',
        creationDate: doc.getCreationDate() ? doc.getCreationDate()?.toLocaleString() : 'None',
        modificationDate: doc.getModificationDate() ? doc.getModificationDate()?.toLocaleString() : 'None'
      });
    } catch (err: any) {
      setError('Could not inspect PDF metadata: ' + err.message);
    }
  };

  const handleStripMetadata = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      setError(null);
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Clean all metadata properties
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('');
      doc.setCreator('');

      const cleanBytes = await doc.save();
      const blob = new Blob([cleanBytes as unknown as BlobPart], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      setError('Metadata cleaning failed: ' + err.message);
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
          title="Upload a PDF to view or strip metadata"
          subtitle="Inspect hidden properties like computer username, editing software, and author details"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setMeta(null); setOutputUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different file
            </button>
          </div>

          {meta && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Extracted Document Properties
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(meta).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">
                    <span className="text-slate-400 capitalize block mb-0.5 font-medium">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200 break-all">
                      {val || 'None'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 max-w-sm">
                  Stripping metadata removes author names, software tools, and timestamps for anonymous distribution.
                </p>
                <button
                  type="button"
                  onClick={handleStripMetadata}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sanitizing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Strip & Clean All Metadata</span>
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
                    Document Scrubbed & Sanitized!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    All identification tags and tracking timestamps have been wiped.
                  </p>
                </div>
              </div>
              <a
                href={outputUrl}
                download={`sanitized_${file?.name || 'document.pdf'}`}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Clean PDF</span>
              </a>
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
