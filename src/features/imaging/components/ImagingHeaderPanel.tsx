import { Check, AlertTriangle } from 'lucide-react';
import { Surface, StatusBadge } from '@/ui';
import { RiskIndicator } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { ImagingAnalysis } from '@/types/imaging';

interface Props {
  data: ImagingAnalysis;
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="label-caption">{label}</span>
      <span className={cn('text-body-strong text-text truncate', mono && 'font-mono text-small')}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-8 w-px bg-border hidden sm:block flex-shrink-0" />;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center min-w-[64px]">
      <p className="label-caption mb-0.5">{label}</p>
      <p className="num text-h2 text-text leading-none">{value}</p>
    </div>
  );
}

function patientLabel(d: ImagingAnalysis): string {
  return [d.patient.name, d.patient.age, d.patient.sex].filter(Boolean).join(' · ');
}

export function ImagingHeaderPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      <Surface elevation={1} padding="default">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <MetaItem label="Claim ID"   value={data.claimId} mono />
          <MetaItem label="Patient"    value={patientLabel(data)} />
          <MetaItem label="Modality"   value={data.modality} />
          <MetaItem label="Body Part"  value={data.bodyPart} />
          <MetaItem label="Study Date" value={data.studyDate} />
          <MetaItem label="Reviewer"   value={data.reviewer ?? '—'} />
          <MetaItem label="Package"    value={data.packageCode} />

          <Divider />

          <div>
            <p className="label-caption mb-1">Status</p>
            <StatusBadge status={data.status} />
          </div>
          <Divider />

          <Stat label="Confidence" value={data.confidence !== null ? data.confidence : '—'} />
          <Divider />

          <div>
            <p className="label-caption mb-1">Clinical Risk</p>
            {data.clinicalRisk !== null ? <RiskIndicator level={data.clinicalRisk} /> : <span className="text-small text-text-subtle">—</span>}
          </div>
          <Divider />

          <Stat label="Images"      value={data.totalImages} />
          <Divider />
          <Stat label="Consistency" value={data.consistencyScore !== null ? data.consistencyScore : '—'} />
        </div>
      </Surface>

      {data.keyFindings.length > 0 && (
        <Surface padding="compact">
          <p className="label-caption mb-3">Key Findings</p>
          <div className="flex flex-wrap gap-2">
            {data.keyFindings.map((finding, i) => (
              <span
                key={i}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 h-7 rounded-md border text-small',
                  finding.consistent
                    ? 'bg-success-bg border-success-border text-success-fg'
                    : 'bg-warning-bg border-warning-border text-warning-fg',
                )}
              >
                {finding.consistent ? <Check size={12} /> : <AlertTriangle size={12} />}
                <span>{finding.text}</span>
                {finding.note && <span className="opacity-70 italic">{finding.note}</span>}
              </span>
            ))}
          </div>
        </Surface>
      )}
    </div>
  );
}
