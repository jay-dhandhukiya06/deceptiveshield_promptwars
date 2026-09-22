import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Clock, RefreshCw, CheckCircle2, Info, Eye, Sliders, ShieldAlert, ArrowRight, Scale, Zap, RotateCcw, TrendingUp } from 'lucide-react';
import { DarkPatternItem, CommunityReport } from '../types';
import { ReportModal } from './ReportModal';

interface SandboxViewProps {
  onStatsChange?: (count: number) => void;
  onPublishReport?: (report: CommunityReport) => void;
  onNavigateToWall?: () => void;
  onNavigateToLegal?: () => void;
}

export const SandboxView: React.FC<SandboxViewProps> = ({
  onStatsChange,
  onPublishReport,
  onNavigateToWall,
  onNavigateToLegal
}) => {
  // Interactive sandbox state for the deceptive checkout
  const [addonChecked, setAddonChecked] = useState(true);
  const [showRecurringFee, setShowRecurringFee] = useState(true);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);
  const [agreeTermsChecked, setAgreeTermsChecked] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(299);
  const [scanTimestamp, setScanTimestamp] = useState<string>(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState<'preview' | 'inspector'>('preview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Compute detected issues based on current state
  const detectedIssues: DarkPatternItem[] = [];

  if (addonChecked) {
    detectedIssues.push({
      id: 'addon-1',
      type: 'prechecked_addon',
      category: 'Basket Sneaking',
      title: 'Pre-selected Add-on Detected (Basket Sneaking)',
      snippet: 'Priority Courier & Damage Transit Cover (+₹199.00)',
      severity: 'high',
      timestamp: scanTimestamp
    });
  }

  if (showRecurringFee) {
    detectedIssues.push({
      id: 'recurring-1',
      type: 'recurring_fee',
      category: 'Forced Action / Hidden Subscription',
      title: 'Deceptive Recurring Fee Detected (UPI Autopay)',
      snippet: 'Renews at ₹499/month VIP Club membership automatically debited via UPI Autopay / e-Mandate thereafter unless cancelled.',
      severity: 'high',
      timestamp: scanTimestamp
    });
  }

  if (showUrgencyBanner) {
    detectedIssues.push({
      id: 'urgency-1',
      type: 'artificial_urgency',
      category: 'False Urgency Trap',
      title: 'Artificial Countdown Timer & Scarcity',
      snippet: `Hurry! Cart is reserved for ${formatTimer(timerSeconds)}. High demand: Only 2 left in stock!`,
      severity: 'medium',
      timestamp: scanTimestamp
    });
  }

  // Update parent with count
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange(detectedIssues.length);
    }
  }, [detectedIssues.length, onStatsChange]);

  const handleReportFAB = () => {
    setIsReportModalOpen(true);
  };

  const handleConfirmPublish = (report: CommunityReport) => {
    if (onPublishReport) {
      onPublishReport(report);
    }
    setToastNotification(`Report successfully published to the Wall of Shame! (Indexed ${report.domain})`);
  };

  const handleManualScan = () => {
    setScanTimestamp(new Date().toLocaleTimeString());
  };

  // True Cost 1-Year Financial Impact calculations
  const baseCost = 2499.0;
  const courierAddonCost = addonChecked ? 199.0 : 0.0;
  const recurringMonthlyCost = showRecurringFee ? 499.0 : 0.0;
  const recurringAnnualCost = recurringMonthlyCost * 12; // ₹5,988.00
  const actualOneYearTrueCost = baseCost + courierAddonCost + recurringAnnualCost; // ₹8,686.00
  const surchargeMultiplier = (actualOneYearTrueCost / baseCost).toFixed(2);
  const trapsActive = addonChecked || showRecurringFee;

  const handleNeutralizeTraps = () => {
    setAddonChecked(false);
    setShowRecurringFee(false);
    setToastNotification(
      '🛡️ Deceptive Traps Neutralized! Priority courier removed & VIP recurring e-mandate dismissed. Total reverted to base ₹2,499.00.'
    );
  };

  const handleResetSimulationTraps = () => {
    setAddonChecked(true);
    setShowRecurringFee(true);
    setShowUrgencyBanner(true);
    setToastNotification('Simulation traps re-enabled for testing.');
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Sandbox Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Interactive Testbed & Detection Engine Harness
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulating <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded font-mono">content.js</code> scanning <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded font-mono">dummy_checkout.html</code> live. Toggle patterns below to observe real-time DOM interception.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleManualScan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Trigger Manual Scan
            </button>
            <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Active Flags: <span className="font-bold text-red-400">{detectedIssues.length}</span>
            </div>
          </div>
        </div>

        {/* Live DOM Injection Switches */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
            <input
              type="checkbox"
              checked={addonChecked}
              onChange={(e) => setAddonChecked(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="font-semibold text-slate-200">Pre-Checked ₹199 Add-On</div>
              <div className="text-[11px] text-slate-400">Basket Sneaking (CCPA 2023)</div>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
            <input
              type="checkbox"
              checked={showRecurringFee}
              onChange={(e) => setShowRecurringFee(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="font-semibold text-slate-200">9px UPI Autopay Fine Print</div>
              <div className="text-[11px] text-slate-400">Renews at ₹499/mo e-Mandate</div>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
            <input
              type="checkbox"
              checked={showUrgencyBanner}
              onChange={(e) => setShowUrgencyBanner(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="font-semibold text-slate-200">Fake Urgency & Timer</div>
              <div className="text-[11px] text-slate-400">False Urgency (CCPA 2023)</div>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
            <input
              type="checkbox"
              checked={agreeTermsChecked}
              onChange={(e) => setAgreeTermsChecked(e.target.checked)}
              className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="font-semibold text-slate-200">Terms of Service Box</div>
              <div className="text-[11px] text-emerald-400 font-medium">Safely ignored (Legal check)</div>
            </div>
          </label>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left / Center: Interactive Checkout Page */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative min-h-[640px]">
            {/* Browser chrome header bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2 font-mono text-[11px] text-slate-600 w-80 max-w-full justify-center shadow-xs">
                <span className="text-emerald-600 font-bold">https://</span>nexusgear-india.in/checkout
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                SSL Secured • India
              </div>
            </div>

            {/* Embedded Page Content */}
            <div className="p-5 sm:p-6 bg-slate-50 min-h-[580px]">
              {/* Trap 1: Urgency Banner (Flagged with .deceptiveshield-flagged-urgency) */}
              {showUrgencyBanner && (
                <div className="mb-5 rounded-lg border-2 border-orange-500 bg-orange-50/90 p-3.5 text-orange-950 flex flex-wrap items-center justify-between gap-2 shadow-xs transition-all animate-fadeIn">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-orange-800 bg-orange-200 px-2 py-0.5 rounded">
                      ⚠️ False Urgency Pattern
                    </span>
                    <span>🔥 High demand! Cart reserved for</span>
                    <span className="bg-orange-700 text-white px-2 py-0.5 rounded font-mono font-bold text-xs tracking-wider">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                  <div className="text-xs text-orange-800 font-semibold">
                    Items temporarily held
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left: Customer Info */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                      📦 Delivery Details
                    </h3>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1 font-medium">Recipient</label>
                        <input
                          type="text"
                          readOnly
                          value="Aarav Sharma"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1 font-medium">Address</label>
                        <input
                          type="text"
                          readOnly
                          value="Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka 560103"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                      💳 Payment Options
                    </h3>
                    <div className="space-y-2 text-xs">
                      {/* UPI Option */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-300 flex items-center justify-between text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                          <span className="font-bold text-slate-900">UPI</span>
                          <span className="text-[11px] text-slate-600">(Google Pay / PhonePe / Paytm)</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">aarav@okhdfcbank</span>
                      </div>

                      {/* Cards Option */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                          <span className="font-semibold text-slate-800">Debit / Credit Card</span>
                          <span className="text-[11px] text-slate-500">(RuPay / Visa / Mastercard)</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">•••• 4892</span>
                      </div>

                      {/* Net Banking Option */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                          <span className="font-semibold text-slate-800">Net Banking</span>
                          <span className="text-[11px] text-slate-500">(HDFC / SBI / ICICI / Axis)</span>
                        </div>
                        <span className="text-[11px] text-slate-400">All Indian Banks</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary with Sneaky Add-ons */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <h3 className="font-bold text-sm text-slate-800 mb-3">🛒 Order Summary</h3>

                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        🎧
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">boAt Rockerz Wireless Headphones</div>
                        <div className="text-[11px] text-slate-500">Active Noise Cancellation • Carbon Black</div>
                        {showUrgencyBanner && (
                          <div className="text-[10px] text-orange-600 font-bold mt-0.5">
                            ⚠️ Only 2 items left in Bengaluru warehouse!
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900">₹2,499.00</div>
                    </div>

                    {/* Sneaky Add-on Checkbox (Basket Sneaking - CCPA 2023) */}
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 relative">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={addonChecked}
                          onChange={(e) => setAddonChecked(e.target.checked)}
                          className={`mt-0.5 w-4 h-4 cursor-pointer transition-all ${
                            addonChecked
                              ? 'ring-2 ring-red-500 ring-offset-1 border-red-600 accent-red-600'
                              : 'accent-blue-600'
                          }`}
                        />
                        <div className="flex-1 text-xs">
                          <span className="font-semibold text-slate-900">
                            Priority Courier & Damage Transit Cover
                          </span>{' '}
                          <span className="text-blue-600 font-bold">(+₹199.00)</span>

                          {/* Injected Warning Badge */}
                          {addonChecked && (
                            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-50 border border-red-300 border-l-4 border-l-red-600 text-red-900 font-bold text-[10.5px] shadow-xs">
                              ⚠️ CCPA Violation: Basket Sneaking Detected
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Deceptive 9px recurring text (Forced Action / Hidden Subscription) */}
                      {showRecurringFee && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200">
                          <div className="p-1.5 rounded bg-red-50/90 border border-dashed border-red-400">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-700 bg-red-200 px-1.5 py-0.5 rounded mr-1.5">
                              ⚠️ Forced Action / e-Mandate
                            </span>
                            <span className="text-[9px] text-slate-500 leading-tight">
                              Renews at ₹499/month VIP Club membership automatically debited via UPI Autopay / e-Mandate thereafter unless cancelled.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span>₹2,499.00</span>
                      </div>
                      {addonChecked && (
                        <div className="flex justify-between text-red-600 font-medium">
                          <span>Priority Courier & Cover (Pre-ticked)</span>
                          <span>+₹199.00</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                        <span>Total Due</span>
                        <span className="font-mono text-slate-950">
                          ₹{addonChecked ? '2,698.00' : '2,499.00'}
                        </span>
                      </div>
                    </div>

                    {/* Non-Deceptive Legal Terms (Intentionally NOT flagged) */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <label className="flex items-start gap-2 text-[11px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTermsChecked}
                          onChange={(e) => setAgreeTermsChecked(e.target.checked)}
                          className="mt-0.5 accent-blue-600 rounded w-3.5 h-3.5"
                        />
                        <span>
                          I agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
                        </span>
                      </label>
                      <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                        ✓ DeceptiveShield Precision: Legal consent is verified and excluded.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Payment processed via UPI: ₹${addonChecked ? '2,698.00' : '2,499.00'}`)}
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                    >
                      Pay via UPI • ₹{addonChecked ? '2,698.00' : '2,499.00'}
                    </button>
                  </div>

                  {/* 🛡️ DeceptiveShield True Cost Radar */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border-2 border-red-500/40 shadow-xl space-y-3.5 relative overflow-hidden">
                    {/* Ambient corner glow when traps active */}
                    {trapsActive && (
                      <div className="absolute -top-12 -right-12 w-28 h-28 bg-red-600/10 rounded-full blur-xl pointer-events-none" />
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🛡️</span>
                        <h4 className="font-bold text-xs text-white tracking-tight">
                          DeceptiveShield True Cost Radar
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-mono">
                        1-Year Projection
                      </span>
                    </div>

                    {/* Metric Badge: Hidden Surcharge Multiplier */}
                    <div>
                      {trapsActive ? (
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                          <div className="flex items-center gap-1.5 text-xs text-red-300 font-bold">
                            <TrendingUp className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span>Hidden Surcharge Multiplier:</span>
                          </div>
                          <span className="text-xs font-black text-red-400 font-mono bg-red-950/80 px-2 py-0.5 rounded border border-red-800 animate-pulse">
                            {surchargeMultiplier}x Advertised Price
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Hidden Surcharge Multiplier:</span>
                          </div>
                          <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            1.00x Advertised Price (Clean)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Side-by-side Financial Breakdown */}
                    <div className="space-y-2 text-xs divide-y divide-slate-800/80 pt-1">
                      <div className="flex justify-between items-center text-slate-300 pt-1">
                        <span className="text-slate-400">Advertised Base Cost:</span>
                        <span className="font-mono font-semibold text-slate-100">₹2,499.00</span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-400">Sneak Add-on (Courier):</span>
                        <span className={`font-mono font-semibold ${addonChecked ? 'text-red-400' : 'text-slate-500'}`}>
                          {addonChecked ? '+₹199.00' : '+₹0.00 (Declined)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-400">1-Year Hidden Recurring Impact (12 × ₹499 VIP Auto-Debit):</span>
                        <span className={`font-mono font-semibold ${showRecurringFee ? 'text-red-400' : 'text-slate-500'}`}>
                          {showRecurringFee ? '+₹5,988.00' : '+₹0.00 (Dismissed)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-700/80">
                        <span className="font-bold text-slate-200">ACTUAL 1-YEAR TRUE COST:</span>
                        <span className={`font-mono text-sm sm:text-base font-extrabold ${trapsActive ? 'text-red-500 font-black' : 'text-emerald-400 font-bold'}`}>
                          ₹{actualOneYearTrueCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Button: Neutralize Traps (One-Click Auto-Opt-Out) */}
                    <div className="pt-2 space-y-2">
                      {trapsActive ? (
                        <button
                          type="button"
                          onClick={handleNeutralizeTraps}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                          <span>Neutralize Traps (One-Click Auto-Opt-Out)</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-2 bg-emerald-950/70 border border-emerald-500/40 rounded-xl p-2.5">
                          <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Traps Neutralized • Checkout at ₹2,499.00</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleResetSimulationTraps}
                            className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-1"
                            title="Re-enable deceptive traps to test again"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Re-test</span>
                          </button>
                        </div>
                      )}

                      {/* Navigation link to Legal Engine */}
                      {onNavigateToLegal && (
                        <button
                          type="button"
                          onClick={onNavigateToLegal}
                          className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 py-1.5 px-2.5 rounded-lg font-semibold transition cursor-pointer"
                        >
                          <Scale className="w-3 h-3 text-amber-400" />
                          <span>Inspect CCPA Statutory Violations & Export Notice →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INJECTED FLOATING ACTION BUTTON (FAB) */}
            <div className="absolute bottom-5 right-5 z-30">
              <button
                type="button"
                onClick={handleReportFAB}
                className="group flex items-center gap-2 bg-gradient-to-br from-slate-900 to-slate-950 text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 hover:border-slate-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="DeceptiveShield Floating Action Button (FAB)"
              >
                <span className="text-base">🛡️</span>
                <span className="text-xs font-bold tracking-tight">Report Dark Pattern</span>
                {detectedIssues.length > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-extrabold bg-red-600 text-white rounded-full border border-white animate-pulse">
                    {detectedIssues.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Security Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Detection Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-2 my-4">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-bold text-red-400 font-mono">
                  {addonChecked ? 1 : 0}
                </div>
                <div className="text-[10px] text-slate-400">Add-ons</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {showRecurringFee ? 1 : 0}
                </div>
                <div className="text-[10px] text-slate-400">Recurring</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-bold text-orange-400 font-mono">
                  {showUrgencyBanner ? 1 : 0}
                </div>
                <div className="text-[10px] text-slate-400">Urgency</div>
              </div>
            </div>

            {/* Flagged Elements List */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Flagged Patterns</span>
                <span className="text-slate-500">DOM Hooks</span>
              </div>

              {detectedIssues.length === 0 ? (
                <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-300">Clean Checkout State</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    No deceptive dark patterns detected in this DOM snapshot.
                  </p>
                </div>
              ) : (
                detectedIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        {issue.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                        {issue.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 italic bg-slate-900/50 p-1.5 rounded border border-slate-800/50 font-mono text-[10.5px]">
                      "{issue.snippet}"
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Category: {issue.category}</span>
                      <span>{issue.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Negative Match Precision Verification */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-[11px]">
                    Heuristic Precision Safety
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-0.5 leading-relaxed">
                    Mandatory Terms of Service and Privacy Policy checkboxes are safely whitelisted to prevent false positives and maintain consumer checkout flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Success Toast when reported */}
      {toastNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 text-xs text-white animate-bounce-subtle">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
          {onNavigateToWall && (
            <button
              onClick={() => {
                setToastNotification(null);
                onNavigateToWall();
              }}
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition cursor-pointer"
            >
              <span>View Wall of Shame</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Step 2 Connected Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        detectedIssues={detectedIssues}
        addonChecked={addonChecked}
        showRecurringFee={showRecurringFee}
        showUrgencyBanner={showUrgencyBanner}
        timerString={formatTimer(timerSeconds)}
        onConfirmPublish={handleConfirmPublish}
      />
    </div>
  );
};

