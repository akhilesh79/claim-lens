import { Grid3x3, AlertCircle, Minus } from 'lucide-react';
import { SectionContainer, ProgressBar } from '@/components/ui';
import { Badge } from '@/ui';
import { cn } from '@/lib/cn';
import type { AIFinding } from '@/types/imaging';

interface Props {
  findings: AIFinding[];
  imageQuality: string | null;
}

function qualityTone(q: string | null): 'success' | 'warning' | 'danger' | 'neutral' {
  if (q === 'High') return 'success';
  if (q === 'Moderate') return 'warning';
  if (q) return 'danger';
  return 'neutral';
}

export function AIFindingsPanel({ findings, imageQuality }: Props) {
  return (
    <SectionContainer title="AI Clinical Findings" icon={<Grid3x3 size={14} />} defaultOpen>
      <div className="space-y-2 pt-3">
        {findings.map((finding) => (
          <div
            key={finding.name}
            className={cn(
              'p-3 rounded-md border',
              finding.detected ? 'bg-danger-bg/40 border-danger-border' : 'bg-surface border-border',
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    'h-5 w-5 rounded-full grid place-items-center flex-shrink-0',
                    finding.detected ? 'bg-danger-bg text-danger-fg border border-danger-border' : 'bg-surface-muted text-text-subtle border border-border',
                  )}
                >
                  {finding.detected ? <AlertCircle size={12} /> : <Minus size={12} />}
                </span>
                <span className={cn('text-body-strong', finding.detected ? 'text-text' : 'text-text-subtle')}>
                  {finding.name}
                </span>
                {finding.severity && finding.detected && (
                  <Badge tone="warning">{finding.severity}</Badge>
                )}
              </div>
              <span className={cn('text-caption font-semibold', finding.detected ? 'text-danger-fg' : 'text-success-fg')}>
                {finding.detected ? 'Detected' : 'None'}
              </span>
            </div>
            {finding.detected && finding.confidence !== null && (
              <ProgressBar
                value={finding.confidence}
                size="xs"
                color={finding.confidence > 80 ? 'danger' : finding.confidence > 50 ? 'warning' : 'brand'}
                showValue
              />
            )}
          </div>
        ))}

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-small text-text-subtle">Overall Image Quality</span>
          {imageQuality
            ? <Badge tone={qualityTone(imageQuality)}>{imageQuality}</Badge>
            : <span className="text-small text-text-subtle">Not assessed</span>}
        </div>
      </div>
    </SectionContainer>
  );
}
