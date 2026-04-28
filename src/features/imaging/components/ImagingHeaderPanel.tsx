import { motion } from 'framer-motion';
import { StatusBadge, RiskIndicator, AnimatedCounter } from '@/components/ui';
import type { ImagingAnalysis } from '@/types/imaging';

interface Props {
  data: ImagingAnalysis;
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
        {[
          { label: 'Claim ID', value: data.claimId, mono: true },
          { label: 'Patient', value: data.patient },
          { label: 'Modality', value: data.modality },
          { label: 'Body Part', value: data.bodyPart },
          { label: 'Study Date', value: data.studyDate },
          { label: 'Reviewer', value: data.reviewer },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</span>
            <span className={`text-xs font-medium text-slate-200 ${item.mono ? 'font-mono text-blue-400' : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Summary panel */}
      <div className="glass-elevated rounded-2xl p-5">
        <div className="flex flex-col xl:flex-row xl:items-start gap-5">
          {/* Status */}
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={data.status} size="lg" />

            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />

            <div className="text-center min-w-[72px]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Confidence</p>
              <p className="text-2xl font-black text-white tabular-nums leading-none">
                <AnimatedCounter value={data.confidence} suffix="%" />
              </p>
            </div>

            <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />

            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Clinical Risk</p>
              <RiskIndicator level={data.clinicalRisk} />
            </div>
          </div>

          <div className="xl:w-px xl:self-stretch w-full h-px bg-white/[0.07]" />

          {/* Key findings */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Key Findings</p>
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
                    className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${finding.consistent ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  />
                  <span className={finding.consistent ? '' : 'text-amber-300/90'}>{finding.text}</span>
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
