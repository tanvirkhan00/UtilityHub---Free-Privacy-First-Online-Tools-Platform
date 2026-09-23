import React, { useState } from 'react';
import { Palette, Lock, Unlock, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ColorItem {
  hex: string;
  locked: boolean;
}

const PRESET_PALETTES = [
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#0081a7', '#00afb9', '#fdfcdc', '#fed9b7', '#f07167'],
  ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'],
  ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
];

export const ColorPaletteTool: React.FC = () => {
  const [colors, setColors] = useState<ColorItem[]>([
    { hex: '#6366f1', locked: false },
    { hex: '#a855f7', locked: false },
    { hex: '#ec4899', locked: false },
    { hex: '#3b82f6', locked: false },
    { hex: '#10b981', locked: false },
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const generateRandomHex = () => {
    return '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  };

  const generateNewPalette = () => {
    setColors(prev =>
      prev.map(c => (c.locked ? c : { ...c, hex: generateRandomHex() }))
    );
    confetti({ particleCount: 25, spread: 45 });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        generateNewPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLock = (index: number) => {
    setColors(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], locked: !copy[index].locked };
      return copy;
    });
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const copyCssVars = () => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    setCopiedHex('css');
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const loadPreset = (preset: string[]) => {
    setColors(preset.map(hex => ({ hex, locked: false })));
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            5-Color Palette Harmonizer
          </h3>
          <p className="text-xs text-slate-400">
            Lock your favorite colors, then hit generate to discover complementary schemes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={generateNewPalette}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Random (Spacebar)</span>
          </button>
          <button
            type="button"
            onClick={copyCssVars}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            {copiedHex === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHex === 'css' ? 'Copied CSS!' : 'Copy CSS Tokens'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Swatches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 h-80 sm:h-96">
        {colors.map((c, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl p-4 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm group"
            style={{ backgroundColor: c.hex }}
          >
            {/* Top Lock Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toggleLock(idx)}
                className="p-2 rounded-xl bg-black/25 backdrop-blur-md text-white hover:bg-black/40 transition-colors cursor-pointer"
                title={c.locked ? 'Unlock color' : 'Lock color'}
              >
                {c.locked ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4 opacity-75" />}
              </button>
            </div>

            {/* Bottom Hex & Copy */}
            <div className="p-3 rounded-2xl bg-black/30 backdrop-blur-md text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/70 block">Color #{idx + 1}</span>
                <span className="font-mono font-bold text-sm tracking-wider uppercase">{c.hex}</span>
              </div>
              <button
                type="button"
                onClick={() => copyColor(c.hex)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                title="Copy HEX"
              >
                {copiedHex === c.hex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preset Curated Schemes */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Curated Design Inspiration Palettes
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {PRESET_PALETTES.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadPreset(preset)}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-400 transition-colors cursor-pointer flex flex-col gap-2"
            >
              <div className="flex h-6 rounded-xl overflow-hidden">
                {preset.map((hex, j) => (
                  <div key={j} className="flex-1 h-full" style={{ backgroundColor: hex }} />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-slate-500 text-left">Palette #{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
