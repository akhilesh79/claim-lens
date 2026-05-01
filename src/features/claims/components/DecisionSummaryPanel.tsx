import { motion } from 'framer-motion';
import { AnimatedCounter, StatusBadge, RiskIndicator, ProgressBar } from '@/components/ui';
import type { ClaimDecision } from '@/types/claims';

interface Props {
  data: ClaimDecision;
}

export function DecisionSummaryPanel({ data }: Props) {
  const report = data.report;
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-elevated rounded-2xl p-5"
    >
      <div className="flex flex-col xl:flex-row xl:items-start gap-5">
        {/* Status block */}
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={report.status} size="lg" />

          <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />

          <div className="text-center min-w-[72px]">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Confidence</p>
            <p className="text-2xl font-black text-white tabular-nums leading-none">
              <AnimatedCounter value={report.confidence} suffix="%" />
            </p>
          </div>

          <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />

          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Risk Score</p>
            <RiskIndicator level={report.riskScore} />
          </div>

          <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />

          <div className="min-w-[160px]">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">STG Compliance</p>
            <ProgressBar value={report.complianceScore} size="sm" color="auto" delay={0.5} />
          </div>
        </div>

        {/* Divider */}
        <div className="xl:w-px xl:self-stretch w-full h-px bg-white/[0.07]" />

        {/* Key Reasons */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Key Findings</p>
          <ul className="space-y-2">
            {report.keyReasons.map((reason, i) => {
              const isNegative =
                reason.toLowerCase().includes('missing') ||
                reason.toLowerCase().includes('exceeded') ||
                reason.toLowerCase().includes('duplicate');
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-2.5 text-xs text-slate-300"
                >
                  <span
                    className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isNegative ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  />
                  {reason}
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Claim ID */}
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Claim ID</p>
          <p className="font-mono text-sm font-semibold text-blue-400">{report.summary.id}</p>
          <p className="text-xs text-slate-600 mt-0.5">AI-Assisted Review</p>
        </div>
      </div>
    </motion.div>
  );
}
