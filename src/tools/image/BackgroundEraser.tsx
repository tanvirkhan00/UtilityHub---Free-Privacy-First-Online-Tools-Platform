import React, { useState, useRef, useEffect } from 'react';
import { Eraser, Download, CheckCircle2, AlertCircle, Info, Sliders, Pipette, Wand2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const BackgroundEraser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [hexColor, setHexColor] = useState<string>('#ffffff');
  const [tolerance, setTolerance] = useState<number>(30);
  const [feather, setFeather] = useState<number>(8);
  const [isSampling, setIsSampling] = useState<boolean>(false);
  const [eraseMode, setEraseMode] = useState<'contiguous' | 'global'>('contiguous');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [previewBackdrop, setPreviewBackdrop] = useState<'checkered' | 'dark' | 'light'>('checkered');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setPreviewSrc(url);
    setResultUrl(null);

    // Auto-detect background color from corners
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Sample top-left corner (2,2)
        const p = ctx.getImageData(Math.min(2, img.naturalWidth - 1), Math.min(2, img.naturalHeight - 1), 1, 1).data;
        setTargetColor({ r: p[0], g: p[1], b: p[2] });
        const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
        setHexColor(`#${toHex(p[0])}${toHex(p[1])}${toHex(p[2])}`);
      }
    };
  };

  const processRemoval = () => {
    if (!previewSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const { r: tr, g: tg, b: tb } = targetColor;

      const tolDist = (tolerance / 100) * 441.67; // max distance sqrt(255^2*3) = 441.67
      const featherDist = (feather / 100) * 441.67;

      const colorDist = (r: number, g: number, b: number) => {
        return Math.sqrt(Math.pow(r - tr, 2) + Math.pow(g - tg, 2) + Math.pow(b - tb, 2));
      };

      if (eraseMode === 'contiguous') {
        // BFS Flood-fill from borders
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        // Push border pixels
        for (let x = 0; x < width; x++) {
          queue.push(x); // top row y=0
          queue.push((height - 1) * width + x); // bottom row
        }
        for (let y = 0; y < height; y++) {
          queue.push(y * width); // left col x=0
          queue.push(y * width + (width - 1)); // right col
        }

        while (queue.length > 0) {
          const idx = queue.pop()!;
          if (visited[idx]) continue;
          visited[idx] = 1;

          const pIdx = idx * 4;
          const r = data[pIdx];
          const g = data[pIdx + 1];
          const b = data[pIdx + 2];
          const dist = colorDist(r, g, b);

          if (dist <= tolDist) {
            data[pIdx + 3] = 0; // fully transparent

            // Expand to 4 neighbors
            const x = idx % width;
            const y = Math.floor(idx / width);

            if (x > 0 && !visited[idx - 1]) queue.push(idx - 1);
            if (x < width - 1 && !visited[idx + 1]) queue.push(idx + 1);
            if (y > 0 && !visited[idx - width]) queue.push(idx - width);
            if (y < height - 1 && !visited[idx + width]) queue.push(idx + width);
          } else if (dist < tolDist + featherDist) {
            const factor = (dist - tolDist) / (featherDist || 1);
            data[pIdx + 3] = Math.round(data[pIdx + 3] * factor);
          }
        }
      } else {
        // Global color distance match across whole image
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist = colorDist(r, g, b);

          if (dist <= tolDist) {
            data[i + 3] = 0;
          } else if (dist < tolDist + featherDist) {
            const alphaFactor = (dist - tolDist) / (featherDist || 1);
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  useEffect(() => {
    if (previewSrc) {
      const timer = setTimeout(processRemoval, 150);
      return () => clearTimeout(timer);
    }
  }, [previewSrc, targetColor, tolerance, feather, eraseMode]);

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

  const handleAutoRemove = () => {
    setEraseMode('contiguous');
    setTolerance(32);
    setFeather(10);
    processRemoval();
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Contiguous Edge-Isolation Engine:</span> Removes backgrounds without erasing inner elements like white teeth, shirts, or logos. Runs 100% locally in your browser memory.
        </div>
      </div>

      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={20}
          onFilesSelected={handleFileSelected}
          title="Upload image with solid or uniform background"
          subtitle="Isolate logos, artwork, products, and graphics into transparent PNGs"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
              <p className="text-xs text-slate-400">Ready for instant transparent PNG extraction</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAutoRemove}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Erase Background</span>
              </button>
              <button
                type="button"
                onClick={() => { setFile(null); setPreviewSrc(null); setResultUrl(null); }}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Choose different image
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              
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
                    <span>{isSampling ? 'Click image...' : 'Pick from Image'}</span>
                  </button>
                </div>
              </div>

              {/* Erase Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Isolation Mode:
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEraseMode('contiguous')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      eraseMode === 'contiguous'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Outer Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setEraseMode('global')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      eraseMode === 'global'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Everywhere
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
                  <span>Edge Smoothness: {feather}%</span>
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
                Original Image {isSampling && '(Click to pick color)'}
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
