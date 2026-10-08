export type ToolCategory = 'pdf' | 'image' | 'creator' | 'text' | 'fiverr';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  badgeColor: string;
  accentColor: string;
}

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ToolCategory;
  iconName: string;
  badge?: 'Popular' | 'New' | 'Signature' | 'Updated' | 'Featured Game';
  keywords: string[];
  features?: string[];
  instructions?: { step: number; title: string; desc: string }[];
  faqs?: { question: string; answer: string }[];
  clientSideOnly: boolean;
}

export type RiskLevel = 'high' | 'medium' | 'low' | 'safe';

export interface RuleMatch {
  ruleId: string;
  category: string;
  matchedText: string;
  index: number;
  length: number;
  riskLevel: RiskLevel;
  explanation: string;
  suggestion: string;
}

export interface ScanResult {
  hasIssues: boolean;
  status: 'Review Needed' | 'Potential Risk' | 'Informational' | 'No Issues Detected by Current Rules';
  statusColor: string;
  matches: RuleMatch[];
  scannedAt: Date;
  wordCount: number;
  charCount: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
}
