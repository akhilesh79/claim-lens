import { LayoutGrid, Check, X } from 'lucide-react';
import { SectionContainer, ProgressBar } from '@/components/ui';
import { Badge } from '@/ui';
import { cn } from '@/lib/cn';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setActiveImage } from '@/features/imaging/imagingSlice';
import type { ImageScan } from '@/types/imaging';

interface Props {
  images: ImageScan[];
  consistencyScore: number | null;
}

export function MultiImageAnalysis({ images, consistencyScore }: Props) {
  const dispatch = useAppDispatch();
  const activeIdx = useAppSelector((s) => s.imaging.activeImageIndex);

  return (
    <SectionContainer title="Multi-Image Analysis" icon={<LayoutGrid size={14} />} defaultOpen>
      <div className="space-y-2 pt-3">
        {images.length > 0 ? (
          images.map((img, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => dispatch(setActiveImage(i))}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-md border bg-surface text-left',
                  'transition-colors duration-fast hover:bg-surface-muted',
                  isActive ? 'border-brand-500 ring-1 ring-brand-100' : 'border-border',
                )}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-surface-muted border border-border flex flex-col items-center justify-center">
                  <span className="label-caption">DAY</span>
                  <span className="num text-text leading-none">{img.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-body-strong text-text">{img.modality}</span>
                    {isActive && <Badge tone="brand">Active</Badge>}
                  </div>
                  <p className="text-small text-text-muted mt-0.5">{img.finding}</p>
                  <p className="text-caption text-text-subtle mt-0.5">{img.date}</p>
                </div>
                {img.consistent
                  ? <Check size={16} className="text-success-fg flex-shrink-0" />
                  : <X     size={16} className="text-danger-fg flex-shrink-0" />}
              </button>
            );
          })
        ) : (
          <p className="text-small text-text-subtle italic py-2">No image entries available</p>
        )}

        {consistencyScore !== null && (
          <ProgressBar
            value={consistencyScore}
            label="Cross-Image Consistency Score"
            size="sm"
            color="auto"
            className="pt-3 mt-2 border-t border-border"
          />
        )}
      </div>
    </SectionContainer>
  );
}
