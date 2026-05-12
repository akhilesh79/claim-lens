import { BookOpen, Sparkles, FileText } from 'lucide-react';
import { SectionContainer } from '@/components/ui';

interface Props {
  narrative: string | null;
  modelId: string;
}

export function ClinicalNarrativePanel({ narrative }: Props) {
  return (
    <SectionContainer title="Clinical Narrative" icon={<BookOpen size={14} />} defaultOpen>
      {narrative ? (
        <div className="pt-3 space-y-3">
          <div className="p-3 rounded-md bg-surface border border-border">
            <p className="text-body text-text-muted leading-relaxed">{narrative}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-caption text-success-fg">
            <Sparkles size={12} />
            AI Generated
          </span>
        </div>
      ) : (
        <div className="pt-3 flex flex-col items-center justify-center py-8 gap-2 text-center">
          <FileText size={24} className="text-text-subtle" />
          <p className="text-small text-text-subtle">No clinical narrative generated</p>
        </div>
      )}
    </SectionContainer>
  );
}
