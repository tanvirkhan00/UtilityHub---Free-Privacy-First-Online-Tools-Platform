import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Download, Sliders, RefreshCw, Eye, Wand2, Zap, ZoomIn, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface FilterSettings {
  sharpness: number;    // 0 - 100
  clarity: number;      // 0 - 100
  contrast: number;     // -50 - 50
  brightness: number;   // -50 - 50
  saturation: number;   // -50 - 50
  upscale: 1 | 2 | 4;   // 1x, 2x, 4x
}

const PRESETS: { id: string; name: string; desc: string; icon: string; settings: FilterSettings }[] = [
  {
    id: 'auto',
    name: 'Smart Auto Enhance',
    desc: 'Balanced clarity, natural saturation, and adaptive contrast.',
    icon: '✨',
    settings: { sharpness: 45, clarity: 35, contrast: 12, brightness: 6, saturation: 18, upscale: 1 }
  },
  {
    id: 'unblur',
    name: 'Unblur & Crisp Edges',
    desc: 'High-pass unsharp mask for blurry, soft, or out-of-focus photos.',
    icon: '🎯',
    settings: { sharpness: 80, clarity: 60, contrast: 15, brightness: 4, saturation: 10, upscale: 1 }
  },
  {
    id: 'hd-2x',
    name: '2x HD Super Resolution',
    desc: 'Doubles pixel count with edge-preserving antialiased reconstruction.',
    icon: '🚀',
    settings: { sharpness: 60, clarity: 50, contrast: 14, brightness: 5, saturation: 15, upscale: 2 }
  },
  {
    id: 'vibrant',
    name: 'Vibrant & Color Pop',
    desc: 'Boosts dynamic range, foliage, sunsets, and warm skin tones.',
    icon: '🎨',
    settings: { sharpness: 35, clarity: 40, contrast: 20, brightness: 8, saturation: 40, upscale: 1 }
  },
  {
    id: 'night-fix',
    name: 'Low-Light Shadow Recovery',
    desc: 'Lifts dark shadows and enhances underexposed night or indoor shots.',
    icon: '🌙',
    settings: { sharpness: 50, clarity: 45, contrast: 18, brightness: 22, saturation: 15, upscale: 1 }
  }
];

