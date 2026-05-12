import { CheckCircle2, Check, X } from 'lucide-react';
import { SectionContainer, ProgressBar } from '@/components/ui';
import { Badge } from '@/ui';
import type { CorrelationRow } from '@/types/imaging';
import type { MatchStatus } from '@/types/common';

interface Props {
  rows: CorrelationRow[];
  consistencyScore: number | null;
}

function BoolCell({ value, text }: { value: boolean | null; text?: string }) {
  if (text) return <span className="text-body-strong text-warning-fg">{text}</span>;
  if (value === null) return <span className="text-text-subtle text-small">—</span>;
  return value
    ? <Check size={16} className="text-success-fg inline" />
    : <X     size={16} className="text-danger-fg inline" />;
}

const MATCH: Record<MatchStatus, { tone: 'success' | 'danger' | 'warning'; label: string }> = {
  match:    { tone: 'success', label: 'Match' },
  mismatch: { tone: 'danger',  label: 'Mismatch' },
  partial:  { tone: 'warning', label: 'Partial' },
};

export function FindingCorrelationTable({ rows, consistencyScore }: Props) {
  const matches = rows.filter((r) => r.match === 'match').length;

  return (
    <SectionContainer title="Finding Correlation" icon={<CheckCircle2 size={14} />} defaultOpen>
      <div className="pt-3 overflow-x-auto">
        {rows.length > 0 ? (
          <table className="w-full border-collapse min-w-[340px]">
            <thead className="bg-surface-muted">
              <tr className="border-b border-border">
                {['Finding', 'Image AI', 'Report', 'Match'].map((h) => (
                  <th key={h} className="h-10 px-3 first:pl-4 last:pr-4 label-caption text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={`${row.finding}-${i}`}
                  className={
                    row.match === 'mismatch'
                      ? 'border-b border-border last:border-0 bg-danger-bg/40'
                      : 'border-b border-border last:border-0 hover:bg-surface-muted'
                  }
                >
                  <td className="py-2.5 px-3 first:pl-4 text-body-strong text-text">{row.finding}</td>
                  <td className="py-2.5 px-3 text-center">
                    <BoolCell value={row.imageAI} text={row.aiValue} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <BoolCell value={row.report} text={row.reportValue} />
                  </td>
                  <td className="py-2.5 px-3 last:pr-4">
                    <Badge tone={MATCH[row.match].tone}>{MATCH[row.match].label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-small text-text-subtle italic py-2">No correlation data available</p>
        )}

        <div className="mt-4 pt-3 border-t border-border space-y-2">
          <div className="flex justify-between text-small">
            <span className="text-text-subtle">Matched findings</span>
            <span className="num text-text">{matches}/{rows.length}</span>
          </div>
          {consistencyScore !== null && (
            <ProgressBar value={consistencyScore} label="Consistency Score" size="sm" color="auto" />
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
