import React, { useState } from 'react';
import { RefreshCw, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const FormatConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [quality, setQuality] = useState<number>(90);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setPreviewSrc(url);
    setConvertedUrl(null);
  };

  const handleConvert = () => {
    if (!previewSrc || !file) return;
    setIsConverting(true);

    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedUrl(URL.createObjectURL(blob));
            confetti({ particleCount: 35, spread: 55 });
          }
          setIsConverting(false);
        },
        targetFormat,
        quality / 100
      );
    };
  };

  const getExtension = () => {
    if (targetFormat === 'image/jpeg') return 'jpg';
    if (targetFormat === 'image/png') return 'png';
    return 'webp';
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={25}
          onFilesSelected={handleFileSelected}
          title="Upload image to convert format"
          subtitle="Convert between JPG, PNG, and modern high-efficiency WEBP formats"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
              <p className="text-xs text-slate-400">Current Type: {file.type || 'Unknown'}</p>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewSrc(null); setConvertedUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wider">
                Select Target Format:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { format: 'image/webp', label: 'WEBP', sub: 'Next-Gen & Ultra Light' },
                  { format: 'image/png', label: 'PNG', sub: 'Lossless & Transparent' },
                  { format: 'image/jpeg', label: 'JPEG', sub: 'Universal Compatibility' },
                ].map((item) => (
                  <button
                    key={item.format}
                    type="button"
                    onClick={() => { setTargetFormat(item.format as any); setConvertedUrl(null); }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      targetFormat === item.format
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {targetFormat === 'image/jpeg' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Background Fill for Transparency
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    JPEG does not support transparency; select a background color.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <span className="text-xs font-mono">{bgColor}</span>
                </div>
              </div>
            )}

            {targetFormat !== 'image/png' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Output Quality: {quality}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleConvert}
              disabled={isConverting}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isConverting ? 'animate-spin' : ''}`} />
              <span>Convert to {getExtension().toUpperCase()}</span>
            </button>
          </div>

          {convertedUrl && (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                    Image Converted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Exported format: {getExtension().toUpperCase()}
                  </p>
                </div>
              </div>
              <a
                href={convertedUrl}
                download={`${file.name.replace(/\.[^/.]+$/, '')}.${getExtension()}`}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download {getExtension().toUpperCase()}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
