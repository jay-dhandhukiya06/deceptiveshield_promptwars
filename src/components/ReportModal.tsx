import React, { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle2, Camera, Upload, ArrowRight, Eye } from 'lucide-react';
import { CommunityReport, DarkPatternItem } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedIssues: DarkPatternItem[];
  addonChecked: boolean;
  showRecurringFee: boolean;
  showUrgencyBanner: boolean;
  timerString: string;
  onConfirmPublish: (report: CommunityReport) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  detectedIssues,
  addonChecked,
  showRecurringFee,
  showUrgencyBanner,
  timerString,
  onConfirmPublish
}) => {
  if (!isOpen) return null;

  const [reporterName, setReporterName] = useState('ShieldPatrol_IN');
  const [userNotes, setUserNotes] = useState(
    'Captured deceptive checkout on NexusGear India. Pre-checked ₹199 courier transit cover add-on with buried ₹499/mo VIP membership auto-debited via UPI Autopay / e-Mandate in 9px low-contrast text.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Compute violation tags from active issues
  const violationsList: string[] = [];
  if (addonChecked) {
    violationsList.push('Basket Sneaking: ₹199.00 pre-selected courier & damage cover');
  }
  if (showRecurringFee) {
    violationsList.push('Forced Action: 9px fine print ₹499/mo UPI Autopay / e-Mandate auto-debit');
  }
  if (showUrgencyBanner) {
    violationsList.push('False Urgency: Artificial 04:59 countdown timer & scarcity banner');
  }
  if (violationsList.length === 0) {
    violationsList.push('Deceptive UI Architecture (CCPA 2023 Violation)');
  }

  const handlePublish = () => {
    setIsSubmitting(true);

    const newReport: CommunityReport = {
      id: 'report-' + Date.now().toString(36),
      domain: 'nexusgear-india.in',
      pageUrl: 'https://nexusgear-india.in/checkout',
      pageTitle: 'NexusGear India • Secure Checkout',
      brandName: 'NexusGear Consumer Electronics India',
      riskGrade: violationsList.length >= 2 ? 'F' : 'D',
      riskScore: Math.min(98, 65 + violationsList.length * 12),
      riskLabel: violationsList.length >= 2 ? 'Critical Threat' : 'High Risk',
      category: addonChecked ? 'Basket Sneaking' : showRecurringFee ? 'Forced Action' : 'False Urgency',
      violations: violationsList,
      description: userNotes,
      financialTrap: addonChecked && showRecurringFee ? '+₹199 upfront + ₹499/mo UPI Autopay e-Mandate' : addonChecked ? '+₹199 unwanted charge' : '₹499/mo recurring',
      votes: 1,
      userVote: 1,
      reportedAt: 'Just now',
      reportedBy: reporterName.trim() || 'Anonymous Consumer',
      status: 'verified',
      regulatoryClause: 'Guidelines for Prevention and Regulation of Dark Patterns, 2023 under Consumer Protection Act, 2019 (CCPA, India)'
    };

    setTimeout(() => {
      onConfirmPublish(newReport);
      setIsSubmitting(false);
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Submit Incident Report for nexusgear-india.in
              </h2>
              <p className="text-xs text-slate-400">
                Session telemetry pre-captured by DeceptiveShield Heuristic Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Target Metadata Bar */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Offender Domain</span>
              <span className="font-mono text-red-400 font-bold text-xs">nexusgear-india.in</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Risk Rating</span>
              <span className="inline-flex items-center gap-1 font-bold text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Grade F • Critical Threat
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Regulatory Authority</span>
              <span className="text-emerald-400 font-mono text-[11px]">CCPA India (Act 2019)</span>
            </div>
          </div>

          {/* Auto-Captured Screenshot Preview Card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                Auto-Captured Checkout Evidence Snapshot
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Captured at: {new Date().toLocaleTimeString()}
              </span>
            </div>

            {/* Visual simulated snapshot card */}
            <div className="bg-white text-slate-900 rounded-xl border-2 border-red-500/60 p-3.5 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2.5 text-[11px]">
                <span className="font-bold text-slate-800">🛒 NexusGear India - Checkout Review</span>
                <span className="font-mono text-[10px] text-slate-500">https://nexusgear-india.in/checkout</span>
              </div>

              {/* Snapshot Traps highlight */}
              <div className="space-y-2 text-[11px]">
                {showUrgencyBanner && (
                  <div className="p-1.5 bg-orange-50 border border-orange-400 rounded text-orange-900 flex items-center justify-between font-medium">
                    <span>🔥 High demand! Cart reserved for {timerString}</span>
                    <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      FLAGGED: FALSE URGENCY
                    </span>
                  </div>
                )}

                <div className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">boAt Rockerz Wireless Headphones</span>
                    <div className="text-[10px] text-slate-500">Qty: 1 • Carbon Black • Deliver to Bengaluru</div>
                  </div>
                  <span className="font-bold">₹2,499.00</span>
                </div>

                {addonChecked && (
                  <div className="p-2 bg-red-50 border-2 border-red-500 rounded relative">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-950 flex items-center gap-1">
                        ☑️ Priority Courier & Transit Cover (Pre-ticked)
                      </span>
                      <span className="font-bold text-red-600">+₹199.00</span>
                    </div>
                    {showRecurringFee && (
                      <div className="text-[9px] text-red-700 bg-red-100/80 p-1 rounded mt-1 border border-red-300">
                        ⚠️ 9px Fine Print: Renews at ₹499/month VIP Club membership auto-debited via UPI Autopay / e-Mandate.
                      </div>
                    )}
                    <span className="absolute -top-2 right-2 text-[8.5px] font-black uppercase bg-red-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                      FLAGGED: BASKET SNEAKING
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-[11px] font-bold">
                <span>Total Charge</span>
                <span className="text-red-600 font-mono">₹{addonChecked ? '2,698.00' : '2,499.00'}</span>
              </div>
            </div>
          </div>

          {/* Captured Violations List */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-2">
              Captured Dark Pattern Violations ({violationsList.length})
            </label>
            <div className="space-y-1.5">
              {violationsList.map((violation, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-red-500/30 rounded-lg p-2.5 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {violation}
                  </span>
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded uppercase">
                    Auto-Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Submitter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-slate-400 font-medium text-[11px] mb-1">
                Your Community Handle
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-medium focus:border-blue-500 focus:outline-hidden"
                placeholder="e.g. ConsumerPatrol"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium text-[11px] mb-1">
                Incident Description & Context
              </label>
              <textarea
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:border-blue-500 focus:outline-hidden resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Indexed on public Community Wall of Shame for consumer protection.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || publishSuccess}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition cursor-pointer disabled:opacity-60"
            >
              {publishSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Posted to Community Index!</span>
                </>
              ) : isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Confirm & Post to Community Index</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
