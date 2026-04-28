import { motion } from 'framer-motion';
import { SectionContainer, Tooltip } from '@/components/ui';
import type { DocumentInventory as TDocumentInventory } from '@/types/claims';

interface Props {
  inventory: TDocumentInventory;
}

export function DocumentInventory({ inventory }: Props) {
  const present = inventory.documents.filter((d) => d.present).length;
  const total = inventory.documents.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.18 }}
    >
      <SectionContainer
        title="Document Inventory"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        }
        headerExtra={
          <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
            {present}/{total}
          </span>
        }
        defaultOpen
      >
        <div className="space-y-1.5 pt-3">
          {inventory.documents.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors
                ${doc.present
                  ? 'bg-white/[0.02] hover:bg-white/[0.04]'
                  : 'bg-red-500/[0.06] border border-red-500/15 hover:bg-red-500/[0.08]'
                }`}
            >
              <span className={`text-xs font-medium ${doc.present ? 'text-slate-300' : 'text-red-400'}`}>
                {doc.name}
              </span>
              <Tooltip content={doc.present ? 'Document present' : 'Document missing — required'}>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                    ${doc.present
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                    }`}
                >
                  {doc.present ? '✓' : '✗'}
                </span>
              </Tooltip>
            </motion.div>
          ))}
        </div>

        {/* Footer stats */}
        <div className="flex gap-3 mt-3 pt-3 border-t border-white/[0.06]">
          {inventory.duplicateDocs > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <span className="font-bold">{inventory.duplicateDocs}</span> duplicate docs
            </span>
          )}
          {inventory.lowQualityDocs > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
              <span className="font-bold">{inventory.lowQualityDocs}</span> low quality
            </span>
          )}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
