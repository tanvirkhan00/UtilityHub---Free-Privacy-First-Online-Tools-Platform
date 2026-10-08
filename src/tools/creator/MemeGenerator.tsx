import React, { useState, useRef, useEffect } from 'react';
import { Smile, Download, Upload, RefreshCw, Type, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

// Built-in 100% CORS-safe starter canvases
const POPULAR_TEMPLATES = [
  {
    name: 'Dramatic Code Neon',
    color1: '#312e81',
    color2: '#0f172a',
    accent: '#818cf8',
    label: '💻 Tech / Coding',
  },
  {
    name: 'Fiery Sunset Red',
    color1: '#7f1d1d',
    color2: '#450a0a',
    accent: '#f87171',
    label: '🔥 Intense / Drama',
  },
  {
    name: 'Emerald Chill Green',
    color1: '#064e3b',
    color2: '#022c22',
    accent: '#34d399',
    label: '🌿 Chill / Success',
  },
  {
    name: 'Cyberpunk Purple',
    color1: '#581c87',
    color2: '#1e1b4b',
    accent: '#c084fc',
    label: '👾 Cyberpunk',
  },
];

export const MemeGenerator: React.FC = () => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customImgSrc, setCustomImgSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>('ONE DOES NOT SIMPLY');
  const [bottomText, setBottomText] = useState<string>('DEPLOY ON FRIDAY AFTERNOON');
  const [fontSize, setFontSize] = useState<number>(44);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCustomUpload = (files: File[]) => {
    if (!files[0]) return;
    const url = URL.createObjectURL(files[0]);
    setCustomImgSrc(url);
  };

  const renderMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawTextOverCanvas = () => {
      // Typography
      ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(3, Math.round(fontSize / 7));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const renderWrappedText = (text: string, yPos: number, isBottom: boolean) => {
        const displayText = uppercase ? text.toUpperCase() : text;
        const words = displayText.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width - 40 && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        const lineHeight = fontSize * 1.18;
        const startY = isBottom
          ? canvas.height - (lines.length * lineHeight) - 18
          : yPos;

        lines.forEach((line, idx) => {
          const y = startY + (idx * lineHeight);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      };

      if (topText) {
        renderWrappedText(topText, 18, false);
      }

      if (bottomText) {
        renderWrappedText(bottomText, 0, true);
      }

      try {
        setDownloadUrl(canvas.toDataURL('image/jpeg', 0.95));
      } catch (e) {
        console.error('Canvas export error:', e);
      }
    };

    if (customImgSrc) {
      const img = new Image();
      img.src = customImgSrc;
      img.onload = () => {
        canvas.width = 750;
        canvas.height = Math.round((img.naturalHeight / img.naturalWidth) * 750);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTextOverCanvas();
      };
    } else {
      // Draw dynamic gradient backdrop template
      canvas.width = 750;
      canvas.height = 560;

      const tmpl = POPULAR_TEMPLATES[selectedTemplateIndex] || POPULAR_TEMPLATES[0];
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, tmpl.color1);
      grad.addColorStop(1, tmpl.color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle decorative watermark badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 180, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tmpl.label, canvas.width / 2, canvas.height / 2);

      drawTextOverCanvas();
    }
  };

  useEffect(() => {
    renderMeme();
  }, [customImgSrc, selectedTemplateIndex, topText, bottomText, fontSize, uppercase, textColor, strokeColor]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Meme Controls */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Templates Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Choose Starter Background or Upload Image:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POPULAR_TEMPLATES.map((tmpl, idx) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => {
                  setCustomImgSrc(null);
                  setSelectedTemplateIndex(idx);
                }}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                  !customImgSrc && selectedTemplateIndex === idx
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${tmpl.color1}, ${tmpl.color2})`,
                }}
              >
                <div className="text-xs font-bold text-white truncate">{tmpl.label}</div>
                <div className="text-[10px] text-white/70 mt-0.5">{tmpl.name}</div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <FileUploader
              accept="image/*"
              maxSizeMB={15}
              onFilesSelected={handleCustomUpload}
              title="Or upload your own photo / screenshot"
              subtitle="Drop any meme template or camera photo from your device"
            />
          </div>
        </div>

        {/* Text Captions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Caption Texts
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Top Text:</label>
            <input
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="TOP CAPTION"
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Bottom Text:</label>
            <input
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="BOTTOM CAPTION"
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Typography Controls */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Font Size ({fontSize}px):</label>
              <input
                type="range"
                min={20}
                max={72}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Text Fill:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border"
                />
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">Outline:</span>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Canvas Preview & Download */}
      <div className="lg:col-span-6 space-y-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Meme Output
            </h4>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="meme.jpg"
                onClick={() => confetti({ particleCount: 35, spread: 60 })}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Meme</span>
              </a>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 p-2 flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[480px] object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
