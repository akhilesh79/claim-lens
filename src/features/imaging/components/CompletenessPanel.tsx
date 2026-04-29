import { motion } from 'framer-motion';
import { FiClipboard } from 'react-icons/fi';
import { SectionContainer } from '@/components/ui';
import type { CompletenessInfo, ImageInventory } from '@/types/imaging';

interface Props {
  completeness: CompletenessInfo;
  imageInventory: ImageInventory;
  concerns: string[];
}

interface CheckItem {
  label: string;
  present: boolean;
}

function buildChecklist(c: CompletenessInfo): CheckItem[] {
  return [
    { label: 'Pre-procedure imaging', present: c.hasPreProcedureImaging },
    { label: 'Intra-procedure imaging', present: c.hasIntraProcedureImaging },
    { label: 'Post-procedure imaging', present: c.hasPostProcedureImaging },
    { label: 'Typed report', present: c.hasTypedReport },
    { label: 'Handwritten notes', present: c.hasHandwrittenNotes },
    { label: 'Signed stamp / physician signature', present: c.hasSignedStamp },
  ];
}

export function CompletenessPanel({ completeness, imageInventory, concerns }: Props) {
  const checklist = buildChecklist(completeness);
  const presentCount = checklist.filter((i) => i.present).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.35 }}
    >
      <SectionContainer title="Document Completeness" icon={<FiClipboard size={14} />} defaultOpen>
        <div className="pt-3 space-y-4">
          {/* Score bar */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Checklist score</span>
            <span className="font-semibold text-slate-300 tabular-nums">
              {presentCount}/{checklist.length}
            </span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(presentCount / checklist.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
              className={`h-full rounded-full ${
                presentCount === checklist.length
                  ? 'bg-emerald-500'
                  : presentCount >= checklist.length / 2
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-1.5">
            {checklist.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="flex items-center justify-between text-xs"
              >
                <span className={item.present ? 'text-slate-300' : 'text-slate-600'}>{item.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.present
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-red-400/70 bg-red-500/10'
                  }`}
                >
                  {item.present ? '✓ Present' : '✗ Missing'}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Image inventory */}
          <div className="pt-2 border-t border-white/[0.06]">
            <p className="section-label mb-2">Image Inventory</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(imageInventory.byType).map(([type, count]) => (
                <span
                  key={type}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-300"
                >
                  {type}
                  <span className="ml-1.5 text-slate-500">{count}</span>
                </span>
              ))}
            </div>
            {imageInventory.stagesPresent.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {imageInventory.stagesPresent.map((stage) => (
                  <span
                    key={stage}
                    className="text-[9px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full"
                  >
                    {stage}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Concerns */}
          {concerns.length > 0 && (
            <div className="pt-2 border-t border-white/[0.06]">
              <p className="section-label mb-2">Concerns / Gaps</p>
              <div className="space-y-1.5">
                {concerns.map((concern, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i }}
                    className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-amber-500/[0.05] border border-amber-500/15"
                  >
                    <span className="text-amber-400 flex-shrink-0 text-xs mt-0.5">⚠</span>
                    <p className="text-xs text-amber-300/90 leading-relaxed">{concern}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {completeness.notes && (
            <p className="text-[10px] text-slate-600 italic pt-1">{completeness.notes}</p>
          )}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
