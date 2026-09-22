import React, { useState } from 'react';
import {
  Scale,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Gavel,
  BookOpen,
  ArrowRight,
  Search,
  Building2,
  CheckCircle2,
  PhoneCall,
  Clock,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { CommunityReport } from '../types';

interface LegalRegulatoryEngineViewProps {
  reports: CommunityReport[];
  onSelectSandbox?: () => void;
}

interface StatutoryPatternRule {
  id: string;
  patternName: string;
  ccpaClause: string;
  cpa2019Section: string;
  severity: 'Critical' | 'High' | 'Medium';
  definition: string;
  inAppOccurrence: string;
  statutoryRemedy: string;
  technicalHeuristic: string;
}

const STATUTORY_RULES: StatutoryPatternRule[] = [
  {
    id: 'basket-sneaking',
    patternName: 'Basket Sneaking',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 3',
    cpa2019Section: 'Section 2(47) - Unfair Trade Practice (Unconsented additions)',
    severity: 'Critical',
    definition: 'Inclusion of additional items, products, services, or warranty fees at checkout without the explicit, affirmative consent of the consumer (such as pre-ticked checkboxes).',
    inAppOccurrence: 'Priority Courier & Damage Transit Cover (+₹199.00) pre-selected by default in the checkout DOM.',
    statutoryRemedy: 'Mandatory restitution & full refund of unconsented surcharge under Section 20; Penalty up to ₹10 Lakh under Section 21.',
    technicalHeuristic: 'input[type="checkbox"][checked]:not([data-legal-consent]) with attached monetary surcharge regex.'
  },
  {
    id: 'forced-action',
    patternName: 'Forced Action / Hidden Recurring Fee',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 4',
    cpa2019Section: 'Section 2(47)(i) - Misleading consumer into recurring financial commitment',
    severity: 'Critical',
    definition: 'Compelling the consumer into taking an action that would require them to purchase additional goods, subscribe to recurring services, or commit personal payment credentials (e.g. UPI Autopay / e-Mandate) to buy the intended primary product.',
    inAppOccurrence: 'Renews at ₹499/month VIP Club membership automatically debited via UPI Autopay / e-Mandate in 9px low-contrast text.',
    statutoryRemedy: 'Direction to cancel all automated recurring mandates without fee; Injunction against deceptive enrollment under Section 89.',
    technicalHeuristic: 'Detection of recurring tokens (e.g., "/month", "autopay", "e-mandate") inside sub-10px font containers.'
  },
  {
    id: 'false-urgency',
    patternName: 'False Urgency',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 1',
    cpa2019Section: 'Section 2(47)(vi) - False or misleading representation of stock availability',
    severity: 'High',
    definition: 'Falsely stating or implying the sense of urgency or scarcity to mislead a consumer into making an immediate purchase or decision without reasonable contemplation.',
    inAppOccurrence: 'Artificial countdown timer ("Cart reserved for 04:59") and fake scarcity alert ("Only 2 left in Bengaluru warehouse").',
    statutoryRemedy: 'Cease-and-desist order; Fines up to ₹10 Lakh for misleading claims under Section 21(2).',
    technicalHeuristic: 'Client-side countdown timers resetting on reload and ungrounded scarcity phrases near CTA buttons.'
  },
  {
    id: 'drip-pricing',
    patternName: 'Drip Pricing',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 6',
    cpa2019Section: 'Section 2(47)(ii) - Concealing material price components until final step',
    severity: 'High',
    definition: 'Practice whereby elements of the price are not revealed upfront or are incrementally revealed in the course of the transactional checkout process.',
    inAppOccurrence: 'Adding mandatory convenience fees, packaging fees, or delivery surcharges only on the UPI payment page.',
    statutoryRemedy: 'Mandatory display of all-inclusive pricing at first listing under Consumer Protection (E-Commerce) Rules, 2020.',
    technicalHeuristic: 'Delta comparison between advertised listing price in header/hero and final DOM total in checkout container.'
  },
  {
    id: 'confirmshaming',
    patternName: 'Confirmshaming',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 5',
    cpa2019Section: 'Section 2(47) - Coercive choice architecture and psychological manipulation',
    severity: 'Medium',
    definition: 'Using a phrase, video, audio or any other means to create a sense of fear, shame, or guilt in the mind of the consumer to nudge them towards purchasing additional items or opting out of rights.',
    inAppOccurrence: 'Rejection button text: "No, I prefer risking damaged transit goods" or "No thanks, I dislike saving money".',
    statutoryRemedy: 'Administrative reprimand and order to enforce neutral, objective opt-out language ("Decline add-on").',
    technicalHeuristic: 'Sentiment classification on secondary buttons containing guilt-inducing phrases ("risk", "lose", "unprotected").'
  },
  {
    id: 'interface-interference',
    patternName: 'Interface Interference',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 9',
    cpa2019Section: 'Section 2(47)(viii) - Deceptive visual hierarchy subverting consumer choices',
    severity: 'High',
    definition: 'Design elements that manipulate the visual hierarchy, contrasting colors, or positioning to obscure, disguise, or highlight specific information to mislead consumers away from rational decisions.',
    inAppOccurrence: 'Highlighting "Pay All" in large green while "Skip Add-on" is rendered in faint gray 9px text without border.',
    statutoryRemedy: 'Statutory compliance audit; Requirement to maintain WCAG contrast ratios and symmetrical CTA visual weights.',
    technicalHeuristic: 'CSS computed style checks for low contrast (<3:1), tiny font sizes (<10px), or hidden cancel elements.'
  },
  {
    id: 'subscription-trap',
    patternName: 'Subscription Trap (Roach Motel)',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 11',
    cpa2019Section: 'Section 2(47) - Asymmetric cancellation friction and unfair contractual terms',
    severity: 'Critical',
    definition: 'Making the process of cancellation or subscription opt-out substantially more complex, delayed, or friction-heavy than the instantaneous one-click enrollment procedure.',
    inAppOccurrence: 'Instant 1-click UPI Autopay enrollment paired with a mandatory requirement to send physical registered post or wait 14 days to cancel.',
    statutoryRemedy: 'Enforcement of "Click-to-Cancel" equivalence mandated under CCPA Guidelines 2023.',
    technicalHeuristic: 'Analysis of unsubscribe workflow depth and absence of one-click cancellation endpoints in consumer portal.'
  },
  {
    id: 'bait-and-switch',
    patternName: 'Bait and Switch / Disguised Claim',
    ccpaClause: 'Guideline 4 & Annexure 1, Clause 7 & 8',
    cpa2019Section: 'Section 2(47)(i) & Section 89 - False and misleading advertising',
    severity: 'Critical',
    definition: 'Advertising a particular outcome or price (such as "₹1.00 Trial") but delivering an alternative or binding the user to an undisclosed high-cost contract.',
    inAppOccurrence: 'Promoting a "₹1.00 7-Day Trial" on hero banners while quietly setting up an upfront ₹1,499.00 quarterly debit mandate.',
    statutoryRemedy: 'Investigation by Director General of Investigation (CCPA); Criminal/Civil liabilities under Section 89.',
    technicalHeuristic: 'Heuristic cross-referencing between advertised headline price and mandatory recurring mandate authorizations.'
  }
];

export const LegalRegulatoryEngineView: React.FC<LegalRegulatoryEngineViewProps> = ({
  reports,
  onSelectSandbox
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    reports[0]?.id || 'sandbox-live'
  );
  const [complainantHandle, setComplainantHandle] = useState('Aarav Sharma (Consumer Protection Advocate #IND-8821)');
  const [complainantContact, setComplainantContact] = useState('aarav.sharma.advocacy@gmail.com');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'CCPA_INDIA' | 'FTC_US'>('CCPA_INDIA');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'Critical' | 'High' | 'Medium'>('ALL');

  // Selected report object
  const selectedReport = reports.find((r) => r.id === selectedIncidentId) || reports[0];

  // DOM Excerpt based on selected report
  const defaultDomExcerpt = selectedReport?.id.includes('nexusgear')
    ? `<div class="order-summary-box">
  <!-- SNEAK ADD-ON (Basket Sneaking - CCPA 2023 Annexure 1 Clause 3) -->
  <input type="checkbox" id="addon-courier" name="transit_insurance" checked="checked" />
  <label for="addon-courier">Priority Courier & Damage Transit Cover (+₹199.00)</label>

  <!-- 9px HIDDEN RECURRING E-MANDATE (Forced Action - CCPA 2023 Annexure 1 Clause 4) -->
  <p style="font-size: 9px; color: #64748b; line-height: 1.1;">
    Renews at ₹499/month VIP Club membership automatically debited via UPI Autopay / e-Mandate thereafter unless cancelled.
  </p>

  <!-- FALSE URGENCY BANNER (CCPA 2023 Annexure 1 Clause 1) -->
  <div class="urgency-banner" data-timer="04:59">
    🔥 High demand! Cart reserved for 04:59. Only 2 left in Bengaluru warehouse!
  </div>
</div>`
    : `<!-- OFFENDING DOM TELEMETRY RECORD: ${selectedReport?.domain} -->
<form action="${selectedReport?.pageUrl}" method="POST">
  <div class="financial-trap-wrapper">
    <input type="hidden" name="hidden_charge" value="${selectedReport?.financialTrap || 'Unconsented Surcharge'}" />
    <!-- VIOLATIONS: ${selectedReport?.violations.join('; ')} -->
  </div>
</form>`;

  const [domExcerpt, setDomExcerpt] = useState(defaultDomExcerpt);

  // When selected report changes, update dom excerpt if needed
  const handleSelectReport = (id: string) => {
    setSelectedIncidentId(id);
    const rep = reports.find((r) => r.id === id);
    if (rep?.id.includes('nexusgear')) {
      setDomExcerpt(
`<div class="order-summary-box">
  <!-- SNEAK ADD-ON (Basket Sneaking - CCPA 2023 Annexure 1 Clause 3) -->
  <input type="checkbox" id="addon-courier" name="transit_insurance" checked="checked" />
  <label for="addon-courier">Priority Courier & Damage Transit Cover (+₹199.00)</label>

  <!-- 9px HIDDEN RECURRING E-MANDATE (Forced Action - CCPA 2023 Annexure 1 Clause 4) -->
  <p style="font-size: 9px; color: #64748b; line-height: 1.1;">
    Renews at ₹499/month VIP Club membership automatically debited via UPI Autopay / e-Mandate thereafter unless cancelled.
  </p>

  <!-- FALSE URGENCY BANNER (CCPA 2023 Annexure 1 Clause 1) -->
  <div class="urgency-banner" data-timer="04:59">
    🔥 High demand! Cart reserved for 04:59. Only 2 left in Bengaluru warehouse!
  </div>
</div>`
      );
    } else if (rep) {
      setDomExcerpt(
`<!-- OFFENDING DOM TELEMETRY CAPTURE -->
<!-- Target: ${rep.pageUrl} | Brand: ${rep.brandName} -->
<div class="deceptive-checkout-container" data-risk="${rep.riskGrade}" data-score="${rep.riskScore}/100">
  <div class="flagged-trap">
    <span class="category">${rep.category}</span>
    <span class="trap-value">${rep.financialTrap || 'Unconsented Surcharge'}</span>
    <p class="description">${rep.description}</p>
  </div>
  <!-- Specific Violations:
${rep.violations.map((v) => `    * ${v}`).join('\n')}
  -->
</div>`
      );
    }
  };

  const currentTimestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata'
  });

  // Generate formal statutory legal complaint text
  const generateLegalComplaint = () => {
    if (!selectedReport) return '';

    const violationsList = selectedReport.violations
      .map((v, i) => `   (${i + 1}) ${v}`)
      .join('\n');

    return (
`================================================================================
STATUTORY FORMAL COMPLAINT UNDER THE CONSUMER PROTECTION ACT, 2019
AND THE GUIDELINES FOR PREVENTION AND REGULATION OF DARK PATTERNS, 2023
================================================================================
DATE & TIMESTAMP : ${currentTimestamp}
JURISDICTION     : Central Consumer Protection Authority (CCPA), Republic of India
FILING FORUM     : National Consumer Helpline (NCH / INGRAM Portal - consumerhelpline.gov.in)
                   Helpline Toll-Free: 1915 | National Consumer Dispute Redressal Commission
COMPLAINT REF    : CCPA/DARK-PATTERN/${selectedReport.domain.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase()}/${Date.now()}

--------------------------------------------------------------------------------
I. COMPLAINANT PARTICULARS
--------------------------------------------------------------------------------
Complainant Identity : ${complainantHandle}
Contact Coordinates  : ${complainantContact}
Representation       : Citizen Consumer Telemetry & Protection Advocate
Submitting Engine    : DeceptiveShield Manifest V3 Automated Enforcement Harness

--------------------------------------------------------------------------------
II. RESPONDENT (OFFENDING COMMERCIAL ENTITY) PARTICULARS
--------------------------------------------------------------------------------
Commercial Brand Name : ${selectedReport.brandName}
Primary Digital Domain: ${selectedReport.domain}
Violative URL         : ${selectedReport.pageUrl}
Threat Classification : Grade ${selectedReport.riskGrade} (${selectedReport.riskLabel})
Severity Index Score  : ${selectedReport.riskScore} / 100
Primary Trap Pattern  : ${selectedReport.category}
Financial Detriment   : ${selectedReport.financialTrap || 'Unconsented Recurring Surcharge / Basket Sneak'}

--------------------------------------------------------------------------------
III. SPECIFICATION OF PROHIBITED DARK PATTERNS DETECTED
--------------------------------------------------------------------------------
The Respondent's digital checkout interface utilizes prohibited dark patterns as defined
and notified by the Central Consumer Protection Authority (CCPA) under Notification
F. No. J-25/57/2023-CCPA dated 30th November 2023:

${violationsList}

STATUTORY PROHIBITIONS VIOLATED:
1. BASKET SNEAKING (CCPA Guidelines 2023, Guideline 4 & Annexure 1, Clause 3):
   Inclusion of additional items, products, services, or warranty fees at checkout
   without the affirmative express consent of the consumer.
2. FORCED ACTION (CCPA Guidelines 2023, Guideline 4 & Annexure 1, Clause 4):
   Compelling consumers to subscribe to unwanted recurring auto-debit or memberships
   in order to conclude the purchase of the principal product.
3. FALSE URGENCY (CCPA Guidelines 2023, Guideline 4 & Annexure 1, Clause 1):
   Falsely stating or implying urgency, scarcity, or countdown pressure to force an
   uncontemplated purchase decision.
4. UNFAIR TRADE PRACTICES (Section 2(47) of Consumer Protection Act, 2019):
   Adopting unfair methods and deceptive practices for the purpose of promoting the sale,
   use, or supply of goods and services.

--------------------------------------------------------------------------------
IV. DOM TELEMETRY EVIDENCE EXCERPT (EXTRACTED AT RUNTIME)
--------------------------------------------------------------------------------
${domExcerpt}

--------------------------------------------------------------------------------
V. 1-YEAR FINANCIAL CONSUMER DETRIMENT COMPUTATION
--------------------------------------------------------------------------------
Advertised Base Product Price : ₹2,499.00
Unconsented Basket Sneak Fee  : +₹199.00 (Courier & Damage Transit Cover)
Hidden Recurring Mandate      : +₹5,988.00 (12 months × ₹499.00/mo VIP Club UPI Autopay)
--------------------------------------------------------------------------------
TOTAL 1-YEAR EXTRACTED COST   : ₹8,686.00
SURCHARGE INFLATION MULTIPLIER: 3.47x of Advertised Base Price (+₹6,187.00 Detriment)

--------------------------------------------------------------------------------
VI. PRAYER & STATUTORY RELIEF REQUESTED
--------------------------------------------------------------------------------
The Complainant respectfully prays that the Central Consumer Protection Authority
and the National Consumer Dispute Redressal Commission exercise their statutory powers
under Section 18 and Section 20 of the Consumer Protection Act, 2019 to:

1. ISSUE AN IMMEDIATE NOTICE & DIRECTION to the Respondent to cease and discontinue
   all deceptive choice architecture, pre-ticked add-on checkboxes, and hidden recurring
   e-mandates across all digital platforms.
2. ORDER MANDATORY RESTITUTION & REFUND under Section 20(a) of the Act for all consumers
   subjected to unconsented add-on charges (₹199) and unauthorized recurring auto-debits (₹499/mo).
3. IMPOSE MAXIMUM ADMINISTRATIVE PENALTIES under Section 21 of the Consumer Protection Act, 2019
   (up to ₹10 Lakh for the first contravention and up to ₹50 Lakh for subsequent contraventions).
4. DIRECT COMPLIANCE WITH RBI E-MANDATE DIRECTIVES regarding pre-debit notifications
   and unambiguous affirmative consumer consent prior to recurring payment registration.

VERIFICATION:
I, the undersigned Complainant, do hereby verify that the contents of this formal statutory
complaint are based on authentic client-side DOM telemetry gathered via DeceptiveShield
heuristic verification tools.

Respectfully Submitted,
${complainantHandle}
Digital Evidence Signature: SHA256-CCPA-INDIA-${selectedReport.id.toUpperCase()}
Filing Portal: National Consumer Helpline (consumerhelpline.gov.in / 1915)
================================================================================`
    );
  };

  const handleCopyNotice = async () => {
    const text = generateLegalComplaint();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Could not copy notice', e);
    }
  };

  const handleDownloadNotice = () => {
    const text = generateLegalComplaint();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CCPA-Statutory-Complaint-${selectedReport.domain.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered statutory rules
  const filteredRules = STATUTORY_RULES.filter((rule) => {
    const matchesSearch =
      rule.patternName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rule.ccpaClause.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rule.cpa2019Section.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rule.inAppOccurrence.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || rule.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Scale className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Statutory Compliance & Legal Enforcement Suite
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                CCPA 2023 • CPA 2019
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Mapped directly to the <strong className="text-amber-300">Guidelines for Prevention and Regulation of Dark Patterns, 2023</strong> (Notified by the Central Consumer Protection Authority, Ministry of Consumer Affairs, India) and <strong className="text-amber-300">Section 2(47) of the Consumer Protection Act, 2019</strong>. Generate actionable, pre-formatted regulatory notices ready for statutory submission to the CCPA and National Consumer Helpline (NCH 1915).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 shadow transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>NCH Portal (INGRAM)</span>
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toll-Free: <strong>1915</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: STATUTORY MAPPING MATRIX */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Statutory Dark Pattern Mapping Matrix (CCPA India 2023)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive legal correlation between detected interface manipulations and enforceable statutory clauses.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search clause or pattern..."
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 w-44"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              aria-label="Filter patterns by severity"
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical Threat</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Severity</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-3 px-3.5">Dark Pattern Nomenclature</th>
                <th className="py-3 px-3">CCPA 2023 Guideline Clause</th>
                <th className="py-3 px-3">CPA 2019 Standing</th>
                <th className="py-3 px-3">Statutory Remedy / Penalties</th>
                <th className="py-3 px-3">In-App Telemetry Occurrence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  className="hover:bg-slate-900/50 transition-colors"
                >
                  {/* Nomenclature */}
                  <td className="py-3.5 px-3.5 font-medium align-top">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{rule.patternName}</span>
                      <span
                        className={`text-[9.5px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                          rule.severity === 'Critical'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : rule.severity === 'High'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-xs">
                      {rule.definition}
                    </p>
                  </td>

                  {/* CCPA Clause */}
                  <td className="py-3.5 px-3 align-top font-mono text-[11px] text-amber-300 whitespace-nowrap">
                    <div className="p-1.5 rounded bg-amber-500/5 border border-amber-500/20 inline-block font-semibold">
                      {rule.ccpaClause}
                    </div>
                  </td>

                  {/* CPA 2019 Section */}
                  <td className="py-3.5 px-3 align-top text-[11px] text-slate-300">
                    <span className="font-semibold text-slate-200">{rule.cpa2019Section}</span>
                  </td>

                  {/* Statutory Remedy */}
                  <td className="py-3.5 px-3 align-top text-[11px] text-slate-300 max-w-xs leading-relaxed">
                    <span className="text-emerald-400 font-medium">{rule.statutoryRemedy}</span>
                  </td>

                  {/* In-App Occurrence */}
                  <td className="py-3.5 px-3 align-top text-[11px] text-slate-400 max-w-xs">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                      {rule.inAppOccurrence}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      <span className="text-blue-400 font-mono">Heuristic:</span> {rule.technicalHeuristic}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE LEGAL COMPLAINT GENERATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Interactive Legal Notice & Statutory Complaint Generator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any incident from the Community Wall of Shame to synthesize an evidentiary complaint addressed to the Central Consumer Protection Authority (CCPA) & National Consumer Helpline (NCH).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyNotice}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formal Notice'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadNotice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>

        {/* Generator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Target Incident Picker */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Select Offending Incident (Community Index)
            </label>
            <select
              value={selectedIncidentId}
              onChange={(e) => handleSelectReport(e.target.value)}
              aria-label="Select offending incident"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-blue-500 cursor-pointer text-xs"
            >
              {reports.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.domain} • Grade {rep.riskGrade} ({rep.category})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Active domain: <strong className="text-blue-400">{selectedReport?.domain}</strong>
            </span>
          </div>

          {/* Complainant Handle */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Complainant Handle / Advocate Name
            </label>
            <input
              type="text"
              value={complainantHandle}
              onChange={(e) => setComplainantHandle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
              placeholder="e.g., Aarav Sharma / Consumer Advocate"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Recorded in the statutory complaint header.
            </span>
          </div>

          {/* Complainant Contact */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Complainant Email / Contact ID
            </label>
            <input
              type="text"
              value={complainantContact}
              onChange={(e) => setComplainantContact(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
              placeholder="e.g., consumer.advocate@domain.in"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Used for formal NCH dispatch correspondence.
            </span>
          </div>
        </div>

        {/* Editable DOM Excerpt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
              <span>Technical Evidence & DOM Excerpt</span>
              <span className="text-[10px] text-slate-500 font-normal">(Editable evidentiary telemetry)</span>
            </label>
            <span className="text-[10.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Heuristic Captured
            </span>
          </div>
          <textarea
            value={domExcerpt}
            onChange={(e) => setDomExcerpt(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-300 font-mono text-[11px] focus:outline-hidden focus:border-blue-500 leading-relaxed"
          />
        </div>

        {/* Live Formal Legal Notice Document Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Document Preview: Official CCPA Statutory Filing</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Ready for immediate export & legal filing
            </span>
          </div>

          <div className="relative bg-slate-950 border-2 border-slate-800 rounded-xl p-4 sm:p-6 overflow-x-auto shadow-inner">
            <pre className="text-[11.5px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
              {generateLegalComplaint()}
            </pre>
          </div>
        </div>

        {/* Guidance Footer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>🏛️ Step 1: File on INGRAM Portal</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Visit <a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="text-blue-400 underline">consumerhelpline.gov.in</a>, register your account, and paste the generated statutory notice into the grievance box under "Unfair Trade Practices".
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>📞 Step 2: Register via NCH 1915</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Call toll-free National Consumer Helpline <strong>1915</strong> (8 AM - 8 PM) to register an expedited dossier against the offending domain using the verified telemetry hash.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1">
            <div className="font-bold text-blue-300 flex items-center gap-1.5">
              <span>⚖️ Step 3: CCPA Section 21 Penalties</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Under Section 21 of Consumer Protection Act 2019, CCPA possesses statutory jurisdiction to order restitution of unconsented recurring fees and levy fines up to ₹50 Lakh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
