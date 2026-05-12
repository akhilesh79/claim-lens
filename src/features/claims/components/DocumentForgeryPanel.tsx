import { Shield, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { SectionContainer } from '@/components/ui';
import { Badge } from '@/ui';
import { cn } from '@/lib/cn';
import type { ForgeryFileResult } from '@/types/forgery';

interface Props {
  results: ForgeryFileResult[];
  onSelect: (result: ForgeryFileResult) => void;
  className?: string;
}

const CATEGORY_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  C10: 'success',
  C1:  'danger',
  C2:  'warning',
  C3:  'danger',
  C4:  'warning',
};

const fileExt = (name: string) => (name.split('.').pop() ?? 'FILE').toUpperCase();
const totalDetections = (r: ForgeryFileResult) => r.pages.reduce((s, p) => s + p.detections.length, 0);
const isClean = (r: ForgeryFileResult) => totalDetections(r) === 0;

function dominantCategories(r: ForgeryFileResult): { id: string; label: string }[] {
  const seen = new Map<string, string>();
  r.pages.forEach((p) => {
    if (p.Category_ID !== 'C10') {
      p.category_labels.forEach((label) => seen.set(p.Category_ID, label));
    }
  });
  return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
}

function FileCard({ result, onSelect }: { result: ForgeryFileResult; onSelect: () => void }) {
  const clean      = isClean(result);
  const detections = totalDetections(result);
  const categories = dominantCategories(result);
  const ext        = fileExt(result.fileName);

  return (
    <button
      onClick={onSelect}
      className={cn(
        'group text-left w-full p-4 rounded-lg border bg-surface',
        'transition-shadow duration-fast hover:shadow-elev-2',
        clean ? 'border-border' : 'border-danger-border',
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 h-9 w-9 rounded-md bg-surface-muted border border-border grid place-items-center">
          <span className="text-caption text-text-subtle">{ext}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body-strong text-text truncate" title={result.fileName}>
            {result.fileName}
          </p>
          <p className="text-small text-text-subtle mt-0.5">
            {result.totalPages} {result.totalPages === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      {clean ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-success-bg border border-success-border text-success-fg">
          <Check size={14} />
          <span className="text-small font-medium">No forgery detected</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-danger-bg border border-danger-border text-danger-fg">
            <AlertTriangle size={14} />
            <span className="text-small font-medium">
              {detections} detection{detections !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map(({ id, label }) => (
              <Badge key={id} tone={CATEGORY_TONE[id] ?? 'danger'}>{label}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-small text-text-subtle">
          {result.pages.filter((p) => p.detections.length > 0).length} / {result.pages.length} pages flagged
        </span>
        <span className="text-small text-brand-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-fast">
          View details <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
}

export function DocumentForgeryPanel({ results, onSelect, className = '' }: Props) {
  const totalFlags = results.reduce((s, r) => s + totalDetections(r), 0);
  const badge = totalFlags > 0
    ? <Badge tone="danger">{totalFlags} issue{totalFlags !== 1 ? 's' : ''}</Badge>
    : <Badge tone="success">All clean</Badge>;

  return (
    <div className={className}>
      <SectionContainer
        title="Document Forgery Detection"
        icon={<Shield size={14} />}
        badge={badge}
        defaultOpen
        maxH="none"
      >
        {results.length === 0 ? (
          <p className="text-small text-text-subtle italic py-2">No documents were analysed for forgery.</p>
        ) : (
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {results.map((r) => (
              <FileCard key={r.fileName} result={r} onSelect={() => onSelect(r)} />
            ))}
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
