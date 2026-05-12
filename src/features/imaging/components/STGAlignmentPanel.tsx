import { CheckSquare, Check, AlertTriangle, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { SectionContainer, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { STGAlignment } from '@/types/imaging';
import type { RuleStatus } from '@/types/common';

interface Props {
  stgAlignment: STGAlignment;
}

const STATUS: Record<RuleStatus, { icon: ReactNode; cls: string }> = {
  pass: { icon: <Check size={12} />,        cls: 'bg-success-bg text-success-fg border-success-border' },
  warn: { icon: <AlertTriangle size={12} />, cls: 'bg-warning-bg text-warning-fg border-warning-border' },
  fail: { icon: <X size={12} />,             cls: 'bg-danger-bg  text-danger-fg  border-danger-border'  },
};

export function STGAlignmentPanel({ stgAlignment }: Props) {
  return (
    <SectionContainer title="STG Alignment" icon={<CheckSquare size={14} />} defaultOpen>
      <div className="pt-3 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-info-bg border border-info-border">
          <span className="label-caption text-info-fg flex-shrink-0">Claimed Package</span>
          <span className="text-body-strong text-info-fg ml-auto">{stgAlignment.claimedPackage}</span>
        </div>

        <div>
          <p className="label-caption mb-2">Evidence Required by STG</p>
          {stgAlignment.items.length > 0 ? (
            <ul className="space-y-1.5">
              {stgAlignment.items.map((item, i) => {
                const cfg = STATUS[item.status];
                return (
                  <li
                    key={i}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-md border',
                      item.status === 'warn'
                        ? 'border-warning-border bg-warning-bg/40'
                        : 'border-border bg-surface',
                    )}
                  >
                    <span className={cn('text-body-strong', item.present ? 'text-text' : 'text-warning-fg')}>
                      {item.evidence}
                    </span>
                    <span className={cn('h-6 w-6 rounded-full grid place-items-center border flex-shrink-0', cfg.cls)}>
                      {cfg.icon}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-small text-text-subtle italic">No specific evidence requirements listed for this package</p>
          )}
        </div>

        {stgAlignment.complianceScore !== null && (
          <ProgressBar value={stgAlignment.complianceScore} label="STG Compliance Score" size="sm" color="auto" />
        )}
      </div>
    </SectionContainer>
  );
}
