import type {
  ImagingApiResponse,
  ImagingAnalysis,
  AIFinding,
  CorrelationRow,
  Inconsistency,
  STGAlignmentItem,
} from '@/types/imaging';
import type { Status, RiskLevel, MatchStatus, ExtractionConfidence } from '@/types/common';

function mapConsistency(consistency: string): Status {
  switch (consistency.toLowerCase()) {
    case 'consistent': return 'PASS';
    case 'inconsistent': return 'FAIL';
    default: return 'CONDITIONAL';
  }
}

function mapRiskLevel(raw: string | null): RiskLevel | null {
  if (!raw) return null;
  const valid: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];
  return valid.includes(raw as RiskLevel) ? (raw as RiskLevel) : null;
}

function mapExtractionConfidence(raw: string | null): ExtractionConfidence | null {
  if (!raw) return null;
  const valid: ExtractionConfidence[] = ['High', 'Medium', 'Low'];
  return valid.includes(raw as ExtractionConfidence) ? (raw as ExtractionConfidence) : null;
}

function mapMatchStatus(match: boolean): MatchStatus {
  return match ? 'match' : 'mismatch';
}

function buildAIFindings(raw: ImagingApiResponse['ai_clinical_findings']): AIFinding[] {
  return [
    {
      name: 'Fracture',
      detected: raw.fracture.present === true,
      confidence: raw.fracture.confidence_pct,
      severity: raw.fracture.evidence ?? null,
    },
    {
      name: 'Fluid Accumulation',
      detected: raw.fluid_accumulation.present === true,
      confidence: raw.fluid_accumulation.confidence_pct,
    },
    {
      name: 'Tumour / Mass',
      detected: raw.tumor_mass.present === true,
      confidence: raw.tumor_mass.confidence_pct,
    },
    {
      name: 'Infiltration',
      detected: raw.infiltration.severity !== null,
      confidence: raw.infiltration.confidence_pct,
      severity: raw.infiltration.severity ?? null,
    },
  ];
}

function buildInconsistencies(raw: ImagingApiResponse['inconsistency_detection']): Inconsistency[] {
  const items: Inconsistency[] = [];

  raw.possible_exaggerations.forEach((d) =>
    items.push({ type: 'warning', description: `Possible exaggeration: ${d}` })
  );
  raw.underreported_findings.forEach((d) =>
    items.push({ type: 'warning', description: `Underreported finding: ${d}` })
  );
  raw.hidden_findings.forEach((d) =>
    items.push({ type: 'warning', description: `Hidden finding detected: ${d}` })
  );

  if (items.length === 0) {
    items.push({ type: 'pass', description: 'No inconsistencies detected — AI findings are fully aligned with report' });
  }

  return items;
}

function buildSTGItems(evidenceRequired: string[]): STGAlignmentItem[] {
  return evidenceRequired.map((evidence) => ({
    evidence,
    present: true,
    status: 'pass' as const,
  }));
}

function buildCorrelationRows(raw: ImagingApiResponse['finding_correlation']['rows']): CorrelationRow[] {
  return raw.map((r) => ({
    finding: r.finding,
    imageAI: r.image_ai,
    report: r.report,
    match: mapMatchStatus(r.match),
  }));
}

export function normalizeImagingResponse(raw: ImagingApiResponse): ImagingAnalysis {
  return {
    claimId: raw.claim_id,
    packageCode: raw.package,
    modelId: raw.model,
    totalImages: raw.n_images,

    modality: raw.header.modality,
    bodyPart: raw.header.body_part,
    studyDate: raw.header.study_date,
    reviewer: raw.header.reviewer,

    patient: {
      name: raw.patient.name,
      age: raw.patient.age,
      sex: raw.patient.sex,
      idNumbers: raw.patient.id_numbers,
    },
    hospital: {
      name: raw.hospital.name,
      location: raw.hospital.location,
      doctors: raw.hospital.doctors,
    },
    encounter: {
      dateRange: raw.encounter.date_range,
      allDates: raw.encounter.all_dates,
      primaryProcedure: raw.encounter.primary_procedure,
      packageCode: raw.encounter.package_code,
    },
    imageInventory: {
      totalImages: raw.image_inventory.total_images,
      byType: raw.image_inventory.by_type,
      stagesPresent: raw.image_inventory.stages_present,
      languagesSeen: raw.image_inventory.languages_seen,
    },

    status: mapConsistency(raw.status.consistency),
    confidence: raw.status.confidence_pct,
    clinicalRisk: mapRiskLevel(raw.status.clinical_risk_score),
    keyFindings: raw.status.key_findings.map((kf) => ({
      text: kf.finding,
      consistent: kf.ai_detected && kf.report_mentioned,
      note: kf.note,
    })),

    scanViewer: {
      primaryImageSource: raw.scan_viewer.primary_image_source,
      detectedRegions: raw.scan_viewer.detected_regions,
      aiOverlaysAvailable: raw.scan_viewer.ai_overlays_available,
    },

    aiFindings: buildAIFindings(raw.ai_clinical_findings),
    imageQuality: raw.ai_clinical_findings.image_quality,

    images: raw.multi_image_analysis.entries.map((entry, i) => ({
      id: `img-${i}`,
      modality: entry.modality,
      day: entry.day,
      date: entry.date,
      finding: entry.finding,
      consistent: entry.confirmed,
    })),
    consistencyScore: raw.multi_image_analysis.consistency_score_pct,

    nlpExtraction: {
      diagnosis: raw.report_nlp_extraction.reported_diagnosis,
      severity: raw.report_nlp_extraction.reported_severity,
      findings: raw.report_nlp_extraction.reported_findings,
      extractionConfidence: mapExtractionConfidence(raw.report_nlp_extraction.extraction_confidence),
    },

    correlationRows: buildCorrelationRows(raw.finding_correlation.rows),
    correlationScore: raw.finding_correlation.consistency_score_pct,

    inconsistencies: buildInconsistencies(raw.inconsistency_detection),

    stgAlignment: {
      claimedPackage: raw.stg_alignment.claimed_package,
      items: buildSTGItems(raw.stg_alignment.evidence_required),
      complianceScore: raw.stg_alignment.stg_compliance_score_pct,
    },

    radiologyTimeline: raw.radiology_timeline.events.map((ev) => ({
      day: ev.day,
      date: ev.date,
      event: ev.event,
    })),
    timelineLogical: raw.radiology_timeline.logical,

    clinicalNarrative: raw.clinical_narrative,
    completeness: {
      hasPreProcedureImaging: raw.completeness.has_pre_procedure_imaging,
      hasIntraProcedureImaging: raw.completeness.has_intra_procedure_imaging,
      hasPostProcedureImaging: raw.completeness.has_post_procedure_imaging,
      hasTypedReport: raw.completeness.has_typed_report,
      hasHandwrittenNotes: raw.completeness.has_handwritten_notes,
      hasSignedStamp: raw.completeness.has_signed_stamp,
      notes: raw.completeness.notes,
    },
    concerns: raw.concerns_or_gaps,
  };
}
