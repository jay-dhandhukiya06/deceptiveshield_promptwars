import React, { useState } from 'react';
import { Shield, RefreshCw, AlertTriangle, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { DarkPatternItem } from '../types';

interface PopupSimulatorProps {
  detectedCount: number;
}

export const PopupSimulator: React.FC<PopupSimulatorProps> = ({ detectedCount }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeDomain, setActiveDomain] = useState('nexusgear-audio.shop');
  const [currentStatus, setCurrentStatus] = useState<'ACTIVE' | 'SCANNING'>('ACTIVE');

  // Realistic mock issues detected by extension
  const [issues, setIssues] = useState<DarkPatternItem[]>([
    {
      id: '1',
      type: 'prechecked_addon',
      category: 'Sneak-into-Basket Trap',
      title: 'Pre-selected Add-on Detected',
      snippet: 'Priority Express Dispatch & Accidental Damage Protection (+$4.99)',
      severity: 'high',
      timestamp: 'Just now'
    },
    {
      id: '2',
      type: 'recurring_fee',
      category: 'Hidden Subscription',
      title: 'Deceptive Recurring Fee Detected',
      snippet: 'Renews at $29/month auto-membership VIP Club thereafter. Auto-debit applies.',
      severity: 'high',
      timestamp: 'Just now'
    },
    {
      id: '3',
      type: 'artificial_urgency',
      category: 'Urgency Trap',
      title: 'Artificial Countdown Timer & Scarcity',
      snippet: 'Hurry! Your cart is reserved for 04:59 minutes. Only 2 items left in stock!',
      severity: 'medium',
      timestamp: 'Just now'
    }
  ]);

  const handleManualScan = () => {
    setIsScanning(true);
    setCurrentStatus('SCANNING');
    setTimeout(() => {
      setIsScanning(false);
      setCurrentStatus('ACTIVE');
    }, 700);
  };

  const handleReportIncident = () => {
    const reportText =
      `🛡️ DECEPTIVESHIELD INCIDENT REPORT\n` +
      `--------------------------------------------------\n` +
      `Target URL : https://${activeDomain}/checkout\n` +
      `Page Title : NexusGear Audio - Checkout\n` +
      `Timestamp  : ${new Date().toLocaleString()}\n` +
      `Flagged Issues: ${issues.length}\n` +
      `--------------------------------------------------\n\n` +
      issues.map((it, idx) => `${idx + 1}. [${it.category}] ${it.title}\n   Snippet: "${it.snippet}"`).join('\n\n');

    alert(reportText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Popup Window Frame */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-center mb-4">
            <h2 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Chrome Extension Action Popup Preview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact replica of <code className="text-blue-400 font-mono">popup.html</code> rendered at native 360px viewport
            </p>
          </div>

          {/* Chrome Popup Container Frame */}
          <div className="w-[360px] bg-[#0b1329] border border-[#27365d] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Window Top bar */}
            <div className="bg-[#151f38] px-4 py-2 border-b border-[#27365d] flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Chrome Extension Popup (V3)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">360 × 510px</span>
            </div>

            {/* Content matching popup.html */}
            <div className="p-4 space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#27365d]">
                <div className="flex items-center gap-2.5">
                  <div className="text-2xl filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)]">
                    🛡️
                  </div>
                  <div>
                    <h1 className="text-sm font-bold text-white tracking-tight">DeceptiveShield</h1>
                    <p className="text-[10px] text-[#94a3b8]">Dark Pattern & Checkout Defense</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
                  <span className="text-[9.5px] font-bold tracking-wider text-emerald-400">
                    {currentStatus}
                  </span>
                </div>
              </div>

              {/* Hero Metric Card */}
              <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#27365d] rounded-xl p-3.5 flex items-center justify-between shadow-lg">
                <div>
                  <div className="text-2xl font-extrabold text-red-400 font-mono leading-none">
                    {issues.length}
                  </div>
                  <div className="text-[10.5px] text-[#94a3b8] mt-1">Traps Detected on Tab</div>
                </div>
                <button
                  type="button"
                  onClick={handleManualScan}
                  disabled={isScanning}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg px-3 py-2 text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Scanning...' : 'Run Manual Scan'}</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#151f38] border border-[#27365d] rounded-lg p-2 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">☑️</span>
                    <span className="text-xs font-bold text-white font-mono">1</span>
                  </div>
                  <div className="text-[10px] font-semibold text-white leading-tight">Pre-checked</div>
                  <div className="text-[9px] text-[#64748b]">Add-on trap</div>
                </div>

                <div className="bg-[#151f38] border border-[#27365d] rounded-lg p-2 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">🔄</span>
                    <span className="text-xs font-bold text-white font-mono">1</span>
                  </div>
                  <div className="text-[10px] font-semibold text-white leading-tight">Recurring</div>
                  <div className="text-[9px] text-[#64748b]">Auto-debits</div>
                </div>

                <div className="bg-[#151f38] border border-[#27365d] rounded-lg p-2 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">⏳</span>
                    <span className="text-xs font-bold text-white font-mono">1</span>
                  </div>
                  <div className="text-[10px] font-semibold text-white leading-tight">Urgency</div>
                  <div className="text-[9px] text-[#64748b]">Fake timers</div>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                  <span>Flagged Elements</span>
                  <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    {activeDomain}
                  </span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {issues.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#151f38] border-l-3 border-l-red-500 rounded-md p-2.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{item.title}</span>
                        <span className="text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                          {item.severity}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#94a3b8] italic truncate">
                        "{item.snippet}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-[#27365d] space-y-2">
                <button
                  type="button"
                  onClick={handleReportIncident}
                  className="w-full bg-[#1e293b] hover:bg-[#334155] text-white border border-[#27365d] rounded-lg py-2 text-xs font-semibold transition cursor-pointer"
                >
                  📢 Submit Incident Report
                </button>
                <div className="text-[9.5px] text-[#64748b] text-center">
                  Manifest V3 • DeceptiveShield Engine v1.0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Architectural Explanation & Chrome Extension Internals */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Manifest V3 Extension Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              DeceptiveShield adheres strictly to Google Chrome's Manifest V3 security model, keeping logic sandboxed and performant.
            </p>

            <div className="mt-4 space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-blue-400 mb-1">1. Non-Intrusive Content Script (content.js)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Executes at <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">document_idle</code> on <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">&lt;all_urls&gt;</code>. Scans checkboxes, low-contrast typography, and countdown elements without interfering with host JavaScript or event bubbling.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-emerald-400 mb-1">2. Bi-directional Message Passing (popup.js ↔ content.js)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When the user clicks the browser action icon, <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">popup.js</code> sends a <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">getDetectionStats</code> message to the active tab via <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">chrome.tabs.sendMessage</code> and dynamically re-renders telemetry.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-purple-400 mb-1">3. Shadow DOM / Scoped CSS Insulation</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  All badges and borders use strict namespacing (<code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded font-mono">.deceptiveshield-*</code>) and CSS specificity rules to ensure host checkout themes never deform or obscure the safety warning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
