import type { Status, RiskLevel, RuleStatus } from './common';

export interface Patient {
  name: string;
  age: number | string;
  gender: string;
}

export interface ClaimSummary {
  id: string;
  patient: Patient;
  hospital: string;
  admissionDate: string;
  dischargeDate: string;
  lengthOfStay: number;
  packageType: string;
  diagnosis: string;
  procedure: string;
  claimedAmount: number;
}

export interface DocumentItem {
  name: string;
  present: boolean;
}

export interface DocumentInventory {
  documents: DocumentItem[];
  duplicateDocs: number;
  lowQualityDocs: number;
}

export interface VisualProof {
  type: string;
  detected: boolean;
  imageUrl?: string;
}

export interface STGRule {
  rule: string;
  expected: string;
  observed: string;
  status: RuleStatus;
}

export interface TimelineEvent {
  day: number;
  label: string;
  description: string;
  hasGap?: boolean;
}

export interface FinancialItem {
  category: string;
  amount: number;
  status: 'ok' | 'warn' | 'fail';
}

export interface FraudSignal {
  description: string;
}

export interface ClaimDecision {
  job_id: string;
  claim_id: string;
  package_code: string;
  report: ClaimResult;
}

export interface ClaimResult {
  status: Status;
  confidence: number;
  riskScore: RiskLevel;
  keyReasons: string[];
  complianceScore: number;
  summary: ClaimSummary;
  documentInventory: DocumentInventory;
  visualProofs: VisualProof[];
  stgRules: STGRule[];
  timeline: TimelineEvent[];
  financialItems: FinancialItem[];
  fraudSignals: FraudSignal[];
  recommendedActions: string[];
}

export type ClaimActionResult = {
  success: boolean;
  message: string;
};
