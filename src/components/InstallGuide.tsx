import React from 'react';
import { Download, Chrome, CheckCircle2, AlertTriangle, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';

export const InstallGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <Chrome className="w-5 h-5 text-blue-400" />
          How to Load DeceptiveShield Unpacked into Google Chrome
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Follow this 4-step deployment checklist to load the Manifest V3 extension unpacked into your local Chrome browser in under 60 seconds.
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
            1
          </div>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-white text-sm">Download or Create the Extension Folder</h3>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Click the green <strong>"Download (.ZIP)"</strong> button in the top navigation header. Extract the archive into a folder on your computer named <code className="text-blue-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">deceptiveshield/</code>.
            </p>
            <div className="mt-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              Ensure your folder contains: <code className="text-slate-200">manifest.json</code>, <code className="text-slate-200">content.js</code>, <code className="text-slate-200">content.css</code>, <code className="text-slate-200">popup.html</code>, <code className="text-slate-200">popup.js</code>, and the <code className="text-slate-200">icons/</code> directory.
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
            2
          </div>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-white text-sm">Open Chrome Extensions & Toggle Developer Mode</h3>
            <p className="text-slate-400 mt-1 leading-relaxed">
              In Google Chrome, enter <code className="text-blue-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">chrome://extensions</code> in your address bar (or go to <em>Settings &gt; Extensions</em>).
            </p>
            <p className="text-slate-400 mt-1">
              In the top right corner of the Extensions page, toggle <strong>Developer mode</strong> to <strong>ON</strong>.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
            3
          </div>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-white text-sm">Click "Load unpacked"</h3>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Click the <strong>Load unpacked</strong> button that appears in the top-left toolbar. Select the <code className="text-blue-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">deceptiveshield/</code> directory you extracted in Step 1.
            </p>
            <div className="mt-2 text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>DeceptiveShield will immediately appear in your extension list with Manifest V3 active!</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
            4
          </div>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-white text-sm">Test on dummy_checkout.html</h3>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Drag & drop <code className="text-blue-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">dummy_checkout.html</code> directly into a Chrome tab, or open{' '}
              <a
                href="/dummy_checkout.html"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline font-semibold"
              >
                /dummy_checkout.html
              </a>
              .
            </p>
            <p className="text-slate-400 mt-1 leading-relaxed">
              You will instantly see:
            </p>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-300">
              <li>The red outline + "⚠️ Warning: Pre-selected Add-on Detected" on the $4.99 checkbox.</li>
              <li>The "⚠️ Hidden Recurring Fee" warning on the low-contrast 9px auto-renew text.</li>
              <li>The "⚠️ Pressure Pattern" outline on the artificial countdown timer.</li>
              <li>The floating action button <code className="text-slate-200">🛡️ Report Dark Pattern</code> at bottom-right.</li>
              <li>Click the extension icon in your Chrome toolbar to open the live popup stats!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
