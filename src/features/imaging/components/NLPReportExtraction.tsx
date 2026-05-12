import { FileText } from 'lucide-react';
import { SectionContainer } from '@/components/ui';
import { Badge } from '@/ui';
import type { NLPExtraction } from '@/types/imaging';
import type { ExtractionConfidence } from '@/types/common';

interface Props {
  extraction: NLPExtraction;
}

const CONF_TONE: Record<ExtractionConfidence, 'success' | 'warning' | 'danger'> = {
  High: 'success',
  Medium: 'warning',
  Low: 'danger',
};

function hasContent(e: NLPExtraction): boolean {
  return e.diagnosis !== null || e.severity !== null || e.findings.length > 0 || e.extractionConfidence !== null;
}

function EmptyState() {
  return (
    <div className="py-6 flex flex-col items-center gap-2 text-center">
      <FileText size={24} className="text-text-subtle" />
      <p className="text-small text-text-subtle">NLP extraction unavailable for this study</p>
      <p className="text-caption text-text-subtle">Report text could not be parsed or was not provided</p>
    </div>
  );
}

export function NLPReportExtraction({ extraction }: Props) {
  return (
    <SectionContainer title="Report NLP Extraction" icon={<FileText size={14} />} defaultOpen>
      <div className="pt-3">
        {!hasContent(extraction) ? <EmptyState /> : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-md bg-surface border border-border">
                <p className="label-caption mb-1">Reported Diagnosis</p>
                <p className="text-body-strong text-text">
                  {extraction.diagnosis ?? <span className="text-text-subtle font-normal">—</span>}
                </p>
              </div>
              <div className="p-3 rounded-md bg-surface border border-border">
                <p className="label-caption mb-1">Reported Severity</p>
                <p className="text-body-strong text-warning-fg">
                  {extraction.severity ?? <span className="text-text-subtle font-normal">—</span>}
                </p>
              </div>
            </div>

            {extraction.findings.length > 0 && (
              <div className="p-3 rounded-md bg-surface border border-border">
                <p className="label-caption mb-2">Reported Findings</p>
                <ul className="space-y-1.5">
                  {extraction.findings.map((finding, i) => (
                    <li key={i} className="flex items-center gap-2 text-body text-text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {extraction.extractionConfidence !== null && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-small text-text-subtle">Extraction Confidence</span>
                <Badge tone={CONF_TONE[extraction.extractionConfidence]}>
                  {extraction.extractionConfidence}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
