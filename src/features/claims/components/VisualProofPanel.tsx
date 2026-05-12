import { Eye, Building2, PenTool, Tag, Smartphone, Pill, FileText, Check, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import { SectionContainer } from '@/components/ui';
import { Button } from '@/ui';
import { useAppDispatch } from '@/app/hooks';
import { setSelectedVisualProof } from '@/features/ui/uiSlice';
import { cn } from '@/lib/cn';
import type { VisualProof } from '@/types/claims';

interface Props {
  proofs: VisualProof[];
  className?: string;
}

const ICONS: Record<string, ReactNode> = {
  'Hospital Stamp':    <Building2 size={16} />,
  'Doctor Signature':  <PenTool size={16} />,
  'Implant Sticker':   <Tag size={16} />,
  'QR / Barcode':      <Smartphone size={16} />,
  'Pharmacy Seal':     <Pill size={16} />,
};

export function VisualProofPanel({ proofs, className }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className={className}>
      <SectionContainer title="Visual Proof Detected" icon={<Eye size={14} />} defaultOpen>
        <ul className="space-y-1.5 pt-3">
          {proofs.map((proof) => (
            <li
              key={proof.type}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-md border',
                proof.detected ? 'border-border bg-surface' : 'border-border bg-surface-muted',
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(proof.detected ? 'text-success-fg' : 'text-text-subtle')}>
                  {ICONS[proof.type] ?? <FileText size={16} />}
                </span>
                <span className={cn('text-body-strong', proof.detected ? 'text-text' : 'text-text-subtle')}>
                  {proof.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  aria-label={proof.detected ? 'Detected' : 'Not found'}
                  className={cn(
                    'h-5 w-5 rounded-full grid place-items-center',
                    proof.detected
                      ? 'bg-success-bg text-success-fg border border-success-border'
                      : 'bg-surface-muted text-text-subtle border border-border',
                  )}
                >
                  {proof.detected ? <Check size={12} /> : <Minus size={12} />}
                </span>
                {proof.detected && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => dispatch(setSelectedVisualProof(proof.type))}
                  >
                    View
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </div>
  );
}
