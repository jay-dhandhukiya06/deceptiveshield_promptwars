import React from 'react';
import { Shield, Download, ExternalLink, PlayCircle, Flame, PlusCircle, Rocket, Scale } from 'lucide-react';
import { TabMode } from '../types';
import { downloadExtensionZip } from '../utils/extensionZip';

interface HeaderProps {
  currentTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  detectedCount: number;
  communityReportCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  detectedCount,
  communityReportCount = 5
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadExtensionZip();
    } catch (error) {
      console.error('Failed to generate ZIP', error);
      alert('Could not generate ZIP automatically. You can copy the code directly from the Extension Distribution Hub!');
    } finally {
      setDownloading(false);
    }
  };

  const isExtensionActive =
    currentTab === 'extension' ||
    currentTab === 'popup' ||
    currentTab === 'code' ||
    currentTab === 'install';

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 ring-1 ring-white/10">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">DeceptiveShield</h1>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    MANIFEST V3
                  </span>
                  {detectedCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                      {detectedCount} Traps Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">Dark Pattern Defense & Consumer Reporting Portal</p>
              </div>
            </div>
          </div>

          {/* Primary Top Navigation Bar - 4 Clean Primary Tabs */}
          <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
            {/* Tab 1: 🛡️ Live Checkout Interceptor */}
            <button
              type="button"
              onClick={() => onSelectTab('sandbox')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'sandbox'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-blue-300" />
              <span>🛡️ Live Checkout Interceptor</span>
            </button>

            {/* Tab 2: 🏛️ Community Wall of Shame */}
            <button
              type="button"
              onClick={() => onSelectTab('wall')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'wall'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>🏛️ Community Wall of Shame</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-950/80 text-red-300 border border-red-800 font-mono">
                {communityReportCount}
              </span>
            </button>

            {/* Tab 3: 📝 Manual Report Submission */}
            <button
              type="button"
              onClick={() => onSelectTab('submit')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'submit'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-purple-300" />
              <span>📝 Manual Report Submission</span>
            </button>

            {/* Tab 4: 🚀 Extension Distribution Hub */}
            <button
              type="button"
              onClick={() => onSelectTab('extension')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                isExtensionActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-300" />
              <span>🚀 Extension Distribution Hub</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-mono">
                V3
              </span>
            </button>
          </nav>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-2">
            <a
              href="/dummy_checkout.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
              title="Open standalone dummy checkout in a clean tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Tab</span>
            </a>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm shadow-emerald-900/30 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Packing...' : 'Download (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


