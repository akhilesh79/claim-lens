import {
  Clock, Heart, Microscope, Scan, Magnet, Building2, FileText, Activity, Volume2,
  Check, AlertTriangle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { SectionContainer } from '@/components/ui';
import { Badge } from '@/ui';
import { cn } from '@/lib/cn';
import type { RadiologyEvent } from '@/types/imaging';

interface Props {
  timeline: RadiologyEvent[];
  isLogical: boolean;
}

const EVENT_ICONS: { match: string; icon: ReactNode }[] = [
  { match: 'Coronary Angiogram', icon: <Heart size={16} /> },
  { match: 'X-Ray',              icon: <Microscope size={16} /> },
  { match: 'CT Scan',            icon: <Scan size={16} /> },
  { match: 'MRI',                icon: <Magnet size={16} /> },
  { match: 'Surgery',            icon: <Building2 size={16} /> },
  { match: 'Typed report',       icon: <FileText size={16} /> },
  { match: 'Echocardiogram',     icon: <Activity size={16} /> },
  { match: 'Ultrasound',         icon: <Volume2 size={16} /> },
];

function getIcon(event: string): ReactNode {
  const e = event.toLowerCase();
  return EVENT_ICONS.find((c) => e.includes(c.match.toLowerCase()))?.icon ?? <FileText size={16} />;
}

export function RadiologyTimeline({ timeline, isLogical }: Props) {
  return (
    <SectionContainer title="Radiology Timeline" icon={<Clock size={14} />} defaultOpen maxH="max-h-none">
      <div className="pt-4 space-y-4">
        {timeline.length > 0 ? (
          <div className="overflow-x-auto pb-2">
            <div className="relative min-w-max">
              <div className="absolute top-5 left-5 right-5 h-px bg-border pointer-events-none" />
              <div className="flex items-start gap-0">
                {timeline.map((ev, i) => (
                  <div key={`${ev.day}-${i}`} className="flex flex-col items-center gap-2 min-w-[160px] px-6">
                    <div className="relative z-10 h-10 w-10 rounded-full border bg-brand-50 border-brand-100 text-brand-700 grid place-items-center">
                      {getIcon(ev.event)}
                    </div>
                    <div className="text-center w-full">
                      <p className="text-small font-medium text-text leading-snug line-clamp-2">{ev.event}</p>
                      <p className="text-caption text-text-subtle mt-0.5">{ev.date}</p>
                      <Badge tone="brand" className="mt-1">Day {ev.day}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-small text-text-subtle italic">No timeline events available</p>
        )}

        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-body border',
            isLogical
              ? 'bg-success-bg border-success-border text-success-fg'
              : 'bg-warning-bg border-warning-border text-warning-fg',
          )}
        >
          {isLogical ? <Check size={14} /> : <AlertTriangle size={14} />}
          {isLogical
            ? 'Timeline is clinically logical — imaging sequence is appropriate'
            : 'Timeline has anomalies — review imaging sequence'}
        </div>
      </div>
    </SectionContainer>
  );
}
