import React, { useState, useEffect, useRef } from 'react';
import { FileArchive, Download, RefreshCw, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFile(f);
    setOriginalSize(f.size);
    const url = URL.createObjectURL(f);
    setPreviewSrc(url);
  };

  const compressImage = async () => {
    if (!previewSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw white background if converting to JPEG to handle transparency cleanly
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
            const blobUrl = URL.createObjectURL(blob);
            setCompressedUrl(blobUrl);
          }
          setIsProcessing(false);
        },
        outputFormat,
        quality / 100
      );
    };
  };

  useEffect(() => {
    if (previewSrc) {
      compressImage();
    }
  }, [previewSrc, quality, outputFormat]);

  const savingsPct = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          maxSizeMB={25}
          onFilesSelected={handleFileSelected}
          title="Upload an image to compress"
          subtitle="Supports JPG, PNG, and WEBP with instant local hardware acceleration"
        />
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
              <p className="text-xs text-slate-400">
                Original Size: {(originalSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewSrc(null);
                setCompressedUrl(null);
              }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Compression Quality: {quality}%
                  </span>
                  <span className="text-slate-400 font-normal">
                    {quality > 80 ? 'High Fidelity' : quality > 50 ? 'Balanced' : 'Aggressive'}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Format Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Output Format:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutputFormat('image/jpeg')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      outputFormat === 'image/jpeg'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    JPEG (.jpg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputFormat('image/webp')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      outputFormat === 'image/webp'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    WEBP (.webp)
                  </button>
                </div>
              </div>

            </div>

            {/* Savings & Metrics Banner */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block">Original</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {(originalSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Compressed</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {(compressedSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Savings</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {savingsPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Preview & Download Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Original Preview
              </span>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-center min-h-64">
                {previewSrc && (
                  <img
                    src={previewSrc}
                    alt="Original"
                    className="max-h-80 object-contain rounded-xl"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Compressed Result ({quality}%)
                </span>
                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`compressed_${file.name.replace(/\.[^/.]+$/, '')}.${outputFormat === 'image/jpeg' ? 'jpg' : 'webp'}`}
                    onClick={() => confetti({ particleCount: 30, spread: 50 })}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ({(compressedSize / 1024).toFixed(1)} KB)</span>
                  </a>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-center min-h-64 relative">
                {compressedUrl && (
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="max-h-80 object-contain rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
