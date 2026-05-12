import { useEffect, type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/ui';
import { cn } from '@/lib/cn';
import type { Status } from '@/types/common';
import { formatCurrency } from '@/utils/formatters';

interface CaseHeaderProps {
  patientName: string;
  patientId?: string;
  hospital?: string;
  claimId: string;
  amount: number;
  status: Status;
  aiConfidence?: number;
  onApprove?: () => void;
  onReject?: () => void;
  onConditional?: () => void;
  onQuery?: () => void;
}

interface FactProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
}
function Fact({ label, value, mono }: FactProps) {
  return (
    <div className='flex flex-col gap-0.5 min-w-0'>
      <span className='label-caption'>{label}</span>
      <span className={cn('text-body-strong text-text truncate', mono && 'font-mono text-small')}>{value}</span>
    </div>
  );
}

export function CaseHeader({
  patientName,
  patientId,
  hospital,
  claimId,
  amount,
  status,
  aiConfidence,
  onApprove,
  onReject,
  onConditional,
  onQuery,
}: CaseHeaderProps) {
  // Keyboard shortcuts: A approve, C conditional, R reject, Q query
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches('input, textarea, [contenteditable]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === 'a' && onApprove) {
        e.preventDefault();
        onApprove();
      }
      if (key === 'c' && onConditional) {
        e.preventDefault();
        onConditional();
      }
      if (key === 'r' && onReject) {
        e.preventDefault();
        onReject();
      }
      if (key === 'q' && onQuery) {
        e.preventDefault();
        onQuery();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onApprove, onReject, onConditional, onQuery]);

  return (
    <div className='sticky top-0 z-30 bg-surface border-b border-border'>
      <div className='px-6 py-3 flex items-center gap-6'>
        <Link
          to='/cases'
          className='text-text-subtle hover:text-text transition-colors duration-fast inline-flex items-center gap-1 text-small'
        >
          <ChevronLeft size={16} />
          Cases
        </Link>

        <div className='h-8 w-px bg-border' />

        <div className='flex items-center gap-6 flex-1 min-w-0 overflow-hidden'>
          <Fact label='Patient' value={patientName} />
          {patientId && <Fact label='Patient ID' value={patientId} mono />}
          {hospital && <Fact label='Hospital' value={hospital} />}
          <Fact label='Claim ID' value={claimId} mono />
          <Fact label='Amount' value={formatCurrency(amount)} mono />
          <Fact label='Status' value={<StatusBadge status={status} />} />
          {typeof aiConfidence === 'number' && <Fact label='AI Confidence' value={`${aiConfidence}`} mono />}
        </div>
      </div>
    </div>
  );
}
