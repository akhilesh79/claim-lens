import { motion } from 'framer-motion';
import { useGetImagingAnalysisQuery } from '@/services/imagingApi';
import { useAppSelector } from '@/app/hooks';
import { ImagingDashboardSkeleton } from '@/components/ui';

import { ImagingHeaderPanel } from '@/features/imaging/components/ImagingHeaderPanel';
import { ImageViewer } from '@/features/imaging/components/ImageViewer';
import { AIFindingsPanel } from '@/features/imaging/components/AIFindingsPanel';
import { ClinicalNarrativePanel } from '@/features/imaging/components/ClinicalNarrativePanel';
import { MultiImageAnalysis } from '@/features/imaging/components/MultiImageAnalysis';
import { NLPReportExtraction } from '@/features/imaging/components/NLPReportExtraction';
import { FindingCorrelationTable } from '@/features/imaging/components/FindingCorrelationTable';
import { InconsistencyDetection } from '@/features/imaging/components/InconsistencyDetection';
import { STGAlignmentPanel } from '@/features/imaging/components/STGAlignmentPanel';
import { CompletenessPanel } from '@/features/imaging/components/CompletenessPanel';
import { RadiologyTimeline } from '@/features/imaging/components/RadiologyTimeline';

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="glass rounded-2xl p-8 text-center max-w-md">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Study</h3>
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

function ZoneLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      <span className="flex-1 h-px border-t border-white/[0.07]" />
    </div>
  );
}

export default function ImagingDashboard() {
  const studyId = useAppSelector((s) => s.imaging.selectedStudyId);
  const { data, isLoading, isError, error } = useGetImagingAnalysisQuery(studyId);

  if (isLoading) return <ImagingDashboardSkeleton />;
  if (isError || !data) {
    const msg = error && 'message' in error ? String(error.message) : 'Unknown error occurred';
    return <ErrorState message={msg} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <ImagingHeaderPanel data={data} />

      {/* ── Zone 1: Study context — 3 equal columns ────────────── */}
      <div>
        <ZoneLabel label="Study Context" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ImageViewer
            findings={data.aiFindings}
            imageQuality={data.imageQuality}
            scanViewer={data.scanViewer}
            modality={data.modality}
            imageInventory={data.imageInventory}
          />
          <ClinicalNarrativePanel narrative={data.clinicalNarrative} modelId={data.modelId} />
          <MultiImageAnalysis images={data.images} consistencyScore={data.consistencyScore} />
        </div>
      </div>

      {/* ── Zone 2: AI Analysis — 2 equal columns ──────────────── */}
      <div>
        <ZoneLabel label="AI Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AIFindingsPanel findings={data.aiFindings} imageQuality={data.imageQuality} />
          <FindingCorrelationTable rows={data.correlationRows} consistencyScore={data.correlationScore} />
        </div>
      </div>

      {/* ── Zone 3: Validation — 2 equal columns ───────────────── */}
      <div>
        <ZoneLabel label="Validation" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InconsistencyDetection inconsistencies={data.inconsistencies} />
          <NLPReportExtraction extraction={data.nlpExtraction} />
        </div>
      </div>

      {/* ── Zone 4: Documentation — 2 equal columns ────────────── */}
      <div>
        <ZoneLabel label="Documentation" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <STGAlignmentPanel stgAlignment={data.stgAlignment} />
          <CompletenessPanel
            completeness={data.completeness}
            imageInventory={data.imageInventory}
            concerns={data.concerns}
          />
        </div>
      </div>

      {/* ── Zone 5: Timeline — full width ──────────────────────── */}
      <div>
        <ZoneLabel label="Timeline" />
        <RadiologyTimeline timeline={data.radiologyTimeline} isLogical={data.timelineLogical} />
      </div>
    </motion.div>
  );
}
