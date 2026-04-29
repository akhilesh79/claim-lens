import { motion } from 'framer-motion';
import { StatusBadge, RiskIndicator, AnimatedCounter } from '@/components/ui';
import type { ImagingAnalysis } from '@/types/imaging';

interface Props {
  data: ImagingAnalysis;
}

function MetaItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <span className={`text-xs font-medium text-slate-200 ${mono ? 'font-mono text-blue-400' : ''}`}>
        {value}
      </span>
    </div>
  );
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
      className="space-y-3"
    >
      {/* Metadata bar */}
      <div className="glass rounded-2xl px-5 py-3 flex flex-wrap items-center gap-4">
        <MetaItem label="Claim ID" value={data.claimId} mono />
        <MetaItem label="Patient" value={patientLabel(data)} />
        <MetaItem label="Modality" value={data.modality} />
        <MetaItem label="Body Part" value={data.bodyPart} />
        <MetaItem label="Study Date" value={data.studyDate} />
        <MetaItem label="Reviewer" value={data.reviewer ?? '—'} />
        <MetaItem label="Package" value={data.packageCode} />
      </div>

      {/* Summary panel */}
      <div className="glass-elevated rounded-2xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-start gap-5">
          {/* Status metrics */}
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={data.status} size="lg" />

            <div className="h-8 w-px border-l border-white/[0.08] hidden sm:block" />

            <div className="text-center min-w-[72px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Confidence</p>
              {data.confidence !== null ? (
                <p className="text-2xl font-black text-white tabular-nums leading-none font-heading">
                  <AnimatedCounter value={data.confidence} suffix="%" />
                </p>
              ) : (
                <p className="text-lg font-bold text-slate-600">—</p>
              )}
            </div>

            <div className="h-8 w-px border-l border-white/[0.08] hidden sm:block" />

            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Clinical Risk</p>
              {data.clinicalRisk !== null ? (
                <RiskIndicator level={data.clinicalRisk} />
              ) : (
                <span className="text-xs text-slate-600">—</span>
              )}
            </div>

            <div className="h-8 w-px border-l border-white/[0.08] hidden sm:block" />

            <div className="text-center min-w-[60px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Images</p>
              <p className="text-2xl font-black text-white tabular-nums leading-none font-heading">
                {data.totalImages}
              </p>
            </div>
          </div>

          <div className="xl:w-px xl:self-stretch w-full h-px border-t xl:border-t-0 xl:border-l border-white/[0.07]" />

          {/* Key findings */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Key Findings</p>
            {data.keyFindings.length > 0 ? (
              <ul className="space-y-2">
                {data.keyFindings.map((finding, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span
                      className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        finding.consistent ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className={finding.consistent ? '' : 'text-amber-300/90'}>{finding.text}</span>
                    {finding.note && (
                      <span className="ml-1 text-[10px] text-slate-500 italic">{finding.note}</span>
                    )}
                    <span className="ml-auto flex-shrink-0 text-[10px]">
                      {finding.consistent ? (
                        <span className="text-emerald-500">✓</span>
                      ) : (
                        <span className="text-amber-400">⚠</span>
                      )}
                    </span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-600 italic">No key findings available</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
