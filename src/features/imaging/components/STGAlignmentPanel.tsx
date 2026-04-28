import { motion } from 'framer-motion';
import { SectionContainer, ProgressBar } from '@/components/ui';
import type { STGAlignment } from '@/types/imaging';
import type { RuleStatus } from '@/types/common';

interface Props {
  stgAlignment: STGAlignment;
}

const STATUS_ICON: Record<RuleStatus, { icon: string; cls: string }> = {
  pass: { icon: '✓', cls: 'bg-emerald-500/15 text-emerald-400' },
  warn: { icon: '⚠', cls: 'bg-amber-500/15 text-amber-400' },
  fail: { icon: '✗', cls: 'bg-red-500/15 text-red-400' },
};

export function STGAlignmentPanel({ stgAlignment }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.33 }}
    >
      <SectionContainer
        title="STG Alignment"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        }
        defaultOpen
      >
        <div className="pt-3 space-y-3">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/15">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider flex-shrink-0">Claimed Package</span>
            <span className="text-xs font-semibold text-blue-300 ml-auto">{stgAlignment.claimedPackage}</span>
          </div>

          <div>
            <p className="section-label mb-2">Evidence Required by STG</p>
            <div className="space-y-1.5">
              {stgAlignment.items.map((item, i) => {
                const cfg = STATUS_ICON[item.status];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-colors ${
                      item.status === 'warn'
                        ? 'border-amber-500/15 bg-amber-500/[0.04]'
                        : 'border-white/[0.05] hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className={`text-xs font-medium ${item.present ? 'text-slate-200' : 'text-amber-300/80'}`}>
                      {item.evidence}
                    </span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${cfg.cls}`}>
                      {cfg.icon}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <ProgressBar
            value={stgAlignment.complianceScore}
            label="STG Compliance Score"
            size="sm"
            color="auto"
            delay={0.5}
          />
        </div>
      </SectionContainer>
    </motion.div>
  );
}
