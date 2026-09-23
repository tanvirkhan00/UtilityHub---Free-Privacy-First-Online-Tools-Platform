import React, { useState, useEffect } from 'react';
import { Share2, Download, CheckCircle2, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface SocialPreset {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  ratio: string;
  badge: string;
}

const PRESETS: SocialPreset[] = [
  { id: 'yt-thumb', name: 'YouTube Thumbnail', platform: 'YouTube', width: 1280, height: 720, ratio: '16:9', badge: 'Popular' },
  { id: 'ig-square', name: 'Instagram Square Post', platform: 'Instagram', width: 1080, height: 1080, ratio: '1:1', badge: 'Standard' },
  { id: 'ig-story', name: 'Instagram Story / Reel', platform: 'Instagram / TikTok', width: 1080, height: 1920, ratio: '9:16', badge: 'Vertical' },
  { id: 'x-post', name: 'X / Twitter Post', platform: 'X / Twitter', width: 1600, height: 900, ratio: '16:9', badge: 'Feed' },
  { id: 'x-header', name: 'X / Twitter Banner', platform: 'X / Twitter', width: 1500, height: 500, ratio: '3:1', badge: 'Header' },
  { id: 'li-post', name: 'LinkedIn Feed Post', platform: 'LinkedIn', width: 1200, height: 627, ratio: '1.91:1', badge: 'B2B' },
  { id: 'fb-post', name: 'Facebook Feed Post', platform: 'Facebook', width: 1200, height: 630, ratio: '1.91:1', badge: 'Feed' },
];

export const SocialMediaResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SocialPreset>(PRESETS[0]);
  const [fitMode, setFitMode] = useState<'cover' | 'contain-blur' | 'contain-pad'>('cover');
  const [padColor, setPadColor] = useState<string>('#0f172a');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    const url = URL.createObjectURL(files[0]);
    setPreviewSrc(url);
  };

  const renderPreset = () => {
    if (!previewSrc) return;
    const img = new Image();
    img.src = previewSrc;
    img.onload = () => {
      const { width: targetW, height: targetH } = selectedPreset;
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (fitMode === 'cover') {
        // Smart center crop cover
        const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      } else if (fitMode === 'contain-blur') {
        // Background blurred layer
        ctx.filter = 'blur(30px)';
        const bgScale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight) * 1.2;
        ctx.drawImage(
          img,
          (targetW - img.naturalWidth * bgScale) / 2,
          (targetH - img.naturalHeight * bgScale) / 2,
          img.naturalWidth * bgScale,
          img.naturalHeight * bgScale
        );
        ctx.filter = 'none';

        // Foreground dark overlay for readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, targetW, targetH);

        // Foreground contained image
        const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      } else {
        // Contain with solid pad color
        ctx.fillStyle = padColor;
        ctx.fillRect(0, 0, targetW, targetH);

        const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.95);
    };
  };

  useEffect(() => {
    if (previewSrc) {
      const timer = setTimeout(renderPreset, 150);
      return () => clearTimeout(timer);
    }
  }, [previewSrc, selectedPreset, fitMode, padColor]);

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={25}
          onFilesSelected={handleFileSelected}
          title="Upload image to resize for Social Media"
          subtitle="Instant presets for YouTube, Instagram, LinkedIn, TikTok, and X (Twitter)"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
              <p className="text-xs text-slate-400">Ready to transform into verified social platform dimensions</p>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); setPreviewSrc(null); setResultUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Choose different image
            </button>
          </div>

          {/* Presets Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Social Platform Preset
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {preset.platform}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {preset.ratio}
                      </span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm truncate">
                      {preset.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      {preset.width} × {preset.height} px
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Framing / Fit Mode */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Fitting Mode:</span>
              <div className="flex gap-2">
                {[
                  { id: 'cover', label: 'Cover (Center Crop)' },
                  { id: 'contain-blur', label: 'Contain with Blurred Backdrop' },
                  { id: 'contain-pad', label: 'Solid Padding' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFitMode(mode.id as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      fitMode === mode.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {fitMode === 'contain-pad' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Pad Color:</span>
                <input
                  type="color"
                  value={padColor}
                  onChange={(e) => setPadColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                />
              </div>
            )}
          </div>

          {/* Render Result Preview & Download */}
          {resultUrl && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {selectedPreset.name} Preview ({selectedPreset.width} × {selectedPreset.height} px)
                  </h4>
                  <p className="text-xs text-slate-400">Optimized for platform clarity and crisp retina rendering</p>
                </div>

                <a
                  href={resultUrl}
                  download={`${selectedPreset.id}_${selectedPreset.width}x${selectedPreset.height}.jpg`}
                  onClick={() => confetti({ particleCount: 30, spread: 50 })}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {selectedPreset.platform} Image</span>
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-900 p-4 flex items-center justify-center min-h-64">
                <img
                  src={resultUrl}
                  alt="Social Preview"
                  className="max-h-96 object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
