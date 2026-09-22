import React, { useState } from 'react';
import { X, Copy, Check, ShieldAlert, FileText, ExternalLink, Scale } from 'lucide-react';
import { CommunityReport } from '../types';

interface RegulatoryComplaintModalProps {
  report: CommunityReport | null;
  onClose: () => void;
}

export const RegulatoryComplaintModal: React.FC<RegulatoryComplaintModalProps> = ({
  report,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [jurisdiction, setJurisdiction] = useState<'CCPA_INDIA' | 'FTC' | 'CPPA_US'>('CCPA_INDIA');

  if (!report) return null;

  // Generate formal complaint template text
  const generateComplaintText = () => {
    const timestamp = new Date().toLocaleString();
    const violationsBullet = report.violations.map((v, i) => `   (${i + 1}) ${v}`).join('\n');

    if (jurisdiction === 'CCPA_INDIA') {
      return (
`FORMAL CONSUMER COMPLAINT UNDER THE CONSUMER PROTECTION ACT, 2019
TO: Central Consumer Protection Authority (CCPA), Department of Consumer Affairs, Government of India
PORTAL: National Consumer Helpline (NCH - consumerhelpline.gov.in / INGRAM)
SUBJECT: Violation of Guidelines for Prevention and Regulation of Dark Patterns, 2023 (F. No. J-25/57/2023-CCPA)

I. RESPONDENT / OFFENDING COMMERCIAL ENTITY:
   Brand / Company Name : ${report.brandName}
   Offending Domain     : ${report.domain}
   Target URL           : ${report.pageUrl}
   Dark Pattern Threat  : Grade ${report.riskGrade} (${report.riskLabel} - Severity Score: ${report.riskScore}/100)
   Evidence Source      : DeceptiveShield Heuristic Engine Verification

II. SPECIFICATION OF PROHIBITED DARK PATTERNS DETECTED:
   The respondent's digital checkout interface utilizes prohibited dark patterns defined under
   Annexure 1 of the Guidelines for Prevention and Regulation of Dark Patterns, 2023:

${violationsBullet}

III. FACTUAL CONSUMER DETRIMENT:
   Summary: "${report.description}"
   Financial Trap / Disguised Levy : ${report.financialTrap || 'Unconsented add-on or e-Mandate auto-debit'}
   Incident Verification Timestamp  : ${timestamp}

IV. STATUTORY BREACHES CHARGED:
   1. Basket Sneaking (Guideline 4 & Annexure 1, Clause 3): Inclusion of pre-ticked add-on items/services without affirmative user click.
   2. Forced Action (Annexure 1, Clause 4): Compelling users into recurring payments or disguised e-mandates.
   3. False Urgency (Annexure 1, Clause 1): Falsely stating or implying urgency/scarcity to mislead consumers into making immediate purchases.
   4. Section 2(47) Consumer Protection Act, 2019: Unfair trade practices and misleading representations.

V. PRAYER / RELIEF REQUESTED:
   1. Issue statutory notice to Respondent directing immediate discontinuation of deceptive dark pattern checkout interfaces.
   2. Require respondent to refund unconsented add-on charges (₹) collected through pre-ticked checkboxes and unauthorized recurring e-mandates.
   3. Impose administrative penalties under Section 21 of the Consumer Protection Act, 2019.

Submitted via DeceptiveShield Consumer Telemetry Network
Evidence Signature: SHA256-INDIA-CCPA-${report.id.toUpperCase()}`
      );
    }

    if (jurisdiction === 'FTC') {
      return (
`FORMAL REGULATORY CONSUMER COMPLAINT
TO: Federal Trade Commission (FTC) Bureau of Consumer Protection
RE: Deceptive Dark Patterns & Unfair Trade Practices Investigation
STATUTORY AUTHORITY: Section 5 of the Federal Trade Commission Act (15 U.S.C. § 45(a))
                      Restore Online Shoppers' Confidence Act (ROSCA, 15 U.S.C. § 8401)
                      FTC Statement on Deceptive Dark Patterns (October 2021)

I. RESPONDENT / OFFENDING ENTITY:
   Business Name   : ${report.brandName}
   Target Domain   : ${report.domain}
   Target URL      : ${report.pageUrl}
   Risk Assessment : Grade ${report.riskGrade} (${report.riskLabel} - Score: ${report.riskScore}/100)
   Evidence Source : Verified by DeceptiveShield Heuristic Telemetry

II. NATURE OF UNFAIR & DECEPTIVE DESIGN PRACTICES:
   The respondent implements asymmetric, deceptive choice architecture ("dark patterns")
   designed to subvert consumer autonomy and extract unauthorized financial commitments:

${violationsBullet}

III. FACTUAL SUMMARY & DETRIMENT:
   "${report.description}"
   Unauthorized / Disguised Charge: ${report.financialTrap || 'Unspecified extra checkout surcharge'}
   Audit Verification Timestamp  : ${timestamp}

IV. STATUTORY VIOLATIONS CHARGED:
   1. 15 U.S.C. § 45(a) - Unfair or deceptive acts affecting commerce through manipulative interface design.
   2. 15 U.S.C. § 8403 - Unlawful negative option billing without unambiguous affirmative consent.
   3. Failure to clearly and conspicuously disclose material terms prior to obtaining consumer billing data.

V. REQUESTED REGULATORY ACTION:
   1. Initiate formal investigative inquiry into Respondent's checkout funnel.
   2. Issue cease-and-desist order mandating immediate removal of pre-selected add-ons and deceptive fine print.
   3. Assess civil monetary restitution for affected consumers subjected to unauthorized recurring charges.

Submitted via DeceptiveShield Consumer Protection Network
Verification Hash: SHA256-${report.id.toUpperCase()}-VERIFIED`
      );
    }

    // CPPA_US
    return (
`CALIFORNIA CONSUMER PRIVACY ACT (CCPA) FORMAL REPORT
TO: California Privacy Protection Agency (CPPA) & Office of the Attorney General
RE: Prohibition of Dark Patterns Under Cal. Civ. Code § 1798.100 & § 1798.185(a)(20)

RESPONDENT : ${report.brandName} (${report.domain})
OFFENDING URL: ${report.pageUrl}
DATE OF LOG : ${timestamp}

SPECIFICATION OF DARK PATTERN VIOLATIONS:
${violationsBullet}

LEGAL GROUNDS:
Under California Code of Regulations § 7004, interactive consumer consent is invalid
if obtained through designs that have the substantial effect of subverting or impairing
user autonomy, decision-making, or choice (Dark Patterns).

The respondent's pre-checked purchase add-ons and obfuscated recurring fee schedules
violate the affirmative consent requirements established under California Consumer Privacy legislation.

Requesting regulatory audit and compliance enforcement.`
    );
  };

  const complaintText = generateComplaintText();

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(complaintText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                Export Formal Regulatory Complaint
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                  {report.domain}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pre-formatted petition for India CCPA (National Consumer Helpline) & International Consumer Authorities
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

        {/* Agency Switcher */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <span>Jurisdiction Authority:</span>
            <div className="inline-flex bg-slate-900 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setJurisdiction('CCPA_INDIA')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  jurisdiction === 'CCPA_INDIA'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🇮🇳 CCPA India (Dark Patterns Guidelines 2023)
              </button>
              <button
                onClick={() => setJurisdiction('FTC')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  jurisdiction === 'FTC'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🇺🇸 US FTC (15 U.S.C. § 45)
              </button>
              <button
                onClick={() => setJurisdiction('CPPA_US')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  jurisdiction === 'CPPA_US'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                California CPPA
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Report ID: <span className="text-slate-200 font-bold">{report.id}</span>
          </div>
        </div>

        {/* Complaint Text Box */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0a0f1d]">
          <div className="relative">
            <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed select-text shadow-inner">
              {complaintText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {jurisdiction === 'CCPA_INDIA'
                ? 'Ready to lodge with Department of Consumer Affairs at consumerhelpline.gov.in (NCH).'
                : 'Ready to lodge directly with trade enforcement authorities.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {jurisdiction === 'CCPA_INDIA' ? (
              <a
                href="https://consumerhelpline.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <span>Visit consumerhelpline.gov.in</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ) : (
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <span>Visit ReportFraud.ftc.gov</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-100" />
                  <span>Copied Complaint Text!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complaint Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
