import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Sparkles, Wifi, Link2, Type, User } from 'lucide-react';
import confetti from 'canvas-confetti';

type QrType = 'url' | 'text' | 'wifi' | 'vcard';

export const QrCodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QrType>('url');
  const [urlInput, setUrlInput] = useState<string>('https://utilityhub.dev');
  const [textInput, setTextInput] = useState<string>('Welcome to UtilityHub!');
  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // vCard
  const [vcardName, setVcardName] = useState<string>('Alex Rivera');
  const [vcardEmail, setVcardEmail] = useState<string>('alex@example.com');
  const [vcardPhone, setVcardPhone] = useState<string>('+1 555-0199');

  // Customization
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrSize, setQrSize] = useState<number>(400);

  // Output
  const [dataUrl, setDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const getPayload = (): string => {
    switch (qrType) {
      case 'url':
        return urlInput.trim();
      case 'text':
        return textInput.trim();
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      default:
        return urlInput;
    }
  };

  const generateQr = async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      const url = await QRCode.toDataURL(payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });
      setDataUrl(url);

      const svg = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });
      setSvgString(svg);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  useEffect(() => {
    generateQr();
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, vcardName, vcardEmail, vcardPhone, fgColor, bgColor, errorLevel, qrSize]);

  const handleDownloadSvg = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(getPayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Settings & Inputs */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'url', label: 'Website URL', icon: Link2 },
            { id: 'text', label: 'Plain Text', icon: Type },
            { id: 'wifi', label: 'Wi-Fi Login', icon: Wifi },
            { id: 'vcard', label: 'Contact vCard', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = qrType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setQrType(item.id as any)}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Fields based on Type */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          {qrType === 'url' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website Address (URL):</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Content / Message:</label>
              <textarea
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter any text or note..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Network Name (SSID):</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password:</label>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Leave empty for open WiFi"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Security Type:</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {qrType === 'vcard' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={vcardName}
                  onChange={(e) => setVcardName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email:</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone:</label>
                  <input
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Styling & Customization */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Colors & Error Tolerance
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Foreground:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono">{fgColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Background:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div>
              <label className="text-slate-500 block mb-1 font-medium">Error Correction:</label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="L">L - 7% Recovery (Smallest)</option>
                <option value="M">M - 15% Recovery (Standard)</option>
                <option value="Q">Q - 25% Recovery (High)</option>
                <option value="H">H - 30% Recovery (Maximum)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-medium">Resolution ({qrSize}px):</label>
              <input
                type="range"
                min={200}
                max={800}
                step={50}
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Live Preview & Download */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live QR Preview
          </span>

          <div className="p-4 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
            {dataUrl && (
              <img
                src={dataUrl}
                alt="QR Code"
                className="w-64 h-64 object-contain rounded-lg"
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="w-full space-y-2 pt-2">
            <a
              href={dataUrl}
              download="qrcode.png"
              onClick={() => confetti({ particleCount: 30, spread: 50 })}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG ({qrSize}×{qrSize})</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadSvg}
              className="w-full py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Vector SVG</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPayload}
              className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied encoded data!' : 'Copy encoded payload text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
