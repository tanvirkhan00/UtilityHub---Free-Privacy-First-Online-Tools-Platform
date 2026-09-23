import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Copy, Check, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

export const ColorPickerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<string>('#6366f1');
  const [selectedColor, setSelectedColor] = useState<string>('#6366f1');
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Scale canvas to reasonable max display size
      const maxDim = 600;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);

      // Extract dominant palette
      const imgData = ctx.getImageData(0, 0, w, h).data;
      const colorCounts: Record<string, number> = {};
      // Sample step
      for (let i = 0; i < imgData.length; i += 4 * 20) {
        const r = Math.min(255, Math.round(imgData[i] / 16) * 16);
        const g = Math.min(255, Math.round(imgData[i + 1] / 16) * 16);
        const b = Math.min(255, Math.round(imgData[i + 2] / 16) * 16);
        const hex = rgbToHex(r, g, b);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([hex]) => hex);

      setPalette(sorted);
      if (sorted[0]) setSelectedColor(sorted[0]);
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setHoverColor(hex);
  };

  const handleCanvasClick = () => {
    setSelectedColor(hoverColor);
    confetti({ particleCount: 20, spread: 40 });
  };

  const copyColor = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-6">
      {!imgSrc ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={20}
          onFilesSelected={handleFileSelected}
          title="Upload an image to inspect colors"
          subtitle="Click on any pixel to sample colors and extract the dominant palette"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file?.name}</h4>
            <button
              type="button"
              onClick={() => { setImgSrc(null); setFile(null); setPalette([]); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Canvas Viewer */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onClick={handleCanvasClick}
                className="max-w-full max-h-96 object-contain cursor-crosshair rounded-xl shadow-lg"
              />
              <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
                <Pipette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Move cursor over the image to preview, click to select pixel</span>
              </div>
            </div>

            {/* Color Details & Extracted Palette */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Active Selected Color */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Pixel Color
                  </span>
                  <span className="text-xs text-slate-400">Hover: {hoverColor}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-700 shadow-md shrink-0"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div>
                    <div className="text-xl font-mono font-bold text-slate-900 dark:text-white uppercase">
                      {selectedColor}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyColor(selectedColor, 'hex')}
                      className="mt-1 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'hex' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'hex' ? 'Copied' : 'Copy HEX'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Extracted Palette */}
              {palette.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-500" />
                      Extracted Palette
                    </span>
                    <button
                      type="button"
                      onClick={() => copyColor(palette.join(', '), 'all')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {copiedKey === 'all' ? 'Copied All!' : 'Copy All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {palette.map((color, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSelectedColor(color); copyColor(color, `pal-${i}`); }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:scale-105 transition-transform cursor-pointer group"
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-1.5 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase truncate">
                          {color}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
