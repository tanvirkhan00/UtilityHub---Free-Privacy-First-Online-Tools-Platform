import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Download, CheckCircle2, AlertCircle, Info, Sliders, Pipette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const BackgroundEraser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [hexColor, setHexColor] = useState<string>('#ffffff');
  const [tolerance, setTolerance] = useState<number>(30);
  const [feather, setFeather] = useState<number>(10);
  const [isSampling, setIsSampling] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [previewBackdrop, setPreviewBackdrop] = useState<'checkered' | 'dark' | 'light'>('checkered');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setPreviewSrc(url);
    setResultUrl(null);
  };

  const processRemoval = () => {
    if (!previewSrc) return;
    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const { r: tr, g: tg, b: tb } = targetColor;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt(
          Math.pow(r - tr, 2) +
          Math.pow(g - tg, 2) +
          Math.pow(b - tb, 2)
        );

        const tolDist = (tolerance / 100) * 441.67; // max distance sqrt(255^2*3) = 441.67
        const featherDist = (feather / 100) * 441.67;

        if (dist <= tolDist) {
          data[i + 3] = 0; // fully transparent
        } else if (dist < tolDist + featherDist) {
          // Smooth alpha transition
          const alphaFactor = (dist - tolDist) / (featherDist || 1);
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
      }, 'image/png');
    };
  };

  useEffect(() => {
    if (previewSrc) {
      const timer = setTimeout(processRemoval, 150);
      return () => clearTimeout(timer);
    }
  }, [previewSrc, targetColor, tolerance, feather]);

  const handleSampleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isSampling) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
    const hex = `#${toHex(pixel[0])}${toHex(pixel[1])}${toHex(pixel[2])}`;
    setHexColor(hex);
    setIsSampling(false);
  };

  return (
    <div className="space-y-6">
      {/* Informational Architecture Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Client-Side Color-Keying Isolation:</span> This tool runs entirely in your browser using Euclidean RGB distance clustering. It excels at logos, graphics, icons, signatures, and studio photos with uniform backdrops without sending your files to a paid third-party cloud API.
        </div>
      </div>

      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={20}
          onFilesSelected={handleFileSelected}
          title="Upload image with solid or uniform background"
          subtitle="Isolate logos, artwork, products, and graphic assets into transparent PNGs"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewSrc(null); setResultUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              
              {/* Color to Remove */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Background Color to Erase:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={hexColor}
                    onChange={(e) => {
                      setHexColor(e.target.value);
                      const hex = e.target.value.replace('#', '');
                      setTargetColor({
                        r: parseInt(hex.substring(0, 2), 16),
                        g: parseInt(hex.substring(2, 4), 16),
                        b: parseInt(hex.substring(4, 6), 16),
                      });
                    }}
                    className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSampling(!isSampling)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 cursor-pointer transition-colors ${
                      isSampling
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Pipette className="w-3.5 h-3.5" />
                    <span>{isSampling ? 'Click image...' : 'Sample on Image'}</span>
                  </button>
                </div>
              </div>

              {/* Tolerance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Color Tolerance: {tolerance}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Edge Feather */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Edge Feathering: {feather}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full"
                />
              </div>

            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Original with sample handler */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Original Image {isSampling && '(Click to pick background color)'}
              </span>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center min-h-64">
                {previewSrc && (
                  <img
                    src={previewSrc}
                    alt="Original"
                    onClick={handleSampleClick}
                    className={`max-h-72 object-contain rounded-xl ${isSampling ? 'cursor-crosshair ring-2 ring-indigo-500' : ''}`}
                  />
                )}
              </div>
            </div>

            {/* Isolated Result */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Transparent PNG Result
                </span>
                {resultUrl && (
                  <a
                    href={resultUrl}
                    download={`transparent_${file.name.replace(/\.[^/.]+$/, '')}.png`}
                    onClick={() => confetti({ particleCount: 30, spread: 50 })}
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Transparent PNG</span>
                  </a>
                )}
              </div>

              {/* Backdrop Toggle */}
              <div className="flex justify-end gap-1 text-[11px] pb-1">
                <button
                  type="button"
                  onClick={() => setPreviewBackdrop('checkered')}
                  className={`px-2 py-0.5 rounded ${previewBackdrop === 'checkered' ? 'bg-slate-300 dark:bg-slate-700 font-bold' : 'text-slate-400'}`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBackdrop('dark')}
                  className={`px-2 py-0.5 rounded ${previewBackdrop === 'dark' ? 'bg-slate-300 dark:bg-slate-700 font-bold' : 'text-slate-400'}`}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBackdrop('light')}
                  className={`px-2 py-0.5 rounded ${previewBackdrop === 'light' ? 'bg-slate-300 dark:bg-slate-700 font-bold' : 'text-slate-400'}`}
                >
                  Light
                </button>
              </div>

              <div
                className={`rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center min-h-64 ${
                  previewBackdrop === 'dark'
                    ? 'bg-slate-950'
                    : previewBackdrop === 'light'
                    ? 'bg-white'
                    : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-100 dark:bg-slate-900'
                }`}
              >
                {resultUrl && (
                  <img
                    src={resultUrl}
                    alt="Transparent Result"
                    className="max-h-72 object-contain rounded-xl"
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
