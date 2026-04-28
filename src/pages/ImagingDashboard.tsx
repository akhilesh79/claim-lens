import { motion } from 'framer-motion';
import { useGetImagingAnalysisQuery } from '@/services/imagingApi';
import { useAppSelector } from '@/app/hooks';
import { ImagingDashboardSkeleton } from '@/components/ui';

import { ImagingHeaderPanel } from '@/features/imaging/components/ImagingHeaderPanel';
import { ImageViewer } from '@/features/imaging/components/ImageViewer';
import { AIFindingsPanel } from '@/features/imaging/components/AIFindingsPanel';
import { MultiImageAnalysis } from '@/features/imaging/components/MultiImageAnalysis';
import { NLPReportExtraction } from '@/features/imaging/components/NLPReportExtraction';
import { FindingCorrelationTable } from '@/features/imaging/components/FindingCorrelationTable';
import { InconsistencyDetection } from '@/features/imaging/components/InconsistencyDetection';
import { STGAlignmentPanel } from '@/features/imaging/components/STGAlignmentPanel';
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
      className="space-y-4"
    >
      {/* Header panels */}
      <ImagingHeaderPanel data={data} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <ImageViewer findings={data.aiFindings} imageQuality={data.imageQuality} />
          <AIFindingsPanel findings={data.aiFindings} imageQuality={data.imageQuality} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <MultiImageAnalysis images={data.images} consistencyScore={data.consistencyScore} />
          <NLPReportExtraction extraction={data.nlpExtraction} />
          <FindingCorrelationTable rows={data.correlationRows} />
          <InconsistencyDetection inconsistencies={data.inconsistencies} />
          <STGAlignmentPanel stgAlignment={data.stgAlignment} />
          <RadiologyTimeline timeline={data.radiologyTimeline} isLogical={data.timelineLogical} />
        </div>
      </div>
    </motion.div>
  );
}
