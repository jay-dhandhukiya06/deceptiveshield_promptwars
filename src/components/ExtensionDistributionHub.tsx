import React, { useState } from 'react';
import {
  Download,
  Chrome,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Code2,
  Eye,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { PopupSimulator } from './PopupSimulator';
import { CodeExplorer } from './CodeExplorer';
import { EXTENSION_FILES } from '../data/extensionFiles';
import { downloadExtensionZip } from '../utils/extensionZip';

interface ExtensionDistributionHubProps {
  detectedCount: number;
  onNavigateToSandbox?: () => void;
  defaultSubTab?: 'install' | 'popup' | 'code';
}

export const ExtensionDistributionHub: React.FC<ExtensionDistributionHubProps> = ({
  detectedCount,
  onNavigateToSandbox,
  defaultSubTab = 'install'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'install' | 'popup' | 'code'>(defaultSubTab);
  const [downloading, setDownloading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadExtensionZip();
    } catch (err) {
      console.error('Download failed', err);
      alert('Could not generate ZIP automatically. You can copy the code directly from the Source Code Inspector tab!');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyChromeUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('chrome://extensions').then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0d1630] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Laptop className="w-3.5 h-3.5" />
              <span>Client Extension Distribution Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              DeceptiveShield Client Suite
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Download, inspect, and deploy the client-side browser extension. Inspect all Manifest V3 production source files, test the live toolbar popup, or install directly into Google Chrome.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Manifest V3 Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> Zero External Dependencies
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <Sparkles className="w-3 h-3 text-amber-400" /> Real-time Heuristic DOM Scanner
              </span>
            </div>
          </div>

          {/* High-Visibility Download Action & Version Badge */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Version 1.0.0 (Manifest V3)</span>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-900/40 transition cursor-pointer border border-emerald-400/20 w-full sm:w-auto"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Packaging Extension ZIP...' : 'Download Ready-to-Install ZIP'}</span>
            </button>

            <div className="text-[11px] text-slate-500 font-medium text-right w-full">
              Includes unpacked Chrome directory with icons & manifest
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Section Tabbed Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
          {/* Sub-View A Tab */}
          <button
            type="button"
            onClick={() => setActiveSubTab('install')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'install'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <Chrome className="w-4 h-4" />
            <span className="truncate">Step-by-Step Installation</span>
          </button>

          {/* Sub-View B Tab */}
          <button
            type="button"
            onClick={() => setActiveSubTab('popup')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'popup'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="truncate">Interactive Popup Simulator</span>
          </button>

          {/* Sub-View C Tab */}
          <button
            type="button"
            onClick={() => setActiveSubTab('code')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === 'code'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="truncate">Source Code Inspector</span>
          </button>
        </div>

        {/* Quick Reference Note */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pr-2">
          <span className="font-mono text-[11px] text-slate-500">6 files indexed</span>
          <span className="text-slate-700">•</span>
          <a
            href="/dummy_checkout.html"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition"
          >
            <span>Open Standalone Test Checkout</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 3. Sub-Section Contents */}

      {/* Sub-View A: Step-by-Step Installation */}
      {activeSubTab === 'install' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <Chrome className="w-5 h-5 text-blue-400" />
              How to Load DeceptiveShield Unpacked into Google Chrome
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Follow this 4-step checklist to load the Manifest V3 client extension unpacked into your local Chrome browser in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 1 of 4</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Download or Extract the Extension Folder</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Click the download button above to get the full archive. Extract the ZIP into a clean folder on your computer named <code className="text-blue-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">deceptiveshield/</code>.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="text-slate-300 font-semibold text-[11.5px]">Included root files:</div>
                  <div className="font-mono text-slate-400 text-[10.5px]">
                    manifest.json, content.js, content.css, popup.html, popup.js, icons/
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{downloading ? 'Downloading...' : 'Download Archive (.ZIP)'}</span>
              </button>
            </div>

            {/* Step 2 Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 2 of 4</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Open Chrome Extensions & Enable Developer Mode</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    In Google Chrome, navigate to the extension manager URL or access via <em>Settings &gt; Extensions</em>.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                  <span className="font-mono text-blue-400 font-bold">chrome://extensions</span>
                  <button
                    type="button"
                    onClick={handleCopyChromeUrl}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <p className="text-slate-400 text-xs">
                  In the top-right corner of the Extensions page, switch the toggle for <strong>"Developer mode"</strong> to <strong>ON</strong>.
                </p>
              </div>

              <div className="p-2.5 bg-blue-950/20 border border-blue-500/20 rounded-xl text-[11px] text-blue-300">
                💡 Developer Mode enables the <strong>"Load unpacked"</strong> capability required for custom security extensions.
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 3 of 4</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Click "Load unpacked" & Select Folder</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Click the <strong>Load unpacked</strong> button on the top-left toolbar of <code className="text-blue-400">chrome://extensions</code>.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-300 font-semibold">Folder Selection:</div>
                  <p className="text-slate-400 text-[11.5px]">
                    Select the root <code className="text-emerald-400 font-mono">deceptiveshield/</code> folder (the directory containing <code className="text-slate-300">manifest.json</code>).
                  </p>
                </div>
              </div>

              <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5 p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>The DeceptiveShield shield icon will immediately appear in your Chrome toolbar!</span>
              </div>
            </div>

            {/* Step 4 Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Step 4 of 4</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Pin to Toolbar & Test Against Checkout Traps</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Click the puzzle piece icon in Chrome's toolbar and pin <strong>DeceptiveShield</strong> for instant one-click access.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="text-slate-300 font-semibold">Immediate Verification:</div>
                  <p className="text-slate-400 text-[11.5px]">
                    Open our included dummy checkout or any online shop. Watch the shield automatically intercept pre-checked checkouts, drip fees, and auto-recurring subscriptions!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/dummy_checkout.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Test Checkout Tab</span>
                </a>
                {onNavigateToSandbox && (
                  <button
                    type="button"
                    onClick={onNavigateToSandbox}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    <span>View Sandbox</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-View B: Interactive Popup Simulator */}
      {activeSubTab === 'popup' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Live Toolbar Popup Window Simulator (360px)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This interactive sandbox renders the exact 360-pixel HTML5/CSS3 extension popup window that end-users see when clicking the extension icon in Chrome.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 360px Browser Frame Mockup */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full max-w-[420px] bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl">
                {/* Browser Toolbar Mockup */}
                <div className="bg-slate-950 rounded-2xl p-2.5 border border-slate-800/80 mb-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 truncate max-w-[200px]">
                    <span className="text-emerald-400">🔒</span>
                    <span>nexusgear-audio.shop/checkout</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                      🛡️
                    </div>
                  </div>
                </div>

                {/* Live 360px Popup Embed */}
                <div className="w-full flex justify-center">
                  <div className="w-[360px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <PopupSimulator detectedCount={detectedCount} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Specifications & Features */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Popup Technical Features</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Fixed 360px Dimension:</strong> Matches Chrome's recommended extension popup width constraint with native responsive scroll.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Active Tab Telemetry:</strong> Automatically communicates with background scripts via <code className="text-blue-400">chrome.tabs.query</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Instant Manual Rescan:</strong> Dispatches DOM query events to highlight new deceptive elements without reloading the page.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>One-Click Evidence Clipboard:</strong> Packages detected traps and URL metadata for reporting directly into the Wall of Shame.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                <h3 className="font-bold text-white text-sm">Ready to Deploy?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Both <code className="text-slate-300">popup.html</code> and <code className="text-slate-300">popup.js</code> are fully bundled into the downloadable ZIP package.
                </p>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloading ? 'Packing...' : 'Download Complete Extension (.ZIP)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-View C: Source Code Inspector */}
      {activeSubTab === 'code' && (
        <div className="space-y-6">
          <CodeExplorer isEmbedded={true} />
        </div>
      )}
    </div>
  );
};
