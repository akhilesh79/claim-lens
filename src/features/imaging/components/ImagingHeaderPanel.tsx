import { motion } from 'framer-motion';
import { StatusBadge, RiskIndicator, AnimatedCounter } from '@/components/ui';
import type { ImagingAnalysis } from '@/types/imaging';

interface Props {
  data: ImagingAnalysis;
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className='flex flex-col gap-0.5'>
      <span className='text-[9px] font-semibold uppercase tracking-wider text-slate-500'>{label}</span>
      <span className={`text-xs font-medium text-slate-200 ${mono ? 'font-mono text-blue-400' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className='h-8 w-px border-l border-white/[0.08] hidden sm:block flex-shrink-0' />;
}

function patientLabel(data: ImagingAnalysis): string {
  const parts = [data.patient.name];
  if (data.patient.age) parts.push(data.patient.age);
  if (data.patient.sex) parts.push(data.patient.sex);
  return parts.join(' · ');
}

export function ImagingHeaderPanel({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='space-y-3'
    >
      {/* ── Row 1: Metadata + Status combined ───────────────── */}
      <div className='glass-elevated rounded-2xl px-6 py-4 flex flex-wrap items-center gap-x-5 gap-y-3'>
        {/* Meta items */}
        <MetaItem label='Claim ID' value={data.claimId} mono />
        <MetaItem label='Patient' value={patientLabel(data)} />
        <MetaItem label='Modality' value={data.modality} />
        <MetaItem label='Body Part' value={data.bodyPart} />
        <MetaItem label='Study Date' value={data.studyDate} />
        <MetaItem label='Reviewer' value={data.reviewer ?? '—'} />
        <MetaItem label='Package' value={data.packageCode} />

        {/* Separator */}
        <div className='hidden sm:block h-8 w-px border-l border-white/[0.10] flex-shrink-0 mx-1' />

        {/* Status metrics */}
        <StatusBadge status={data.status} size='lg' />
        <Divider />

        <div className='text-center min-w-[56px]'>
          <p className='text-[10px] text-slate-500 uppercase tracking-wider mb-0.5'>Confidence</p>
          {data.confidence !== null ? (
            <p className='text-2xl font-black text-white tabular-nums leading-none font-heading'>
              <AnimatedCounter value={data.confidence} suffix='%' />
            </p>
          ) : (
            <p className='text-lg font-bold text-slate-600'>—</p>
          )}
        </div>

        <Divider />

        <div>
          <p className='text-[10px] text-slate-500 uppercase tracking-wider mb-1'>Clinical Risk</p>
          {data.clinicalRisk !== null ? (
            <RiskIndicator level={data.clinicalRisk} />
          ) : (
            <span className='text-xs text-slate-600'>—</span>
          )}
        </div>

        <Divider />

        <div className='text-center min-w-[48px]'>
          <p className='text-[10px] text-slate-500 uppercase tracking-wider mb-0.5'>Images</p>
          <p className='text-2xl font-black text-white tabular-nums leading-none font-heading'>
            {data.totalImages}
          </p>
        </div>

        <Divider />

        <div className='text-center min-w-[48px]'>
          <p className='text-[10px] text-slate-500 uppercase tracking-wider mb-0.5'>Consistency</p>
          {data.consistencyScore !== null ? (
            <p className='text-2xl font-black text-white tabular-nums leading-none font-heading'>
              <AnimatedCounter value={data.consistencyScore} suffix='%' />
            </p>
          ) : (
            <p className='text-lg font-bold text-slate-600'>—</p>
          )}
        </div>
      </div>

      {/* ── Row 3: Key findings — full width ─────────────────── */}
      {data.keyFindings.length > 0 && (
        <div className='glass rounded-2xl px-5 py-3.5'>
          <p className='text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3'>Key Findings</p>
          <div className='flex flex-wrap gap-2'>
            {data.keyFindings.map((finding, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + i * 0.06 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${
                  finding.consistent
                    ? 'bg-emerald-500/[0.07] border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/[0.07] border-amber-500/20 text-amber-400'
                }`}
              >
                <span className='text-[10px]'>{finding.consistent ? '✓' : '⚠'}</span>
                <span>{finding.text}</span>
                {finding.note && (
                  <span className='text-[10px] opacity-60 italic'>{finding.note}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
