import { AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { Surface } from '@/ui';

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
      <Surface padding="comfortable" className="max-w-md text-center">
        <div className="grid place-items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-danger-bg border border-danger-border grid place-items-center">
            <AlertCircle size={20} className="text-danger-fg" />
          </div>
        </div>
        <h3 className="text-h3 text-danger-fg mb-1">Image Validation Engine Failed</h3>
        <p className="text-body text-text-muted">{message}</p>
      </Surface>
    </div>
  );
}

function ZoneLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="label-caption">{label}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

export default function ImagingDashboard() {
  const data  = useAppSelector((s) => s.imaging.apiData);
  const error = useAppSelector((s) => s.imaging.apiError);

  if (error) return <ApiErrorCard message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <ImagingHeaderPanel data={data} />

      <div>
        <ZoneLabel label="Validation & Compliance" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FindingCorrelationTable rows={data.correlationRows} consistencyScore={data.correlationScore} />
          <InconsistencyDetection inconsistencies={data.inconsistencies} />
          <STGAlignmentPanel stgAlignment={data.stgAlignment} />
        </div>
      </div>

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

      <div>
        <ZoneLabel label="Timeline" />
        <RadiologyTimeline timeline={data.radiologyTimeline} isLogical={data.timelineLogical} />
      </div>

      <div>
        <ZoneLabel label="AI Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AIFindingsPanel findings={data.aiFindings} imageQuality={data.imageQuality} />
          <NLPReportExtraction extraction={data.nlpExtraction} />
        </div>
      </div>

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
    </div>
  );
}
