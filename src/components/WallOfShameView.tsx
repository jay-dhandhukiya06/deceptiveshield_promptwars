import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Flame,
  Clock,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Eye,
  Sparkles,
  Trash2,
  RotateCcw,
  X,
  Trash
} from 'lucide-react';
import { CommunityReport } from '../types';
import { RegulatoryComplaintModal } from './RegulatoryComplaintModal';

interface WallOfShameViewProps {
  reports: CommunityReport[];
  onVote: (reportId: string, direction: 1 | -1) => void;
  onDeleteReport: (reportId: string) => void;
  onClearAll: () => void;
  onResetDefaults?: () => void;
  onOpenSubmit: () => void;
}

export const WallOfShameView: React.FC<WallOfShameViewProps> = ({
  reports,
  onVote,
  onDeleteReport,
  onClearAll,
  onResetDefaults,
  onOpenSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'risk'>('votes');
  const [complaintReport, setComplaintReport] = useState<CommunityReport | null>(null);
  const [reportToDelete, setReportToDelete] = useState<CommunityReport | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // Statistics calculation - dynamic based on active crowdsourced records
  const isPurged = reports.length === 0;
  const totalReportsCount = reports.length;
  const darkPatternsNeutralized = isPurged ? 0 : reports.length * 2;
  const estimatedSavings = isPurged ? '₹0' : `₹${(reports.length * 31).toLocaleString()}K`;
  const mostReportedDomain = isPurged ? 'None / Cleared' : (reports[0]?.domain || 'None');

  // Filtered and sorted reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        const matchesSearch =
          report.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.violations.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat =
          selectedCategory === 'all' ||
          report.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          report.violations.some((v) => v.toLowerCase().includes(selectedCategory.toLowerCase()));

        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'votes') {
          return b.votes - a.votes;
        }
        if (sortBy === 'risk') {
          return b.riskScore - a.riskScore;
        }
        // default newest
        return 0;
      });
  }, [reports, searchQuery, selectedCategory, sortBy]);

  // Color helper for risk grades
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'F':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'D':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'C':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Telemetry Statistics */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0b1329] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Crowdsourced Dark Pattern Defense Index</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Community Wall of Shame
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              A decentralized, consumer-verified directory indexing deceptive checkout funnels, sneak-into-basket add-ons, and hidden recurring fees across the web.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSubmit}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-red-600/25 transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit Deceptive Site Link</span>
            </button>
          </div>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold">Total Reports Filed</span>
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono mt-2">
              {totalReportsCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isPurged ? '0 active records' : 'Verified by community heuristics'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold">Patterns Neutralized</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
              {isPurged ? '0 Traps' : `${darkPatternsNeutralized} Traps`}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">
              {isPurged ? '0 deceptive traps active' : 'Sites flagged for consumer protection'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold">Most Reported Offender</span>
              <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                <Flame className="w-4 h-4" />
              </span>
            </div>
            <div className="text-sm font-bold text-red-400 font-mono mt-2 truncate">
              {mostReportedDomain}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isPurged ? 'Clean index • No pending offenders' : `${reports[0]?.votes || 0} upvotes • Grade ${reports[0]?.riskGrade || 'F'} Critical`}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold">Est. Consumer Savings</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-2">
              {estimatedSavings}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isPurged ? 'Zero unverified charges' : 'Prevented accidental recurring charges'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Search, and Global Reset Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain, violation, or brand..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 transition"
          />
        </div>

        {/* Filter categories & Global Reset */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Traps
            </button>
            <button
              onClick={() => setSelectedCategory('Basket')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                selectedCategory === 'Basket'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Basket Sneaking
            </button>
            <button
              onClick={() => setSelectedCategory('Forced')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                selectedCategory === 'Forced'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Forced Action
            </button>
            <button
              onClick={() => setSelectedCategory('Drip')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                selectedCategory === 'Drip'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Drip Pricing
            </button>
            <button
              onClick={() => setSelectedCategory('Urgency')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                selectedCategory === 'Urgency'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              False Urgency
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 font-medium text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="votes" className="bg-slate-900">Most Upvoted</option>
              <option value="risk" className="bg-slate-900">Highest Risk</option>
              <option value="newest" className="bg-slate-900">Newest Reports</option>
            </select>
          </div>

          {/* Global Reset / Clear All Action */}
          <button
            type="button"
            onClick={() => setShowClearAllModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 active:bg-red-950 text-red-400 hover:text-red-300 text-xs font-bold transition cursor-pointer shadow-xs whitespace-nowrap"
            title="Clear all crowdsourced records from index"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>⚠️ Reset / Clear All Records</span>
          </button>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-5">
        {reports.length === 0 ? (
          /* Clean Placeholder State When Index is Cleared / Empty */
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">
              No dark patterns currently listed. All reported sites resolved or cleared.
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              The community dark pattern database is currently clean and reset (0 Reports, 0 Traps). You can file a new incident report or restore default sample records for testing.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenSubmit}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer inline-flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Submit New Report</span>
              </button>
              {onResetDefaults && (
                <button
                  onClick={onResetDefaults}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>Restore Default Sample Records</span>
                </button>
              )}
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Reports Matched Filters</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No reported domains currently match your search query. Try broadening your keywords or report a new deceptive layout.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          filteredReports.map((report) => {
            const hasUpvoted = report.userVote === 1;
            const hasDownvoted = report.userVote === -1;

            return (
              <div
                key={report.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Reddit-style Vote Column + Details */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Reddit-style Upvote/Downvote Counter */}
                    <div className="flex flex-col items-center bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0 select-none">
                      <button
                        type="button"
                        onClick={() => onVote(report.id, 1)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          hasUpvoted
                            ? 'bg-red-500/20 text-red-400 scale-110'
                            : 'text-slate-400 hover:text-red-400 hover:bg-slate-900'
                        }`}
                        title="Upvote verified violation report"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>

                      <span
                        className={`font-mono text-xs font-black my-1 transition-colors ${
                          hasUpvoted
                            ? 'text-red-400'
                            : hasDownvoted
                            ? 'text-blue-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {report.votes}
                      </span>

                      <button
                        type="button"
                        onClick={() => onVote(report.id, -1)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          hasDownvoted
                            ? 'bg-blue-500/20 text-blue-400 scale-110'
                            : 'text-slate-400 hover:text-blue-400 hover:bg-slate-900'
                        }`}
                        title="Downvote report"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Report Information */}
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Domain & Risk Badge Header */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-base font-extrabold text-white font-mono tracking-tight flex items-center gap-2 truncate">
                          {report.domain}
                          <a
                            href={report.pageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 hover:text-slate-300 transition"
                            title="Visit reported page url"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </h2>

                        {/* Risk Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getGradeBadge(
                            report.riskGrade
                          )}`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            Grade {report.riskGrade} • {report.riskLabel}
                          </span>
                        </span>

                        <span className="text-[10px] text-slate-500 font-mono">
                          Score: {report.riskScore}/100
                        </span>
                      </div>

                      <div className="text-xs text-slate-400">
                        Entity: <span className="font-semibold text-slate-300">{report.brandName}</span> • Reported by{' '}
                        <span className="text-slate-300 font-medium">{report.reportedBy}</span> ({report.reportedAt})
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {report.description}
                      </p>

                      {/* Financial Trap Tag */}
                      {report.financialTrap && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs">
                          <DollarSign className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="text-slate-300">Unsolicited Cost Surcharge:</span>
                          <span className="font-bold text-red-400 font-mono">
                            {report.financialTrap}
                          </span>
                        </div>
                      )}

                      {/* Verified Violations Badges */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Verified Traps Flagged:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {report.violations.map((violation, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-950 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-lg"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                              {violation}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Visual Evidence Snapshot Mockup & Action Buttons */}
                  <div className="lg:w-80 space-y-3 shrink-0">
                    {/* Visual Layout Snapshot Mockup */}
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-md">
                      <div className="bg-slate-900/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-blue-400" /> Evidence Capture
                        </span>
                        <span className="font-mono text-slate-500">Heuristic Match</span>
                      </div>

                      {/* Custom uploaded image or styled visual layout card */}
                      {report.customImageData ? (
                        <div className="p-2 bg-slate-950">
                          <img
                            src={report.customImageData}
                            alt={`Evidence for ${report.domain}`}
                            className="w-full h-36 object-cover rounded-lg border border-slate-800"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-white text-slate-900 text-[10.5px] space-y-1.5 font-sans select-none">
                          <div className="flex justify-between border-b border-slate-200 pb-1 text-slate-700 font-semibold">
                            <span>{report.brandName.substring(0, 22)}</span>
                            <span className="text-red-600 font-mono font-bold">CHECKOUT</span>
                          </div>

                          <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                            <span>Base Item</span>
                            <span className="font-bold">₹2,499.00</span>
                          </div>

                          {/* Flagged Item */}
                          <div className="p-1.5 bg-red-50 border border-red-400 rounded relative text-red-950 font-medium">
                            <div className="flex justify-between">
                              <span>☑️ Transit Cover / Auto-VIP</span>
                              <span className="font-bold text-red-600 font-mono">+₹199 / ₹499 mo</span>
                            </div>
                            <div className="text-[8.5px] text-slate-500 mt-0.5 italic">
                              Renews automatically via UPI Autopay / e-Mandate.
                            </div>
                            <span className="absolute -top-1.5 -right-1 bg-red-600 text-white text-[7.5px] font-black px-1 rounded uppercase tracking-wider">
                              TRAP
                            </span>
                          </div>

                          <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-[11px]">
                            <span>Cart Total</span>
                            <span className="text-red-600 font-mono">₹2,698.00</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Export Legal Complaint & Delete Record */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setComplaintReport(report)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-amber-400" />
                        <span>Export Legal Complaint</span>
                      </button>

                      {/* Individual Card Deletion Button */}
                      <button
                        type="button"
                        onClick={() => setReportToDelete(report)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 active:bg-red-950 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs cursor-pointer"
                        title="Delete this record from the community registry"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>🗑️ Delete Record</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Individual Card Deletion */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-base text-white">Delete Incident Report</h3>
              </div>
              <button
                onClick={() => setReportToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                Are you sure you want to remove this report from the community registry?
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <div className="font-mono font-bold text-white flex items-center justify-between">
                  <span>{reportToDelete.domain}</span>
                  <span className="text-red-400 font-semibold">Grade {reportToDelete.riskGrade}</span>
                </div>
                <div className="text-slate-400 truncate">{reportToDelete.brandName}</div>
                <div className="text-slate-500 text-[11px] pt-1">
                  Violation: {reportToDelete.category}
                </div>
              </div>

              <p className="text-xs text-slate-400">
                This will remove the record dynamically from the community feed and decrement the "Total Reports Filed" header metric by 1.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteReport(reportToDelete.id);
                  setReportToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Global Reset / Clear All Records */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-base text-white">Reset & Clear Registry</h3>
              </div>
              <button
                onClick={() => setShowClearAllModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                Clear all crowdsourced records? This will purge the index back to empty or default state.
              </p>

              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-300 space-y-1">
                <div className="font-bold">Effect of clearing all records:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11.5px]">
                  <li>All {reports.length} indexed incident reports will be purged.</li>
                  <li>Telemetry metrics will update to zero (0 Reports, 0 Traps).</li>
                  <li>Wall of Shame will display clean placeholder state.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              {onResetDefaults && (
                <button
                  type="button"
                  onClick={() => {
                    onResetDefaults();
                    setShowClearAllModal(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset to Default Samples</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearAllModal(false);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge All Records (0)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Complaint Modal */}
      <RegulatoryComplaintModal
        report={complaintReport}
        onClose={() => setComplaintReport(null)}
      />
    </div>
  );
};
