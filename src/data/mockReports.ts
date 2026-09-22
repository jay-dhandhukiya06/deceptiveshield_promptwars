import { CommunityReport } from '../types';

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'report-nexusgear-01',
    domain: 'nexusgear-india.in',
    pageUrl: 'https://nexusgear-india.in/checkout',
    pageTitle: 'NexusGear India • Secure Checkout',
    brandName: 'NexusGear Consumer Electronics India',
    riskGrade: 'F',
    riskScore: 98,
    riskLabel: 'Critical Threat',
    category: 'Basket Sneaking',
    violations: [
      'Basket Sneaking: ₹199.00 pre-selected courier & damage cover',
      'Forced Action: 9px fine print ₹499/mo UPI Autopay / e-Mandate auto-debit',
      'False Urgency: "Only 2 left in Bengaluru warehouse"',
      'Drip Pricing: Additional ₹199 courier fee revealed only at final step'
    ],
    description: 'Pre-checks an express courier transit protection fee for ₹199 and tucks a ₹499/month auto-enrolling VIP Club UPI Autopay / e-Mandate clause in 9px low-contrast text beneath the boAt headphones checkbox.',
    financialTrap: '+₹199 upfront + ₹499/month recurring UPI Autopay',
    votes: 428,
    userVote: 0,
    reportedAt: '12 minutes ago',
    reportedBy: 'ShieldPatrol_Bengaluru',
    status: 'verified',
    regulatoryClause: 'Guidelines for Prevention and Regulation of Dark Patterns, 2023 under Consumer Protection Act, 2019 (CCPA, India)'
  },
  {
    id: 'report-aerotrip-02',
    domain: 'skyjet-india-travel.in',
    pageUrl: 'https://skyjet-india-travel.in/book/seat-selection',
    pageTitle: 'SkyJet Domestic Airways - Review & Pay',
    brandName: 'SkyJet Aviation India',
    riskGrade: 'F',
    riskScore: 94,
    riskLabel: 'Severe Dark Pattern',
    category: 'Drip Pricing',
    violations: [
      'Drip Pricing: Mandatory ₹350 "Airport Web Check-in & Convenience Fee" added on final step',
      'Confirmshaming: "No, I prefer risking unallocated middle seats" option button',
      'Basket Sneaking: Auto-checked ₹149 flight delay compensation insurance'
    ],
    description: 'Waits until the final UPI/Card payment step before revealing a ₹350 platform convenience fee that cannot be unselected. Uses aggressive guilt-trip button copy to discourage opting out of baggage protection.',
    financialTrap: '+₹499 hidden drip fees per passenger',
    votes: 312,
    userVote: 0,
    reportedAt: '2 hours ago',
    reportedBy: 'ConsumerVoice_Aarav',
    status: 'verified',
    regulatoryClause: 'Guidelines for Prevention and Regulation of Dark Patterns, 2023 (Annexure 1: Drip Pricing & Basket Sneaking)'
  },
  {
    id: 'report-streamflex-03',
    domain: 'fitbharat-online.in',
    pageUrl: 'https://fitbharat-online.in/trial/checkout',
    pageTitle: 'FitBharat Pro • Start ₹1 Trial',
    brandName: 'FitBharat Digital Health India',
    riskGrade: 'D',
    riskScore: 82,
    riskLabel: 'High Risk',
    category: 'Forced Action',
    violations: [
      'Forced Action: Automatic ₹1,499 quarterly e-Mandate activated without pre-debit SMS',
      'Roach Motel: Cancellation requires physically emailing support with 14-day notice',
      'Deceptive Opt-out: Gray 8px link "Continue with basic free tier"'
    ],
    description: 'Advertises a "₹1.00 Trial Offer" on front banner but binds the user\'s UPI ID to an upfront ₹1,499 quarterly recurring e-Mandate without explicit consent.',
    financialTrap: '₹1,499 billed quarterly via UPI Autopay',
    votes: 275,
    userVote: 0,
    reportedAt: '5 hours ago',
    reportedBy: 'Priya_K',
    status: 'verified',
    regulatoryClause: 'CCPA Guidelines 2023 (Forced Action & Subverted Consent) & RBI e-Mandate Framework'
  },
  {
    id: 'report-flashdepot-04',
    domain: 'desigadgets-sale.in',
    pageUrl: 'https://desigadgets-sale.in/cart',
    pageTitle: 'DesiGadgets India - Festive Flash Sale',
    brandName: 'DesiGadgets Retail India',
    riskGrade: 'D',
    riskScore: 78,
    riskLabel: 'High Risk',
    category: 'False Urgency',
    violations: [
      'False Urgency: Script generates random "Only 3 items left in Delhi" every refresh',
      'Bogus Social Proof: False "Rohan from Pune just bought this Noise watch" toast popups',
      'Artificial Countdown: Cart expires banner with resetting 5-minute timer'
    ],
    description: 'Inspect element reveals hardcoded client scripts displaying fabricated buyer notifications and fake inventory shortages to induce panic purchasing during festive sales.',
    financialTrap: 'Manipulative price pressure',
    votes: 189,
    userVote: 0,
    reportedAt: '1 day ago',
    reportedBy: 'CodeAuditor_IN',
    status: 'verified',
    regulatoryClause: 'Consumer Protection Act, 2019 (CCPA 2023 Guidelines: False Urgency & Deceptive Claims)'
  },
  {
    id: 'report-cloudstorage-05',
    domain: 'quickdoc-backup.in',
    pageUrl: 'https://quickdoc-backup.in/plans',
    pageTitle: 'QuickDoc India Cloud Storage Plans',
    brandName: 'QuickDoc Solutions Bengaluru',
    riskGrade: 'C',
    riskScore: 65,
    riskLabel: 'Moderate Risk',
    category: 'Basket Sneaking',
    violations: [
      'Basket Sneaking: Auto-added ₹249/yr cloud ransomware protection addon',
      'Drip Pricing: GST 18% hidden until final OTP verification screen'
    ],
    description: 'Default checkout silently switches from the selected monthly tier (₹99/mo) to an upfront annual commitment (₹1,499/yr) and slips in an unrequested security add-on.',
    financialTrap: '+₹1,499 unexpected annual commitment',
    votes: 142,
    userVote: 0,
    reportedAt: '2 days ago',
    reportedBy: 'DevRohan_Bangalore',
    status: 'investigating',
    regulatoryClause: 'Guidelines for Prevention and Regulation of Dark Patterns, 2023 (CCPA, India)'
  }
];
