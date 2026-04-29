import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
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

function hasContent(extraction: NLPExtraction): boolean {
  return (
    extraction.diagnosis !== null ||
    extraction.severity !== null ||
    extraction.findings.length > 0 ||
    extraction.extractionConfidence !== null
  );
}

function EmptyState() {
  return (
    <div className="py-4 flex flex-col items-center gap-2 text-center">
      <span className="text-2xl opacity-30">📄</span>
      <p className="text-xs text-slate-600">NLP extraction unavailable for this study</p>
      <p className="text-[10px] text-slate-700">Report text could not be parsed or was not provided</p>
    </div>
  );
}

export function NLPReportExtraction({ extraction }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
    >
      <SectionContainer title="Report NLP Extraction" icon={<FiFileText size={14} />} defaultOpen>
        <div className="pt-3">
          {!hasContent(extraction) ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Reported Diagnosis</p>
                  <p className="text-xs font-semibold text-slate-200">
                    {extraction.diagnosis ?? <span className="text-slate-600 font-normal">—</span>}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Reported Severity</p>
                  <p className="text-xs font-semibold text-amber-400">
                    {extraction.severity ?? <span className="text-slate-600 font-normal">—</span>}
                  </p>
                </div>
              </div>

              {extraction.findings.length > 0 && (
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
              )}

              {extraction.extractionConfidence !== null && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">Extraction Confidence</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${CONF_BADGE[extraction.extractionConfidence]}`}
                  >
                    {extraction.extractionConfidence}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
