export type TabMode = 'sandbox' | 'wall' | 'submit' | 'extension' | 'legal' | 'popup' | 'code' | 'install';

export interface DarkPatternItem {
  id: string;
  type: 'prechecked_addon' | 'recurring_fee' | 'artificial_urgency' | 'drip_pricing' | 'forced_continuity';
  category: string;
  title: string;
  snippet: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface DetectionStats {
  total: number;
  precheckedAddons: number;
  recurringFees: number;
  urgencyTriggers: number;
}

export interface CommunityReport {
  id: string;
  domain: string;
  pageUrl: string;
  pageTitle: string;
  brandName: string;
  riskGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskScore: number; // 0 - 100
  riskLabel: string;
  category: string;
  violations: string[];
  description: string;
  financialTrap?: string;
  screenshotUrl?: string;
  customImageData?: string;
  votes: number;
  userVote: 1 | -1 | 0;
  reportedAt: string;
  reportedBy: string;
  status: 'verified' | 'investigating' | 'neutralized';
  regulatoryClause: string;
}

export interface ExtensionFileItem {
  name: string;
  path: string;
  language: string;
  description: string;
  code: string;
  isMain?: boolean;
}

