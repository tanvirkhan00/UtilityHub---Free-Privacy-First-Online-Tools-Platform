import React, { useState } from 'react';
import { Eye, Copy, Check, Globe, Twitter, Share2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OgPreview: React.FC = () => {
  const [title, setTitle] = useState<string>('Modern UtilityHub — Fast, Free Online Web Tools');
  const [description, setDescription] = useState<string>('Free online tools for developers and creators. Compress images, split & merge PDFs, sanitize text, and generate QR codes locally.');
  const [siteUrl, setSiteUrl] = useState<string>('https://utilityhub.dev');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80');
  const [platform, setPlatform] = useState<'x' | 'facebook' | 'linkedin' | 'discord'>('x');
  const [copied, setCopied] = useState<boolean>(false);

  const getDomain = () => {
    try {
      const u = new URL(siteUrl);
      return u.hostname;
    } catch {
      return 'utilityhub.dev';
    }
  };

  const htmlTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${siteUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${siteUrl}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;

  const copyTags = () => {
    navigator.clipboard.writeText(htmlTags);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Fields */}
      <div className="lg:col-span-6 space-y-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Metadata Details
          </h4>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Page Title:</label>
              <span className={`font-mono text-[11px] ${title.length > 60 ? 'text-amber-500' : 'text-slate-400'}`}>
                {title.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Description:</label>
              <span className={`font-mono text-[11px] ${description.length > 160 ? 'text-amber-500' : 'text-slate-400'}`}>
                {description.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Canonical URL:</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">OG Image URL (1200×630 recommended):</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Export Meta Code */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ready-to-Paste HTML Meta Tags
            </h4>
            <button
              type="button"
              onClick={copyTags}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy HTML'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-mono overflow-x-auto max-h-48 leading-relaxed">
            {htmlTags}
          </pre>
        </div>
      </div>

      {/* Right Social Simulator */}
      <div className="lg:col-span-6 space-y-5">
        {/* Platform Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 w-fit">
          {[
            { id: 'x', label: 'X (Twitter)', icon: Twitter },
            { id: 'facebook', label: 'Facebook', icon: Share2 },
            { id: 'linkedin', label: 'LinkedIn', icon: Globe },
            { id: 'discord', label: 'Discord', icon: MessageSquare },
          ].map((item) => {
            const isSelected = platform === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlatform(item.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Live Mockup */}
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          
          {/* X / Twitter Preview */}
          {platform === 'x' && (
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black text-white shadow-lg">
              <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-800 relative">
                <img src={imageUrl} alt="Card preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[11px] font-mono text-white/90">
                  {getDomain()}
                </div>
              </div>
              <div className="p-3.5 space-y-1">
                <div className="text-xs font-normal text-slate-400 truncate">{getDomain()}</div>
                <div className="text-sm font-bold leading-snug line-clamp-1">{title}</div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{description}</div>
              </div>
            </div>
          )}

          {/* Facebook Preview */}
          {platform === 'facebook' && (
            <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white">
              <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img src={imageUrl} alt="Card preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 space-y-1 border-t border-slate-200 dark:border-slate-700">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{getDomain()}</div>
                <div className="text-sm font-bold line-clamp-1">{title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{description}</div>
              </div>
            </div>
          )}

          {/* LinkedIn Preview */}
          {platform === 'linkedin' && (
            <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white">
              <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img src={imageUrl} alt="Card preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-3.5 space-y-1 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm font-bold line-clamp-1">{title}</div>
                <div className="text-[11px] text-slate-400 font-medium">{getDomain()} • 1 min read</div>
              </div>
            </div>
          )}

          {/* Discord Preview */}
          {platform === 'discord' && (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-[#2f3136] text-[#dcddde] border-l-4 border-indigo-500 shadow-lg space-y-2">
              <div className="text-xs text-[#b9bbbe] font-medium">{getDomain()}</div>
              <div className="text-sm font-bold text-sky-400 line-clamp-1">{title}</div>
              <div className="text-xs text-[#dcddde] line-clamp-3 leading-relaxed">{description}</div>
              <div className="aspect-[1.91/1] w-full rounded-lg overflow-hidden mt-2 bg-[#202225]">
                <img src={imageUrl} alt="Discord card" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
