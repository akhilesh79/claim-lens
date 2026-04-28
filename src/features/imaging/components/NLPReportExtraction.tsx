import { motion } from 'framer-motion';
import { SectionContainer } from '@/components/ui';
import type { NLPExtraction } from '@/types/imaging';
import type { ExtractionConfidence } from '@/types/common';

interface Props {
  extraction: NLPExtraction;
}

const CONF_BADGE: Record<ExtractionConfidence, string> = {
  High: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  Low: 'text-red-400 bg-red-500/10 border-red-500/25',
};

export function NLPReportExtraction({ extraction }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      <SectionContainer
        title="Report NLP Extraction"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        }
        defaultOpen
      >
        <div className="space-y-3 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Reported Diagnosis</p>
              <p className="text-xs font-semibold text-slate-200">{extraction.diagnosis}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Reported Severity</p>
              <p className="text-xs font-semibold text-amber-400">{extraction.severity}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Reported Findings</p>
            <div className="space-y-1.5">
              {extraction.findings.map((finding, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.08 * i }}
                  className="flex items-center gap-2 text-xs text-slate-300"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                  {finding}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">Extraction Confidence</span>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${CONF_BADGE[extraction.extractionConfidence]}`}
            >
              {extraction.extractionConfidence}
            </span>
          </div>
        </div>
      </SectionContainer>
    </motion.div>
  );
}
