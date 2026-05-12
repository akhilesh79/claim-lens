import { ClipboardList } from 'lucide-react';
import { SectionContainer, ProgressBar, DataTable } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import { Badge } from '@/ui';
import type { STGRule } from '@/types/claims';
import type { RuleStatus } from '@/types/common';

interface Props {
  rules: STGRule[];
  complianceScore: number;
  className?: string;
}

const STATUS_TONE: Record<RuleStatus, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  pass: { tone: 'success', label: 'Pass' },
  warn: { tone: 'warning', label: 'Review' },
  fail: { tone: 'danger',  label: 'Fail' },
};

export function STGComplianceTable({ rules, complianceScore, className }: Props) {
  const columns: TableColumn<STGRule>[] = [
    { key: 'rule',     header: 'Rule',     render: (r) => <span className="text-body-strong text-text">{r.rule}</span> },
    { key: 'expected', header: 'Expected', render: (r) => <span className="text-body text-text-muted">{r.expected}</span> },
    {
      key: 'observed',
      header: 'Observed',
      render: (r) => (
        <span className={
          r.status === 'fail' ? 'text-danger-fg text-body-strong'
          : r.status === 'warn' ? 'text-warning-fg text-body-strong'
          : 'text-text text-body'
        }>
          {r.observed}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (r) => <Badge tone={STATUS_TONE[r.status].tone}>{STATUS_TONE[r.status].label}</Badge>,
    },
  ];

  return (
    <div className={className}>
      <SectionContainer title="STG Compliance Engine" icon={<ClipboardList size={14} />} defaultOpen>
        <div className="pt-3">
          <DataTable
            columns={columns}
            data={rules}
            rowHighlight={(r) => r.status === 'fail'}
            footer={<ProgressBar value={complianceScore} label="Compliance Score" color="auto" size="md" />}
          />
        </div>
      </SectionContainer>
    </div>
  );
}
