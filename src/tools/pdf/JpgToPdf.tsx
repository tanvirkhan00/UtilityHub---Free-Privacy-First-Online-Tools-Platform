import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileImage, Download, Trash2, CheckCircle2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4'>('fit');
  const [margin, setMargin] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setError(null);
    setOutputUrl(null);
    const newItems: ImageItem[] = files.map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl: URL.createObjectURL(f),
      name: f.name,
      size: f.size
    }));
    setImages(prev => [...prev, ...newItems]);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setImages(copy);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    try {
      setIsProcessing(true);
      setError(null);
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let pdfImage;
        const isPng = item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png');
        
        try {
          if (isPng) {
            pdfImage = await pdfDoc.embedPng(arrayBuffer);
          } else {
            pdfImage = await pdfDoc.embedJpg(arrayBuffer);
          }
        } catch (embedErr) {
          // If browser image format wasn't straight jpeg/png bytes (e.g. webp or color-indexed png), convert via canvas
          const imgBitmap = await createImageBitmap(item.file);
          const canvas = document.createElement('canvas');
          canvas.width = imgBitmap.width;
          canvas.height = imgBitmap.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(imgBitmap, 0, 0);
            const jpegBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.92));
            if (jpegBlob) {
              const jpegBuf = await jpegBlob.arrayBuffer();
              pdfImage = await pdfDoc.embedJpg(jpegBuf);
            }
          }
        }

        if (!pdfImage) continue;

        const { width: imgW, height: imgH } = pdfImage;

        if (pageSize === 'fit') {
          const page = pdfDoc.addPage([imgW + margin * 2, imgH + margin * 2]);
          page.drawImage(pdfImage, {
            x: margin,
            y: margin,
            width: imgW,
            height: imgH
          });
        } else {
          // Standard A4: 595.28 x 841.89 points
          const a4W = 595.28;
          const a4H = 841.89;
          const page = pdfDoc.addPage([a4W, a4H]);
          const maxAvailableW = a4W - margin * 2;
          const maxAvailableH = a4H - margin * 2;
          const scale = Math.min(maxAvailableW / imgW, maxAvailableH / imgH, 1);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          page.drawImage(pdfImage, {
            x: (a4W - drawW) / 2,
            y: (a4H - drawH) / 2,
            width: drawW,
            height: drawH
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setOutputUrl(URL.createObjectURL(blob));
      confetti({ particleCount: 50, spread: 70 });
    } catch (err: any) {
      console.error(err);
      setError('Conversion failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileUploader
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        multiple={true}
        maxSizeMB={25}
        onFilesSelected={handleFilesSelected}
        title="Upload images to convert to PDF"
        subtitle="Combine JPG, PNG, or WEBP photos into a high-quality PDF document"
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Selected Images ({images.length})
            </h3>
            <button
              type="button"
              onClick={() => { setImages([]); setOutputUrl(null); }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-xs group flex flex-col justify-between"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-2 relative">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                    #{idx + 1}
                  </div>
                </div>

                <div className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate mb-2">
                  {item.name}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Settings & Convert */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Page Layout:</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="fit">Auto-fit Image Dimensions</option>
                  <option value="a4">Standard A4 Document</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Margin Padding:</label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={0}>No Margin (Edge-to-Edge)</option>
                  <option value={20}>Standard (20px)</option>
                  <option value={40}>Wide Margin (40px)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={convertToPdf}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Building PDF...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4" />
                  <span>Convert to PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {outputUrl && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                Images Converted to PDF!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your compiled PDF is ready to download.
              </p>
            </div>
          </div>
          <a
            href={outputUrl}
            download="converted_images.pdf"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};
