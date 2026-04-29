import type { Status, RiskLevel, MatchStatus, RuleStatus, ExtractionConfidence } from './common';

// ─── Raw API Response Types (snake_case — matches backend exactly) ─────────────

export interface ApiKeyFinding {
  finding: string;
  ai_detected: boolean;
  report_mentioned: boolean;
  note: string | null;
}

export interface ApiClinicalFindingDetail {
  present: boolean | null;
  confidence_pct: number | null;
  evidence: string | null;
}

export interface ApiInfiltrationDetail {
  severity: string | null;
  confidence_pct: number | null;
  evidence: string | null;
}

export interface ImagingApiResponse {
  claim_id: string;
  package: string;
  model: string;
  n_images: number;
  generated_ms: number;
  header: {
    claim_id: string;
    patient_name: string | null;
    modality: string;
    body_part: string;
    study_date: string;
    reviewer: string | null;
  };
  status: {
    consistency: string;
    confidence_pct: number | null;
    clinical_risk_score: string | null;
    key_findings: ApiKeyFinding[];
  };
  scan_viewer: {
    primary_image_source: string;
    detected_regions: string[];
    ai_overlays_available: boolean;
  };
  ai_clinical_findings: {
    fracture: ApiClinicalFindingDetail;
    fluid_accumulation: ApiClinicalFindingDetail;
    tumor_mass: ApiClinicalFindingDetail;
    infiltration: ApiInfiltrationDetail;
    image_quality: string | null;
  };
  multi_image_analysis: {
    entries: Array<{
      modality: string;
      day: number | null;
      date: string | null;
      finding: string;
      confirmed: boolean;
    }>;
    consistency_score_pct: number | null;
  };
  report_nlp_extraction: {
    reported_diagnosis: string | null;
    reported_severity: string | null;
    reported_findings: string[];
    extraction_confidence: string | null;
  };
  finding_correlation: {
    rows: Array<{
      finding: string;
      image_ai: boolean;
      report: boolean;
      match: boolean;
    }>;
    consistency_score_pct: number | null;
  };
  inconsistency_detection: {
    possible_exaggerations: string[];
    underreported_findings: string[];
    hidden_findings: string[];
  };
  stg_alignment: {
    claimed_package: string;
    evidence_required: string[];
    stg_compliance_score_pct: number | null;
  };
  radiology_timeline: {
    events: Array<{
      day: number;
      date: string;
      event: string;
    }>;
    logical: boolean;
  };
  patient: {
    name: string | null;
    age: string | null;
    sex: string | null;
    id_numbers: string[];
  };
  hospital: {
    name: string | null;
    location: string | null;
    doctors: string[];
  };
  encounter: {
    date_range: string;
    all_dates: string[];
    primary_procedure: string | null;
    package_code: string;
  };
  image_inventory: {
    total_images: number;
    by_type: Record<string, number>;
    stages_present: string[];
    languages_seen: string[];
  };
  clinical_narrative: string | null;
  completeness: {
    has_pre_procedure_imaging: boolean;
    has_intra_procedure_imaging: boolean;
    has_post_procedure_imaging: boolean;
    has_typed_report: boolean;
    has_handwritten_notes: boolean;
    has_signed_stamp: boolean;
    notes: string | null;
  };
  concerns_or_gaps: string[];
}

// ─── Normalized Component-Facing Types ────────────────────────────────────────

export interface PatientInfo {
  name: string;
  age: string | null;
  sex: string | null;
  idNumbers: string[];
}

export interface HospitalInfo {
  name: string | null;
  location: string | null;
  doctors: string[];
}

export interface EncounterInfo {
  dateRange: string;
  allDates: string[];
  primaryProcedure: string | null;
  packageCode: string;
}

export interface ImageInventory {
  totalImages: number;
  byType: Record<string, number>;
  stagesPresent: string[];
  languagesSeen: string[];
}

export interface ScanViewerInfo {
  primaryImageSource: string;
  detectedRegions: string[];
  aiOverlaysAvailable: boolean;
}

export interface CompletenessInfo {
  hasPreProcedureImaging: boolean;
  hasIntraProcedureImaging: boolean;
  hasPostProcedureImaging: boolean;
  hasTypedReport: boolean;
  hasHandwrittenNotes: boolean;
  hasSignedStamp: boolean;
  notes: string | null;
}

export interface ImagingKeyFinding {
  text: string;
  consistent: boolean;
  note?: string | null;
}

export interface AIFinding {
  name: string;
  detected: boolean;
  confidence: number | null;
  severity?: string | null;
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
  diagnosis: string | null;
  severity: string | null;
  findings: string[];
  extractionConfidence: ExtractionConfidence | null;
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
  complianceScore: number | null;
}

export interface RadiologyEvent {
  day: number;
  date: string;
  event: string;
}

export interface ImagingAnalysis {
  // Claim identity
  claimId: string;
  packageCode: string;
  modelId: string;
  totalImages: number;

  // Study header
  modality: string;
  bodyPart: string;
  studyDate: string;
  reviewer: string | null;

  // Structured entities
  patient: PatientInfo;
  hospital: HospitalInfo;
  encounter: EncounterInfo;
  imageInventory: ImageInventory;

  // Status
  status: Status;
  confidence: number | null;
  clinicalRisk: RiskLevel | null;
  keyFindings: ImagingKeyFinding[];

  // Scan viewer
  scanViewer: ScanViewerInfo;

  // AI clinical findings
  aiFindings: AIFinding[];
  imageQuality: string | null;

  // Multi-image
  images: ImageScan[];
  consistencyScore: number | null;

  // NLP extraction
  nlpExtraction: NLPExtraction;

  // Finding correlation
  correlationRows: CorrelationRow[];
  correlationScore: number | null;

  // Inconsistency
  inconsistencies: Inconsistency[];

  // STG alignment
  stgAlignment: STGAlignment;

  // Radiology timeline
  radiologyTimeline: RadiologyEvent[];
  timelineLogical: boolean;

  // Narrative & completeness
  clinicalNarrative: string | null;
  completeness: CompletenessInfo;
  concerns: string[];
}
