import { ClipboardList, AlertTriangle } from 'lucide-react';
import { SectionContainer, ProgressBar } from '@/components/ui';
import { Badge } from '@/ui';
import type { CompletenessInfo, ImageInventory } from '@/types/imaging';

interface Props {
  completeness: CompletenessInfo;
  imageInventory: ImageInventory;
  concerns: string[];
}

function buildChecklist(c: CompletenessInfo) {
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
  const pct = Math.round((presentCount / checklist.length) * 100);

  return (
    <SectionContainer title="Document Completeness" icon={<ClipboardList size={14} />} defaultOpen>
      <div className="pt-3 space-y-4">
        <ProgressBar value={pct} label={`Checklist score (${presentCount}/${checklist.length})`} size="sm" color="auto" />

        <ul className="space-y-1.5">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center justify-between">
              <span className={item.present ? 'text-body text-text' : 'text-body text-text-subtle'}>{item.label}</span>
              <Badge tone={item.present ? 'success' : 'danger'}>
                {item.present ? 'Present' : 'Missing'}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="pt-3 border-t border-border">
          <p className="label-caption mb-2">Image Inventory</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(imageInventory.byType).map(([type, count]) => (
              <Badge key={type} tone="neutral">
                {type} <span className="text-text-subtle ml-1">{count}</span>
              </Badge>
            ))}
          </div>
          {imageInventory.stagesPresent.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {imageInventory.stagesPresent.map((stage) => (
                <Badge key={stage} tone="info">{stage}</Badge>
              ))}
            </div>
          )}
        </div>

        {concerns.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="label-caption mb-2">Concerns / Gaps</p>
            <ul className="space-y-1.5">
              {concerns.map((concern, i) => (
                <li key={i} className="flex items-start gap-2 px-3 py-2 rounded-md bg-warning-bg border border-warning-border">
                  <AlertTriangle size={14} className="text-warning-fg flex-shrink-0 mt-0.5" />
                  <p className="text-body text-warning-fg">{concern}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {completeness.notes && (
          <p className="text-small text-text-subtle italic pt-1">{completeness.notes}</p>
        )}
      </div>
    </SectionContainer>
  );
}
