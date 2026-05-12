import { User } from 'lucide-react';
import { SectionContainer, InfoCard } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import type { ClaimSummary } from '@/types/claims';

interface Props {
  summary: ClaimSummary;
  className?: string;
}

const rows: { label: string; key: keyof ClaimSummary; format?: (v: unknown) => string }[] = [
  { label: 'Hospital', key: 'hospital' },
  { label: 'Admission Date', key: 'admissionDate' },
  { label: 'Discharge Date', key: 'dischargeDate' },
  { label: 'Length of Stay', key: 'lengthOfStay', format: (v) => `${v} days` },
  { label: 'Package Type', key: 'packageType' },
  { label: 'Diagnosis', key: 'diagnosis' },
  { label: 'Procedure', key: 'procedure' },
];

export function PatientClaimCard({ summary, className }: Props) {
  const initials = summary.patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div className={className}>
      <SectionContainer title="Patient & Claim Summary" icon={<User size={14} />} defaultOpen>
        <div className="flex items-center gap-3 pt-3 pb-4 border-b border-border mb-4">
          <div className="h-10 w-10 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-body-strong flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-body-strong text-text truncate">{summary.patient.name}</p>
            <p className="text-small text-text-subtle">
              {summary.patient.age} yrs · {summary.patient.gender}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="label-caption">Amount</p>
            <p className="num text-text">{formatCurrency(summary.claimedAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {rows.map(({ label, key, format }) => (
            <InfoCard
              key={label}
              label={label}
              value={format ? format(summary[key]) : String(summary[key])}
            />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
