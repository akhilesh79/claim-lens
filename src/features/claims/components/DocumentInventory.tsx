import { FileText, Check, X } from 'lucide-react';
import { SectionContainer } from '@/components/ui';
import { Badge } from '@/ui';
import { cn } from '@/lib/cn';
import type { DocumentInventory as TDocumentInventory } from '@/types/claims';

interface Props {
  inventory: TDocumentInventory;
  className?: string;
}

export function DocumentInventory({ inventory, className }: Props) {
  const present = inventory.documents.filter((d) => d.present).length;
  const total   = inventory.documents.length;

  return (
    <div className={className}>
      <SectionContainer
        title="Document Inventory"
        icon={<FileText size={14} />}
        headerExtra={<span className="num text-text-subtle">{present}/{total}</span>}
        defaultOpen
      >
        <ul className="space-y-1.5 pt-3">
          {inventory.documents.map((doc) => (
            <li
              key={doc.name}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-md border',
                doc.present
                  ? 'bg-surface border-border'
                  : 'bg-danger-bg border-danger-border',
              )}
            >
              <span className={cn('text-body-strong', doc.present ? 'text-text' : 'text-danger-fg')}>
                {doc.name}
              </span>
              <span
                aria-label={doc.present ? 'Present' : 'Missing'}
                className={cn(
                  'h-5 w-5 rounded-full grid place-items-center border',
                  doc.present
                    ? 'bg-success-bg text-success-fg border-success-border'
                    : 'bg-danger-bg  text-danger-fg  border-danger-border',
                )}
              >
                {doc.present ? <Check size={12} /> : <X size={12} />}
              </span>
            </li>
          ))}
        </ul>

        {(inventory.duplicateDocs > 0 || inventory.lowQualityDocs > 0) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            {inventory.duplicateDocs > 0 && (
              <Badge tone="warning">{inventory.duplicateDocs} duplicate</Badge>
            )}
            {inventory.lowQualityDocs > 0 && (
              <Badge tone="warning">{inventory.lowQualityDocs} low quality</Badge>
            )}
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
