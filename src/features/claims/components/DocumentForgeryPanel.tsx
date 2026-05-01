import { FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { SectionContainer } from '@/components/ui';
import type { ForgeryFileResult } from '@/types/forgery';

interface Props {
  results: ForgeryFileResult[];
  onSelect: (result: ForgeryFileResult) => void;
  className?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  C10: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  C1:  { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20'     },
  C2:  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20'   },
  C3:  { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20'     },
  C4:  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20'   },
};

function categoryColor(id: string) {
  return CATEGORY_COLORS[id] ?? { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' };
}

function fileExt(name: string) {
  return (name.split('.').pop() ?? 'FILE').toUpperCase();
}

function totalDetections(result: ForgeryFileResult) {
  return result.pages.reduce((sum, p) => sum + p.detections.length, 0);
}

function isClean(result: ForgeryFileResult) {
  return totalDetections(result) === 0;
}

function dominantCategories(result: ForgeryFileResult): { id: string; label: string }[] {
  const seen = new Map<string, string>();
  result.pages.forEach((p) => {
    if (p.Category_ID !== 'C10') {
      p.category_labels.forEach((label) => seen.set(p.Category_ID, label));
    }
  });
  return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
}

function FileCard({ result, index, onSelect }: { result: ForgeryFileResult; index: number; onSelect: () => void }) {
  const clean      = isClean(result);
  const detections = totalDetections(result);
  const categories = dominantCategories(result);
  const ext        = fileExt(result.fileName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      onClick={onSelect}
      className={[
        'glass-sm rounded-xl p-4 cursor-pointer border transition-all duration-200 group',
        'hover:bg-white/[0.04] hover:border-white/[0.12]',
        clean ? 'border-emerald-500/15' : 'border-red-500/15',
      ].join(' ')}
    >
      {/* File header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
          <span className="text-[9px] font-bold font-heading text-slate-400">{ext}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-200 truncate" title={result.fileName}>
            {result.fileName}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {result.totalPages} {result.totalPages === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      {/* Status */}
      {clean ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
          <span className="text-emerald-400 text-xs">✓</span>
          <span className="text-[11px] font-semibold text-emerald-400">No Forgery Detected</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/15">
            <span className="text-red-400 text-xs">⚠</span>
            <span className="text-[11px] font-semibold text-red-400">
              {detections} detection{detections !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map(({ id, label }) => {
              const c = categoryColor(id);
              return (
                <span key={id} className={`text-[10px] font-medium px-2 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* View details link */}
      <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] text-slate-500">
          {result.pages.filter((p) => p.detections.length > 0).length} / {result.pages.length} pages flagged
        </span>
        <span className="text-[11px] font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
          View details →
        </span>
      </div>
    </motion.div>
  );
}

export function DocumentForgeryPanel({ results, onSelect, className = '' }: Props) {
  const totalFlags = results.reduce((s, r) => s + totalDetections(r), 0);
  const badge = totalFlags > 0
    ? <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5">{totalFlags} issue{totalFlags !== 1 ? 's' : ''}</span>
    : <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">All Clean</span>;

  return (
    <div className={className}>
      <SectionContainer
        title="Document Forgery Detection"
        icon={<FiShield size={14} />}
        badge={badge}
        defaultOpen
        maxH="none"
      >
        {results.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No documents were analysed for forgery.</p>
        ) : (
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {results.map((r, i) => (
              <FileCard key={r.fileName} result={r} index={i} onSelect={() => onSelect(r)} />
            ))}
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
