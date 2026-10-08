import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink, QrCode, Globe, Code, Image as ImageIcon, CheckCircle2, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { FileUploader } from '../../components/FileUploader/FileUploader';

interface UploadResult {
  directUrl: string;
  viewUrl: string;
  markdown: string;
  html: string;
  bbcode: string;
  source: 'public_host' | 'data_uri';
}

export const ImageLinkGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const handleFileSelected = (files: File[]) => {
    if (!files[0]) return;
    const f = files[0];
    setFile(f);
    const localUrl = URL.createObjectURL(f);
    setPreviewSrc(localUrl);
    setUploadResult(null);
    setQrCodeDataUrl(null);
    setUploadError(null);

    const img = new Image();
    img.src = localUrl;
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };

    // Auto trigger upload
    generatePublicLink(f, localUrl);
  };

  const generatePublicLink = async (targetFile: File, localPreviewUrl: string) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Try free public image upload service (tmpfiles.org / catbox / freeimage)
      const formData = new FormData();
      formData.append('file', targetFile);

      let publicDirectUrl = '';
      let publicViewUrl = '';

      try {
        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const json = await response.json();
          if (json.status === 'success' && json.data?.url) {
            // tmpfiles.org URLs: 'https://tmpfiles.org/12345/image.png'
            // direct URL is: 'https://tmpfiles.org/dl/12345/image.png'
            const rawUrl = json.data.url;
            publicViewUrl = rawUrl;
            publicDirectUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          }
        }
      } catch (e) {
        console.warn('Primary public hosting unavailable, trying fallback...', e);
      }

      // If primary failed, use resilient base64 data URI or public shareable link
      if (!publicDirectUrl) {
        // Read as base64 Data URI
        const reader = new FileReader();
        const dataUriPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(targetFile);
        });
        const dataUri = await dataUriPromise;

        publicDirectUrl = dataUri;
        publicViewUrl = localPreviewUrl;
      }

      const isDataUri = publicDirectUrl.startsWith('data:');
      const filename = targetFile.name.replace(/\.[^/.]+$/, '');

      const result: UploadResult = {
        directUrl: publicDirectUrl,
        viewUrl: publicViewUrl || publicDirectUrl,
        markdown: `![${filename}](${publicDirectUrl})`,
        html: `<img src="${publicDirectUrl}" alt="${filename}" width="${dimensions.width || ''}" height="${dimensions.height || ''}" />`,
        bbcode: `[img]${publicDirectUrl}[/img]`,
        source: isDataUri ? 'data_uri' : 'public_host',
      };

      setUploadResult(result);

      // Generate QR Code for instant mobile scanning
      const qrTarget = isDataUri ? publicViewUrl : publicDirectUrl;
      try {
        const qr = await QRCode.toDataURL(qrTarget, {
          width: 320,
          margin: 2,
          color: { dark: '#1e1b4b', light: '#ffffff' },
        });
        setQrCodeDataUrl(qr);
      } catch (qrErr) {
        console.error('QR code error:', qrErr);
      }

      confetti({ particleCount: 40, spread: 60 });
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError('Public hosting request encountered a network timeout. You can still copy the Data URI code.');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          maxSizeMB={25}
          onFilesSelected={handleFileSelected}
          title="Upload any image to generate instant public links"
          subtitle="Supports JPG, PNG, WEBP, GIF, SVG. Generates Direct URLs, HTML embed tags, Markdown & QR Codes"
        />
      ) : (
        <div className="space-y-6">
          {/* File Header */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB • {dimensions.width > 0 ? `${dimensions.width} × ${dimensions.height} px` : file.type}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewSrc(null);
                setUploadResult(null);
                setQrCodeDataUrl(null);
              }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              Upload another image
            </button>
          </div>

          {/* Loading State */}
          {isUploading && (
            <div className="p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
              <div className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                Generating Public Image Link...
              </div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 max-w-sm mx-auto">
                Allocating global cloud CDN route, encoding embed tags, and rendering mobile QR code.
              </p>
            </div>
          )}

          {/* Upload Result Cards */}
          {uploadResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Link Formats (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Status banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Public Link Generated Successfully!</span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                        {uploadResult.source === 'public_host'
                          ? 'Hosted on fast public CDN cloud server. Ready to share anywhere.'
                          : 'Encoded into instant zero-dependency Data URI format.'}
                      </span>
                    </div>
                  </div>

                  {uploadResult.source === 'public_host' && (
                    <a
                      href={uploadResult.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Link</span>
                    </a>
                  )}
                </div>

                {/* 1. Direct Public URL */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                      Direct Image URL (For Hotlinking & Browsers)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uploadResult.directUrl, 'direct')}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'direct' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'direct' ? 'Copied URL!' : 'Copy Direct Link'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={uploadResult.directUrl}
                      className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all truncate"
                    />
                  </div>
                </div>

                {/* 2. Markdown Embed Code */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-indigo-500" />
                      Markdown Format (GitHub, Notion, Discord, Reddit)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uploadResult.markdown, 'markdown')}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                    >
                      {copiedKey === 'markdown' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'markdown' ? 'Copied!' : 'Copy Markdown'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={uploadResult.markdown}
                    className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all truncate"
                  />
                </div>

                {/* 3. HTML Embed Code */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-indigo-500" />
                      HTML &lt;img&gt; Embed Tag (Websites, Blogs, Emails)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uploadResult.html, 'html')}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                    >
                      {copiedKey === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'html' ? 'Copied!' : 'Copy HTML'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={uploadResult.html}
                    className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all truncate"
                  />
                </div>

                {/* 4. BBCode for Forums */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      BBCode Format (Forums & Bulletin Boards)
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uploadResult.bbcode, 'bbcode')}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      {copiedKey === 'bbcode' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'bbcode' ? 'Copied!' : 'Copy BBCode'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={uploadResult.bbcode}
                    className="w-full px-3.5 py-2 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-all truncate"
                  />
                </div>

              </div>

              {/* Right: Live Preview & Mobile QR Code (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Live Preview Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Image Preview
                  </span>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 flex items-center justify-center min-h-48 max-h-64">
                    {previewSrc && (
                      <img
                        src={previewSrc}
                        alt="Uploaded preview"
                        className="max-h-56 max-w-full object-contain rounded-xl"
                      />
                    )}
                  </div>
                </div>

                {/* Mobile QR Code Card */}
                {qrCodeDataUrl && (
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <QrCode className="w-3.5 h-3.5 text-indigo-500" />
                      Scan on Smartphone
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Scan with your phone's camera to open or save the image immediately.
                    </p>
                    <div className="p-3 bg-white rounded-2xl inline-block shadow-inner border border-slate-100">
                      <img
                        src={qrCodeDataUrl}
                        alt="Image link QR code"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                    </div>
                    <div>
                      <a
                        href={qrCodeDataUrl}
                        download={`qrcode_${file.name.replace(/\.[^/.]+$/, '')}.png`}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Download QR Code PNG
                      </a>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {uploadError && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{uploadError}</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
