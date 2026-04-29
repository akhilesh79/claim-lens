import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { SectionContainer, InfoCard } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import type { ClaimSummary } from '@/types/claims';

interface Props {
  summary: ClaimSummary;
}

const rows: { label: string; key: keyof ClaimSummary; format?: (v: unknown) => string }[] = [
  { label: 'Hospital', key: 'hospital' },
  { label: 'Admission Date', key: 'admissionDate' },
  { label: 'Discharge Date', key: 'dischargeDate' },
  { label: 'Length of Stay', key: 'lengthOfStay', format: (v) => `${v} days` },
  { label: 'Package Type', key: 'packageType' },
  { label: 'Diagnosis', key: 'diagnosis' },
  { label: 'Procedure', key: 'procedure' },
  { label: 'Claimed Amount', key: 'claimedAmount', format: (v) => formatCurrency(v as number) },
];

export function PatientClaimCard({ summary }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <SectionContainer
        title="Patient & Claim Summary"
        icon={<FiUser size={14} />}
        defaultOpen
      >
        {/* Patient name hero */}
        <div className="flex items-center gap-3 pt-3 pb-4 border-b border-white/[0.06] mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {summary.patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{summary.patient.name}</p>
            <p className="text-xs text-slate-500">
              {summary.patient.age} yrs · {summary.patient.gender}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] text-slate-600 uppercase tracking-wide">Amount</p>
            <p className="text-sm font-bold text-emerald-400 font-mono">
              {formatCurrency(summary.claimedAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {rows.slice(0, -1).map(({ label, key, format }) => (
            <InfoCard
              key={label}
              label={label}
              value={format ? format(summary[key]) : String(summary[key])}
            />
          ))}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
