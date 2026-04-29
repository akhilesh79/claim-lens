import { motion } from 'framer-motion';
import { FiClipboard } from 'react-icons/fi';
import { SectionContainer, ProgressBar, DataTable } from '@/components/ui';
import type { TableColumn } from '@/components/ui';
import type { STGRule } from '@/types/claims';
import type { RuleStatus } from '@/types/common';

interface Props {
  rules: STGRule[];
  complianceScore: number;
  className?: string;
}

const STATUS_CELL: Record<RuleStatus, { icon: string; label: string; cls: string }> = {
  pass: { icon: '✓', label: 'Pass', cls: 'text-emerald-400 bg-emerald-500/10' },
  warn: { icon: '⚠', label: 'Review', cls: 'text-amber-400 bg-amber-500/10' },
  fail: { icon: '✗', label: 'Fail', cls: 'text-red-400 bg-red-500/10' },
};

export function STGComplianceTable({ rules, complianceScore, className }: Props) {
  const columns: TableColumn<STGRule>[] = [
    {
      key: 'rule',
      header: 'Rule',
      render: (row) => <span className="text-xs font-medium text-slate-200">{row.rule}</span>,
    },
    {
      key: 'expected',
      header: 'Expected',
      render: (row) => <span className="text-xs text-slate-400">{row.expected}</span>,
    },
    {
      key: 'observed',
      header: 'Observed',
      render: (row) => (
        <span
          className={`text-xs font-medium ${
            row.status === 'fail'
              ? 'text-red-400'
              : row.status === 'warn'
              ? 'text-amber-400'
              : 'text-slate-300'
          }`}
        >
          {row.observed}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => {
        const cfg = STATUS_CELL[row.status];
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className={`flex flex-col ${className ?? ''}`}
    >
      <SectionContainer
        title="STG Compliance Engine"
        icon={<FiClipboard size={14} />}
        defaultOpen
      >
        <div className="pt-3">
          <DataTable
            columns={columns}
            data={rules}
            rowHighlight={(row) => row.status === 'fail'}
            footer={
              <div>
                <ProgressBar
                  value={complianceScore}
                  label="Compliance Score"
                  color="auto"
                  size="md"
                  delay={0.5}
                />
              </div>
            }
          />
        </div>
      </SectionContainer>
    </motion.div>
  );
}
