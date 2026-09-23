import React, { useState, useEffect } from 'react';
import { Maximize, Download, Lock, Unlock, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
  };

  const handleWidthChange = (newW: number) => {
    setWidth(newW);
    if (lockAspect && originalWidth > 0) {
      setHeight(Math.round((newW / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (newH: number) => {
    setHeight(newH);
    if (lockAspect && originalHeight > 0) {
      setWidth(Math.round((newH / originalHeight) * originalWidth));
    }
  };

  const applyPresetScale = (scale: number) => {
    setWidth(Math.round(originalWidth * scale));
    setHeight(Math.round(originalHeight * scale));
  };

  const generateResized = () => {
    if (!previewSrc || width <= 0 || height <= 0) return;
    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          setResizedUrl(URL.createObjectURL(blob));
          confetti({ particleCount: 35, spread: 55 });
        }
      }, file?.type || 'image/png', 0.95);
    };
  };

  useEffect(() => {
    if (width > 0 && height > 0 && previewSrc) {
      const timer = setTimeout(generateResized, 150);
      return () => clearTimeout(timer);
    }
  }, [width, height]);

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={25}
          onFilesSelected={handleFileSelected}
          title="Upload an image to resize dimensions"
          subtitle="Change pixel width and height with aspect ratio preservation"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
              <p className="text-xs text-slate-400">
                Original Resolution: {originalWidth} × {originalHeight} px
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewSrc(null); setResizedUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-5">
            {/* Dimensions inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Width (pixels):
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Height (pixels):
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    lockAspect
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspect ? 'Aspect Ratio Locked' : 'Freeform Ratio'}</span>
                </button>
              </div>
            </div>

            {/* Quick Percentage Presets */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Scaling Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '25%', scale: 0.25 },
                  { label: '50%', scale: 0.5 },
                  { label: '75%', scale: 0.75 },
                  { label: 'Original (100%)', scale: 1 },
                  { label: '150%', scale: 1.5 },
                  { label: '200%', scale: 2 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => applyPresetScale(item.scale)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resized Result Preview & Download */}
          {resizedUrl && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Live Resized Output ({width} × {height} px)
                  </h4>
                  <p className="text-xs text-slate-400">Rendered with smooth bicubic scaling</p>
                </div>
                <a
                  href={resizedUrl}
                  download={`resized_${width}x${height}_${file.name}`}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 p-4 flex items-center justify-center max-h-96">
                <img
                  src={resizedUrl}
                  alt="Resized"
                  className="max-h-80 object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
