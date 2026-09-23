import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { scanFiverrMessage, MESSAGE_TEMPLATES } from './fiverrRules';
import { ScanResult, RuleMatch } from '../../types';

const SAMPLE_RISKY_MESSAGES = [
  {
    title: 'Off-platform contact & meeting request',
    text: `Hi John! Thanks for reaching out. Can you send me your WhatsApp number or Skype ID? Let's hop on a Zoom call to discuss your website project. You can also reach me at alex.dev@gmail.com.`
  },
  {
    title: 'Off-platform payment proposal',
    text: `Hello! I can give you a 20% discount if we skip the Fiverr fee and you send me payment directly through PayPal or crypto transfer. Let me know if that works!`
  },
  {
    title: 'Feedback manipulation & credentials',
    text: `I've sent the files! Please give me a 5 stars review and I will give you a free bonus revision. Also please send your admin password here so I can log in.`
  }
];

export const FiverrSafetyChecker: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'editor' | 'templates'>('editor');

  // Automatic live scan with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (message.trim()) {
        const result = scanFiverrMessage(message);
        setScanResult(result);
      } else {
        setScanResult(null);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [message]);

  const handleCopy = () => {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMessage('');
    setScanResult(null);
  };

  const handleApplySuggestion = (match: RuleMatch) => {
    // Replace the specific matched text with the suggested text
    const before = message.slice(0, match.index);
    const after = message.slice(match.index + match.length);
    setMessage(before + match.suggestion + after);
  };

  const handleInsertTemplate = (templateContent: string) => {
    setMessage(templateContent);
    setActiveTab('editor');
  };

  // Generate highlighted text segments
  const renderHighlightedText = () => {
    if (!scanResult || scanResult.matches.length === 0) {
      return (
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>No risky keywords or prohibited contact patterns detected by current rules!</span>
        </div>
      );
    }

    const segments: React.ReactNode[] = [];
    let lastIdx = 0;

    scanResult.matches.forEach((match, i) => {
      if (match.index > lastIdx) {
        segments.push(message.slice(lastIdx, match.index));
      }

      const colorMap = {
        high: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-b-2 border-rose-500 font-medium px-1 rounded-xs',
        medium: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-b-2 border-amber-500 font-medium px-1 rounded-xs',
        low: 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-200 border-b-2 border-sky-500 font-medium px-1 rounded-xs',
        safe: 'bg-emerald-100 text-emerald-900'
      };

      segments.push(
        <mark
          key={`match-${i}`}
          className={`${colorMap[match.riskLevel]} cursor-help relative inline-block`}
          title={`${match.category}: ${match.explanation}`}
        >
          {match.matchedText}
        </mark>
      );

      lastIdx = match.index + match.length;
    });

    if (lastIdx < message.length) {
      segments.push(message.slice(lastIdx));
    }

    return (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
        {segments}
      </div>
    );
  };

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;
  const charCount = message.length;

  return (
    <div className="space-y-8">
      {/* Important Disclaimer Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3.5 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Independent Review Tool Disclaimer:</span> This safety checker is an independent pre-flight utility developed by UtilityHub. It is not affiliated with or verified by Fiverr International Ltd. It checks messages against common known heuristic violation patterns, but cannot guarantee account immunity. Always reference the official <a href="https://www.fiverr.com/legal/community-standards" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100 inline-flex items-center gap-0.5">Fiverr Community Standards <ExternalLink className="w-3 h-3 inline" /></a>.
        </div>
      </div>

      {/* Tabs / Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Message Scanner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Safe Message Templates ({MESSAGE_TEMPLATES.length})
          </button>
        </div>

        {activeTab === 'editor' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!message}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!message}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input Textarea & Sample Message Chips */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Draft Message to Review</span>
                <span className="text-[11px] font-normal text-slate-400">
                  (Type or paste below)
                </span>
              </label>

              {/* Counters */}
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{wordCount}</span> words •{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{charCount}</span> chars
              </div>
            </div>

            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                placeholder="Paste your client communication draft here... (e.g. 'Hi! Can you send me your WhatsApp or Skype so we can jump on a Zoom call to discuss?')"
                className="w-full p-4 text-sm sm:text-base font-sans rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all resize-y shadow-xs"
              />
            </div>

            {/* Starter Examples */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Try Example Risky Messages:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_RISKY_MESSAGES.map((samp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(samp.text)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors text-left"
                  >
                    {samp.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Highlighted text preview */}
            {message && (
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Live Highlighted Preview
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Risk
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Review Needed
                    </span>
                  </div>
                </div>
                {renderHighlightedText()}
              </div>
            )}
          </div>

          {/* Right: Scan Results & Actionable Suggestions */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Status Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Scan Evaluation
                </h3>
                <span className="text-xs text-slate-400">
                  Local engine v2.4
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  {scanResult?.status === 'Review Needed' ? (
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  ) : scanResult?.status === 'Potential Risk' ? (
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Detection Status
                    </div>
                    <div className={`text-base font-bold ${scanResult ? scanResult.statusColor : 'text-slate-400'}`}>
                      {scanResult ? scanResult.status : 'Ready to analyze'}
                    </div>
                  </div>
                </div>

                {scanResult && (
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="font-bold text-rose-600 dark:text-rose-400 text-base">
                        {scanResult.matches.filter(m => m.riskLevel === 'high').length}
                      </div>
                      <div className="text-slate-500">High Risk</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-base">
                        {scanResult.matches.filter(m => m.riskLevel === 'medium').length}
                      </div>
                      <div className="text-slate-500">Medium</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="font-bold text-sky-600 dark:text-sky-400 text-base">
                        {scanResult.matches.filter(m => m.riskLevel === 'low').length}
                      </div>
                      <div className="text-slate-500">Info</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* List of Detected Issues */}
            {scanResult && scanResult.matches.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Detected Policy Traps ({scanResult.matches.length})
                </h4>

                {scanResult.matches.map((match, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {match.category}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        match.riskLevel === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {match.riskLevel} risk
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-400">Flagged phrase:</span>{' '}
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                        "{match.matchedText}"
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {match.explanation}
                    </p>

                    {/* Safer Replacement Suggestion */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-500" />
                          Recommended Safer Alternative
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                        "{match.suggestion}"
                      </p>
                      <button
                        type="button"
                        onClick={() => handleApplySuggestion(match)}
                        className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Replace in message</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : message ? (
              <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Clean Communication!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed max-w-xs mx-auto">
                  No prohibited off-platform words, contact sharing, or review manipulation flags detected. You can safely copy and send this message.
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Message</span>
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-2 text-slate-500 dark:text-slate-400">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-400" />
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Awaiting Input
                </h4>
                <p className="text-xs leading-relaxed max-w-xs mx-auto">
                  Type your client response or select one of the example prompts on the left to start instant inspection.
                </p>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Safe Message Templates Tab */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Battle-Tested Compliant Message Templates
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Crafted to maintain friendly, professional client rapport without triggering automated review flags.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Follow-Up', 'Meetings', 'Deliveries', 'Revisions', 'Safety Protection'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedTemplateCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    selectedTemplateCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MESSAGE_TEMPLATES
              .filter(t => selectedTemplateCategory === 'All' || t.category === selectedTemplateCategory)
              .map((template) => (
                <div
                  key={template.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {template.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        100% Policy Safe
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {template.name}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {template.description}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-sans text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                      {template.content}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleInsertTemplate(template.content)}
                      className="flex-1 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use in Scanner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(template.content);
                        confetti({ particleCount: 30, spread: 50 });
                      }}
                      className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Direct copy to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
};
