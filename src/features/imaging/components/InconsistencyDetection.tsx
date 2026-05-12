import { AlertTriangle, Check } from 'lucide-react';
import { SectionContainer } from '@/components/ui';
import type { Inconsistency } from '@/types/imaging';

interface Props {
  inconsistencies: Inconsistency[];
}

export function InconsistencyDetection({ inconsistencies }: Props) {
  const warnings = inconsistencies.filter((i) => i.type === 'warning');
  const passes   = inconsistencies.filter((i) => i.type === 'pass');

  return (
    <SectionContainer title="Inconsistency Detection" icon={<AlertTriangle size={14} />} defaultOpen>
      <ul className="space-y-2 pt-3">
        {warnings.map((item, i) => (
          <li key={i} className="flex items-start gap-2 p-3 rounded-md bg-warning-bg border border-warning-border">
            <AlertTriangle size={14} className="text-warning-fg flex-shrink-0 mt-0.5" />
            <p className="text-body text-warning-fg">{item.description}</p>
          </li>
        ))}
        {passes.map((item, i) => (
          <li key={`p-${i}`} className="flex items-start gap-2 p-3 rounded-md bg-success-bg border border-success-border">
            <Check size={14} className="text-success-fg flex-shrink-0 mt-0.5" />
            <p className="text-body text-success-fg">{item.description}</p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
