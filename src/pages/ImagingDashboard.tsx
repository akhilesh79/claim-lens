import { motion } from 'framer-motion';
import { useAppSelector } from '@/app/hooks';

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

function ApiErrorCard({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="glass rounded-2xl p-8 text-center max-w-md space-y-3">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-lg font-semibold text-red-400">Image Validation Engine Failed</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

function ZoneLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[9px] font-bold font-heading uppercase tracking-widest text-slate-500">{label}</span>
      <span className="flex-1 h-px border-t border-white/[0.07]" />
    </div>
  );
}

export default function ImagingDashboard() {
  const data  = useAppSelector((s) => s.imaging.apiData);
  const error = useAppSelector((s) => s.imaging.apiError);

  if (error) return <ApiErrorCard message={error} />;
  if (!data)  return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <ImagingHeaderPanel data={data} />

      {/* ── Zone 1: Validation & Compliance — 3 equal columns ──── */}
      <div>
        <ZoneLabel label="Validation & Compliance" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FindingCorrelationTable rows={data.correlationRows} consistencyScore={data.correlationScore} />
          <InconsistencyDetection inconsistencies={data.inconsistencies} />
          <STGAlignmentPanel stgAlignment={data.stgAlignment} />
        </div>
      </div>

      {/* ── Zone 2: Study context — 3 equal columns ────────────── */}
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

      {/* ── Zone 3: Timeline — full width ──────────────────────── */}
      <div>
        <ZoneLabel label="Timeline" />
        <RadiologyTimeline timeline={data.radiologyTimeline} isLogical={data.timelineLogical} />
      </div>

      {/* ── Zone 4: AI Analysis — 2 equal columns ──────────────── */}
      <div>
        <ZoneLabel label="AI Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AIFindingsPanel findings={data.aiFindings} imageQuality={data.imageQuality} />
          <NLPReportExtraction extraction={data.nlpExtraction} />
        </div>
      </div>

      {/* ── Zone 5: Documentation ───────────────────────────────── */}
      <div>
        <ZoneLabel label="Documentation" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CompletenessPanel
            completeness={data.completeness}
            imageInventory={data.imageInventory}
            concerns={data.concerns}
          />
        </div>
      </div>
    </motion.div>
  );
}
