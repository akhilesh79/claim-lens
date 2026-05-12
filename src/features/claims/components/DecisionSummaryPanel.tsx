import { Surface, StatusBadge } from '@/ui';
import { ProgressBar } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { ClaimDecision } from '@/types/claims';
import type { RiskLevel } from '@/types/common';

interface Props {
  data: ClaimDecision;
}

const RISK_TONE: Record<RiskLevel, string> = {
  Low:      'text-success-fg bg-success-bg border-success-border',
  Medium:   'text-warning-fg bg-warning-bg border-warning-border',
  High:     'text-danger-fg  bg-danger-bg  border-danger-border',
  Critical: 'text-danger-fg  bg-danger-bg  border-danger-border',
};

export function DecisionSummaryPanel({ data }: Props) {
  const r = data.report;
  return (
    <Surface elevation={1} padding="default">
      <div className="flex flex-col xl:flex-row xl:items-start gap-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <p className="label-caption mb-1">Decision</p>
            <StatusBadge status={r.status} />
          </div>

          <div className="h-10 w-px bg-border hidden sm:block" />

          <div className="min-w-[80px]">
            <p className="label-caption mb-1">Confidence</p>
            <p className="num text-h2 text-text">{r.confidence}</p>
          </div>

          <div className="h-10 w-px bg-border hidden sm:block" />

          <div>
            <p className="label-caption mb-1">Risk</p>
            <span className={cn(
              'inline-flex items-center h-6 px-2 rounded-sm border text-caption',
              RISK_TONE[r.riskScore],
            )}>
              {r.riskScore}
            </span>
          </div>

          <div className="h-10 w-px bg-border hidden sm:block" />

          <div className="min-w-[180px]">
            <p className="label-caption mb-1">STG Compliance</p>
            <ProgressBar value={r.complianceScore} size="sm" color="auto" />
          </div>
        </div>

        <div className="hidden xl:block w-px self-stretch bg-border" />

        <div className="flex-1 min-w-0">
          <p className="label-caption mb-2">Key Findings</p>
          <ul className="space-y-1.5">
            {r.keyReasons.map((reason, i) => {
              const negative =
                reason.toLowerCase().includes('missing') ||
                reason.toLowerCase().includes('exceeded') ||
                reason.toLowerCase().includes('duplicate');
              return (
                <li key={i} className="flex items-start gap-2 text-body text-text-muted">
                  <span className={cn(
                    'mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0',
                    negative ? 'bg-warning-fg' : 'bg-success-fg',
                  )} />
                  {reason}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="label-caption mb-1">Claim ID</p>
          <p className="num text-text">{r.summary.id}</p>
          <p className="text-caption text-text-subtle mt-1">AI-Assisted Review</p>
        </div>
      </div>
    </Surface>
  );
}
