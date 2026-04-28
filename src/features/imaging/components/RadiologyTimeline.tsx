import { motion } from 'framer-motion';
import { SectionContainer, Timeline } from '@/components/ui';
import type { TimelineEntry } from '@/components/ui';
import type { RadiologyEvent } from '@/types/imaging';

interface Props {
  timeline: RadiologyEvent[];
  isLogical: boolean;
}

const MODALITY_ICONS: Record<string, string> = {
  'X-Ray': '🔬',
  'CT Scan': '🩻',
  'MRI': '🧲',
  'Surgery': '🏥',
};

export function RadiologyTimeline({ timeline, isLogical }: Props) {
  const entries: TimelineEntry[] = timeline.map((ev) => ({
    id: ev.day,
    dayLabel: ev.day,
    title: `${ev.modality} — ${ev.purpose}`,
    description: `Day ${ev.day}`,
    icon: <span className="text-sm">{MODALITY_ICONS[ev.modality] ?? '📋'}</span>,
    variant: ev.modality === 'Surgery' ? 'success' : 'default',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.37 }}
    >
      <SectionContainer
        title="Radiology Timeline"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        }
        defaultOpen
      >
        <div className="pt-4">
          <Timeline entries={entries} />

          <div
            className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border
              ${isLogical
                ? 'bg-emerald-500/[0.06] border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/[0.06] border-amber-500/20 text-amber-400'
              }`}
          >
            <span>{isLogical ? '✓' : '⚠'}</span>
            {isLogical
              ? 'Timeline is clinically logical — imaging sequence is appropriate'
              : 'Timeline has anomalies — review imaging sequence'}
          </div>
        </div>
      </SectionContainer>
    </motion.div>
  );
}
