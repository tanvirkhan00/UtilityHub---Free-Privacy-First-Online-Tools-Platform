import React, { useState, useRef, useEffect } from 'react';
import { Crop, Download, CheckCircle2, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

type AspectRatioOption = 'free' | '1:1' | '16:9' | '4:3' | '9:16';

export const ImageCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('1:1');
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 }); // percentage based
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setImgUrl(url);
    setCroppedUrl(null);
    setCropBox({ x: 15, y: 15, width: 70, height: 70 });
  };

  const applyRatio = (ratio: AspectRatioOption) => {
    setAspectRatio(ratio);
    if (!imageRef.current) return;
    const imgAspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight;

    let targetRatio = 1;
    if (ratio === '1:1') targetRatio = 1;
    else if (ratio === '16:9') targetRatio = 16 / 9;
    else if (ratio === '4:3') targetRatio = 4 / 3;
    else if (ratio === '9:16') targetRatio = 9 / 16;
    else return;

    // Adjust height/width percentages to match ratio
    let newW = 60;
    let newH = (newW / targetRatio) * imgAspect;
    if (newH > 85) {
      newH = 80;
      newW = (newH * targetRatio) / imgAspect;
    }

    setCropBox({
      x: Math.max(5, (100 - newW) / 2),
      y: Math.max(5, (100 - newH) / 2),
      width: Math.min(90, newW),
      height: Math.min(90, newH),
    });
  };

  const executeCrop = () => {
    if (!imageRef.current || !imgUrl) return;
    const img = imageRef.current;

    const realX = (cropBox.x / 100) * img.naturalWidth;
    const realY = (cropBox.y / 100) * img.naturalHeight;
    const realW = (cropBox.width / 100) * img.naturalWidth;
    const realH = (cropBox.height / 100) * img.naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(realW);
    canvas.height = Math.round(realH);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, realX, realY, realW, realH, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setCroppedUrl(URL.createObjectURL(blob));
        confetti({ particleCount: 30, spread: 50 });
      }
    }, 'image/png');
  };

  useEffect(() => {
    if (imgUrl) {
      const timer = setTimeout(executeCrop, 200);
      return () => clearTimeout(timer);
    }
  }, [cropBox, imgUrl]);

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={25}
          onFilesSelected={handleFileSelected}
          title="Upload an image to crop"
          subtitle="Precision cropping with social aspect ratio presets (1:1, 16:9, 4:3, 9:16)"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
            <button
              type="button"
              onClick={() => { setFile(null); setImgUrl(null); setCroppedUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Ratio Selector */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 mr-2">Aspect Ratio:</span>
            {(['1:1', '16:9', '4:3', '9:16', 'free'] as AspectRatioOption[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => applyRatio(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  aspectRatio === r
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Interactive Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Cropping Canvas Frame */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 p-4 flex items-center justify-center relative overflow-hidden select-none min-h-80">
              {imgUrl && (
                <div className="relative inline-block">
                  <img
                    ref={imageRef}
                    src={imgUrl}
                    alt="Source"
                    className="max-h-96 w-auto block opacity-85"
                  />
                  {/* Bounding Box Visualizer */}
                  <div
                    className="absolute border-2 border-indigo-400 bg-indigo-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                    style={{
                      left: `${cropBox.x}%`,
                      top: `${cropBox.y}%`,
                      width: `${cropBox.width}%`,
                      height: `${cropBox.height}%`,
                    }}
                  >
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white translate-x-1 translate-y-1"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Result & Adjustments */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Cropped Output Preview
                  </h4>
                  {croppedUrl && (
                    <a
                      href={croppedUrl}
                      download={`cropped_${file.name}`}
                      className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-center min-h-52">
                  {croppedUrl && (
                    <img
                      src={croppedUrl}
                      alt="Cropped Preview"
                      className="max-h-60 object-contain rounded-lg"
                    />
                  )}
                </div>

                {/* Manual Box Controls */}
                <div className="space-y-2 pt-2 text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Adjust Crop Frame Zoom & Position:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Size ({cropBox.width}%)</span>
                      <input
                        type="range"
                        min={20}
                        max={95}
                        value={cropBox.width}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCropBox(prev => ({
                            ...prev,
                            width: val,
                            height: aspectRatio === '1:1' ? val : prev.height,
                            x: Math.min(prev.x, 100 - val),
                          }));
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Center Offset</span>
                      <button
                        type="button"
                        onClick={() => setCropBox(prev => ({ ...prev, x: (100 - prev.width) / 2, y: (100 - prev.height) / 2 }))}
                        className="w-full py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Recenter
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
