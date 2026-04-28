import { motion } from 'framer-motion';
import { SectionContainer, ProgressBar } from '@/components/ui';
import type { AIFinding } from '@/types/imaging';

interface Props {
  findings: AIFinding[];
  imageQuality: string;
}

export function AIFindingsPanel({ findings, imageQuality }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.18 }}
    >
      <SectionContainer
        title="AI Clinical Findings"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        }
        defaultOpen
      >
        <div className="space-y-3 pt-3">
          {findings.map((finding, i) => (
            <motion.div
              key={finding.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className={`p-3 rounded-xl transition-colors ${
                finding.detected
                  ? 'bg-white/[0.03] hover:bg-white/[0.05]'
                  : 'bg-white/[0.015]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      finding.detected
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/[0.06] text-slate-600'
                    }`}
                  >
                    {finding.detected ? '!' : '–'}
                  </span>
                  <span className={`text-xs font-semibold ${finding.detected ? 'text-slate-200' : 'text-slate-600'}`}>
                    {finding.name}
                  </span>
                  {finding.severity && finding.detected && (
                    <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      {finding.severity}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold ${finding.detected ? 'text-red-400' : 'text-emerald-500'}`}>
                  {finding.detected ? 'Detected' : 'None'}
                </span>
              </div>
              {finding.detected && (
                <ProgressBar
                  value={finding.confidence}
                  size="xs"
                  color={finding.confidence > 80 ? 'red' : finding.confidence > 50 ? 'amber' : 'blue'}
                  showValue
                  delay={0.3 + i * 0.05}
                />
              )}
            </motion.div>
          ))}

          {/* Image quality */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall Image Quality</span>
            <span className={`font-semibold ${
              imageQuality === 'High' ? 'text-emerald-400' :
              imageQuality === 'Moderate' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {imageQuality}
            </span>
          </div>
        </div>
      </SectionContainer>
    </motion.div>
  );
}