export const ImageQualityImprover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>('auto');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100 for before/after slider
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'enhanced'>('slider');
  const [originalSize, setOriginalSize] = useState<{ width: number; height: number; bytes: number }>({ width: 0, height: 0, bytes: 0 });
  const [enhancedSize, setEnhancedSize] = useState<{ width: number; height: number; bytes: number }>({ width: 0, height: 0, bytes: 0 });

  const [settings, setSettings] = useState<FilterSettings>(PRESETS[0].settings);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setOriginalSrc(url);
    setEnhancedUrl(null);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight, bytes: f.size });
    };
  };

  const applyPreset = (presetId: string) => {
    const p = PRESETS.find(item => item.id === presetId);
    if (p) {
      setActivePreset(presetId);
      setSettings(p.settings);
    }
  };

  // High-performance image enhancement algorithm
  const processEnhancement = useCallback(() => {
    if (!originalSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalSrc;
    img.onload = () => {
      try {
        const scale = settings.upscale;
        const targetWidth = img.naturalWidth * scale;
        const targetHeight = img.naturalHeight * scale;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // 1. Draw base scaled image with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // 2. Pixel manipulation for contrast, brightness, saturation, and unsharp masking
        const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imgData.data;
        const len = data.length;

        const contrastFactor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast));
        const brightnessOffset = (settings.brightness / 100) * 128;
        const satMultiplier = 1 + (settings.saturation / 100);

        // First pass: Tone, contrast, brightness, and vibrancy
        for (let i = 0; i < len; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // Brightness
          r += brightnessOffset;
          g += brightnessOffset;
          b += brightnessOffset;

          // Contrast
          r = contrastFactor * (r - 128) + 128;
          g = contrastFactor * (g - 128) + 128;
          b = contrastFactor * (b - 128) + 128;

          // Saturation
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
          r = gray + (r - gray) * satMultiplier;
          g = gray + (g - gray) * satMultiplier;
          b = gray + (b - gray) * satMultiplier;

          data[i] = Math.max(0, Math.min(255, r));
          data[i + 1] = Math.max(0, Math.min(255, g));
          data[i + 2] = Math.max(0, Math.min(255, b));
        }

        ctx.putImageData(imgData, 0, 0);

        // 3. Unsharp Mask & Micro-contrast pass via 3x3 Convolution kernel
        if (settings.sharpness > 0 || settings.clarity > 0) {
          const sharpAmount = (settings.sharpness / 100) * 1.5;
          const clarityAmount = (settings.clarity / 100) * 0.8;
          const totalEnhance = sharpAmount + clarityAmount;

          const srcPixels = new Uint8ClampedArray(data);
          const w = targetWidth;
          const h = targetHeight;

          // Kernel: center = 1 + 4*a, neighbors = -a
          const a = totalEnhance * 0.35;
          const centerWeight = 1 + 4 * a;
          const edgeWeight = -a;

          for (let y = 1; y < h - 1; y++) {
            const yOffset = y * w;
            for (let x = 1; x < w - 1; x++) {
              const idx = (yOffset + x) * 4;

              for (let c = 0; c < 3; c++) {
                const cIdx = idx + c;
                const top = ((y - 1) * w + x) * 4 + c;
                const bottom = ((y + 1) * w + x) * 4 + c;
                const left = (yOffset + (x - 1)) * 4 + c;
                const right = (yOffset + (x + 1)) * 4 + c;

                const val = (
                  srcPixels[cIdx] * centerWeight +
                  (srcPixels[top] + srcPixels[bottom] + srcPixels[left] + srcPixels[right]) * edgeWeight
                );

                data[cIdx] = Math.max(0, Math.min(255, val));
              }
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setEnhancedUrl(url);
              setEnhancedSize({
                width: targetWidth,
                height: targetHeight,
                bytes: blob.size,
              });
            }
            setIsProcessing(false);
          },
          file?.type === 'image/png' ? 'image/png' : 'image/jpeg',
          0.96
        );
      } catch (err) {
        console.error('Enhancement error:', err);
        setIsProcessing(false);
      }
    };
  }, [originalSrc, settings, file]);

  useEffect(() => {
    if (originalSrc) {
      const timer = setTimeout(processEnhancement, 200);
      return () => clearTimeout(timer);
    }
  }, [originalSrc, settings, processEnhancement]);

  // Handle slider movement
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleDownload = () => {
    if (!enhancedUrl) return;
    const a = document.createElement('a');
    a.href = enhancedUrl;
    const ext = file?.type === 'image/png' ? 'png' : 'jpg';
    a.download = `enhanced_${file?.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    a.click();
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={30}
          onFilesSelected={handleFileSelected}
          title="Upload image to enhance quality & unblur"
          subtitle="Supports JPG, PNG, WEBP with HD upscaling, unsharp masking, and clarity boost"
        />
      ) : (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  Original: {originalSize.width} × {originalSize.height} px • {(originalSize.bytes / 1024).toFixed(1)} KB
                  {enhancedSize.width > 0 && (
                    <span className="text-emerald-500 font-semibold ml-2">
                      → Enhanced: {enhancedSize.width} × {enhancedSize.height} px ({settings.upscale}x)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setOriginalSrc(null);
                  setEnhancedUrl(null);
                }}
                className="text-xs text-rose-500 hover:underline cursor-pointer"
              >
                Upload different image
              </button>
            </div>
          </div>

          {/* Preset Enhancement Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Enhancement Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {PRESETS.map((p) => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-base mb-1">{p.icon}</div>
                      <div className="font-bold text-xs truncate">{p.name}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Comparison & Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Visualizer Area (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setViewMode('slider')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'slider'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Before/After Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('side-by-side')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'side-by-side'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Side-by-Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('enhanced')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'enhanced'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Full Result
                  </button>
                </div>

                {isProcessing && (
                  <span className="text-xs text-indigo-500 font-semibold flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Rendering HD output...
                  </span>
                )}
              </div>

              {/* Viewport Frame */}
              {viewMode === 'slider' && (
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  className="relative w-full h-[450px] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center shadow-md"
                >
                  {/* Original Image (Left / Background layer) */}
                  {originalSrc && (
                    <img
                      src={originalSrc}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  )}

                  {/* Enhanced Image (Right / Clipped layer) */}
                  {enhancedUrl && (
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    >
                      <img
                        src={enhancedUrl}
                        alt="Enhanced"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Divider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center text-xs font-bold border border-slate-300">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Badges on viewer */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold z-10">
                    Original
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold z-10 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Enhanced HD
                  </div>
                </div>
              )}

              {viewMode === 'side-by-side' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Original Image</span>
                    <div className="h-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-2 flex items-center justify-center overflow-hidden">
                      {originalSrc && <img src={originalSrc} alt="Original" className="max-h-full max-w-full object-contain rounded-xl" />}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">Enhanced Result</span>
                    <div className="h-80 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-slate-900 p-2 flex items-center justify-center overflow-hidden">
                      {enhancedUrl && <img src={enhancedUrl} alt="Enhanced" className="max-h-full max-w-full object-contain rounded-xl" />}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'enhanced' && (
                <div className="h-[450px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 flex items-center justify-center overflow-hidden shadow-md">
                  {enhancedUrl && (
                    <img src={enhancedUrl} alt="Enhanced Output" className="max-h-full max-w-full object-contain rounded-2xl" />
                  )}
                </div>
              )}

            </div>

            {/* Fine-Tuning Controls (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Custom Quality Sliders
                  </h4>
                  <button
                    type="button"
                    onClick={() => applyPreset('auto')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Sharpness & Edge Detection */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Sharpness & Micro-Edges</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{settings.sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.sharpness}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings(prev => ({ ...prev, sharpness: Number(e.target.value) }));
                    }}
                    className="w-full"
                  />
                </div>

                {/* Clarity & Texture */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Clarity & Depth</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{settings.clarity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.clarity}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings(prev => ({ ...prev, clarity: Number(e.target.value) }));
                    }}
                    className="w-full"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Dynamic Contrast</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{settings.contrast > 0 ? `+${settings.contrast}` : settings.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min={-30}
                    max={40}
                    value={settings.contrast}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings(prev => ({ ...prev, contrast: Number(e.target.value) }));
                    }}
                    className="w-full"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Color Vibrancy & Saturation</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{settings.saturation > 0 ? `+${settings.saturation}%` : `${settings.saturation}%`}</span>
                  </div>
                  <input
                    type="range"
                    min={-30}
                    max={60}
                    value={settings.saturation}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings(prev => ({ ...prev, saturation: Number(e.target.value) }));
                    }}
                    className="w-full"
                  />
                </div>

                {/* Brightness / Shadows */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Shadow / Brightness Lift</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{settings.brightness > 0 ? `+${settings.brightness}` : settings.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min={-30}
                    max={40}
                    value={settings.brightness}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setSettings(prev => ({ ...prev, brightness: Number(e.target.value) }));
                    }}
                    className="w-full"
                  />
                </div>

                {/* HD Upscale Factor */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Resolution Scale (Super Resolution):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { factor: 1, label: '1x (Original)' },
                      { factor: 2, label: '2x HD' },
                      { factor: 4, label: '4x Ultra HD' },
                    ].map((item) => (
                      <button
                        key={item.factor}
                        type="button"
                        onClick={() => {
                          setActivePreset('custom');
                          setSettings(prev => ({ ...prev, upscale: item.factor as any }));
                        }}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          settings.upscale === item.factor
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Download */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!enhancedUrl || isProcessing}
                    className="w-full py-3 rounded-2xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Enhanced Image</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
