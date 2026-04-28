import type { Status, RiskLevel, MatchStatus, RuleStatus, ExtractionConfidence } from './common';

export interface AIFinding {
  name: string;
  detected: boolean;
  confidence: number;
  severity?: string;
}

export interface ImageScan {
  id: string;
  modality: string;
  day: number;
  date: string;
  finding: string;
  consistent: boolean;
}

export interface NLPExtraction {
  diagnosis: string;
  severity: string;
  findings: string[];
  extractionConfidence: ExtractionConfidence;
}

export interface CorrelationRow {
  finding: string;
  imageAI: boolean | null;
  report: boolean | null;
  match: MatchStatus;
  aiValue?: string;
  reportValue?: string;
}

export interface Inconsistency {
  type: 'warning' | 'pass';
  description: string;
}

export interface STGAlignmentItem {
  evidence: string;
  present: boolean;
  status: RuleStatus;
}

export interface STGAlignment {
  claimedPackage: string;
  items: STGAlignmentItem[];
  complianceScore: number;
}

export interface RadiologyEvent {
  day: number;
  modality: string;
  purpose: string;
}

export interface ImagingKeyFinding {
  text: string;
  consistent: boolean;
}

export interface ImagingAnalysis {
  claimId: string;
  patient: string;
  modality: string;
  bodyPart: string;
  studyDate: string;
  reviewer: string;
  status: Status;
  confidence: number;
  clinicalRisk: RiskLevel;
  keyFindings: ImagingKeyFinding[];
  aiFindings: AIFinding[];
  imageQuality: string;
  images: ImageScan[];
  consistencyScore: number;
  nlpExtraction: NLPExtraction;
  correlationRows: CorrelationRow[];
  inconsistencies: Inconsistency[];
  stgAlignment: STGAlignment;
  radiologyTimeline: RadiologyEvent[];
  timelineLogical: boolean;
}
