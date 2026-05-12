import {
  Monitor, Heart, Microscope, Scan, Magnet, Activity, Volume2, FileText, Check, Minus,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { SectionContainer } from '@/components/ui';
import { Badge } from '@/ui';
import { cn } from '@/lib/cn';
import type { AIFinding, ScanViewerInfo, ImageInventory } from '@/types/imaging';

interface Props {
  findings: AIFinding[];
  imageQuality: string | null;
  scanViewer: ScanViewerInfo;
  modality: string;
  imageInventory: ImageInventory;
}

const MODALITY_ICONS: { match: string; icon: ReactNode }[] = [
  { match: 'Coronary Angiogram', icon: <Heart size={20} /> },
  { match: 'X-Ray',              icon: <Microscope size={20} /> },
  { match: 'CT Scan',            icon: <Scan size={20} /> },
  { match: 'MRI',                icon: <Magnet size={20} /> },
  { match: 'Echocardiogram',     icon: <Activity size={20} /> },
  { match: 'Ultrasound',         icon: <Volume2 size={20} /> },
];

const STAGE_TONE: Record<string, 'info' | 'warning' | 'success'> = {
  'pre-procedure':   'info',
  'intra-procedure': 'warning',
  'post-procedure':  'success',
};

function modalityIcon(modality: string): ReactNode {
  const m = modality.toLowerCase();
  return MODALITY_ICONS.find((c) => m.includes(c.match.toLowerCase()))?.icon ?? <FileText size={20} />;
}

function shortFilename(src: string): string {
  const name = src.split('/').pop() ?? src;
  return name.length > 42 ? `…${name.slice(-39)}` : name;
}

function qualityTone(q: string | null): 'success' | 'warning' | 'danger' | null {
  if (q === 'High') return 'success';
  if (q === 'Moderate') return 'warning';
  if (q) return 'danger';
  return null;
}

export function ImageViewer({ findings, imageQuality, scanViewer, modality, imageInventory }: Props) {
  const detected = findings.filter((f) => f.detected);
  const totalImages = imageInventory.totalImages;
  const qTone = qualityTone(imageQuality);

  return (
    <SectionContainer title="Scan Overview" icon={<Monitor size={14} />} defaultOpen>
      <div className="pt-3 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-md bg-surface border border-border">
          <div className="h-10 w-10 rounded-md bg-brand-50 text-brand-700 grid place-items-center flex-shrink-0">
            {modalityIcon(modality)}
          </div>
          <div className="min-w-0">
            <p className="text-body-strong text-text">{modality}</p>
            <p className="text-caption text-text-subtle font-mono truncate">
              {shortFilename(scanViewer.primaryImageSource)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="label-caption">Image Inventory</p>
            <span className="num text-text">{totalImages} total</span>
          </div>
          <ul className="space-y-2">
            {Object.entries(imageInventory.byType).map(([type, count]) => {
              const pct = totalImages > 0 ? Math.round((count / totalImages) * 100) : 0;
              return (
                <li key={type}>
                  <div className="flex items-center justify-between text-small mb-1">
                    <span className="text-text-muted">{type}</span>
                    <span className="num text-text-subtle">{count}</span>
                  </div>
                  <div className="w-full bg-surface-muted rounded-full h-1 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {imageInventory.stagesPresent.length > 0 && (
          <div>
            <p className="label-caption mb-2">Procedure Stages</p>
            <div className="flex flex-wrap gap-1.5">
              {imageInventory.stagesPresent.map((stage) => (
                <Badge key={stage} tone={STAGE_TONE[stage] ?? 'neutral'}>{stage}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className={cn(
            'inline-flex items-center gap-1.5 h-6 px-2 rounded-sm border text-caption',
            scanViewer.aiOverlaysAvailable
              ? 'bg-success-bg text-success-fg border-success-border'
              : 'bg-surface-muted text-text-subtle border-border',
          )}>
            {scanViewer.aiOverlaysAvailable ? <Check size={12} /> : <Minus size={12} />}
            AI overlays {scanViewer.aiOverlaysAvailable ? 'available' : 'unavailable'}
          </span>
          {qTone
            ? <Badge tone={qTone}>{imageQuality} quality</Badge>
            : <span className="text-caption text-text-subtle">Quality N/A</span>}
        </div>

        {detected.length > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="label-caption mb-2">AI-Flagged Regions</p>
            <ul className="space-y-1.5">
              {detected.map((f) => (
                <li key={f.name} className="flex items-center justify-between text-body">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm bg-danger-fg flex-shrink-0" />
                    <span className="text-text">{f.name}</span>
                    {f.severity && <span className="text-caption text-text-subtle">· {f.severity}</span>}
                  </div>
                  {f.confidence !== null && <span className="num text-text-subtle">{f.confidence}%</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
