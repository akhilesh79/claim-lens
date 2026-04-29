import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { SectionContainer, ProgressBar } from '@/components/ui';
import type { CorrelationRow } from '@/types/imaging';
import type { MatchStatus } from '@/types/common';

interface Props {
  rows: CorrelationRow[];
}

function BoolCell({ value, text }: { value: boolean | null; text?: string }) {
  if (text) return <span className="text-xs font-medium text-amber-300">{text}</span>;
  if (value === null) return <span className="text-slate-600 text-xs">—</span>;
  return (
    <span className={`text-sm font-bold ${value ? 'text-emerald-400' : 'text-red-400'}`}>
      {value ? '✓' : '✗'}
    </span>
  );
}

const MATCH_BADGE: Record<MatchStatus, { label: string; cls: string }> = {
  match: { label: '✓ Match', cls: 'text-emerald-400 bg-emerald-500/10' },
  mismatch: { label: '✗ Mismatch', cls: 'text-red-400 bg-red-500/10 mismatch-cell' },
  partial: { label: '⚠ Partial', cls: 'text-amber-400 bg-amber-500/10' },
};

const consistencyScore = 72;

export function FindingCorrelationTable({ rows }: Props) {
  const matches = rows.filter((r) => r.match === 'match').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 }}
    >
      <SectionContainer
        title="Finding Correlation"
        icon={<FiCheckCircle size={14} />}
        defaultOpen
      >
        <div className="pt-3 overflow-x-auto">
          <table className="w-full text-xs min-w-[340px]">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Finding', 'Image AI', 'Report', 'Match'].map((h) => (
                  <th key={h} className="pb-2.5 pr-2 first:pl-0 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.finding}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className={`border-b border-white/[0.04] last:border-0 transition-colors
                    ${row.match === 'mismatch' ? 'bg-red-500/[0.04]' : 'hover:bg-white/[0.02]'}`}
                >
                  <td className="py-2.5 pr-2 font-medium text-slate-200">{row.finding}</td>
                  <td className="py-2.5 pr-2 text-center">
                    <BoolCell value={row.imageAI} text={row.aiValue} />
                  </td>
                  <td className="py-2.5 pr-2 text-center">
                    <BoolCell value={row.report} text={row.reportValue} />
                  </td>
                  <td className="py-2.5">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${MATCH_BADGE[row.match].cls}`}>
                      {MATCH_BADGE[row.match].label}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Matched findings</span>
              <span className="text-slate-300 font-semibold tabular-nums">{matches}/{rows.length}</span>
            </div>
            <ProgressBar value={consistencyScore} label="Consistency Score" size="sm" color="auto" delay={0.5} />
          </div>
        </div>
      </SectionContainer>
    </motion.div>
  );
}
