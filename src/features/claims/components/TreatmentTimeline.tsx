import { motion } from 'framer-motion';
import { SectionContainer, Timeline } from '@/components/ui';
import type { TimelineEntry } from '@/components/ui';
import type { TimelineEvent } from '@/types/claims';

interface Props {
  timeline: TimelineEvent[];
}

export function TreatmentTimeline({ timeline }: Props) {
  const gapDay = timeline.find((e) => e.hasGap)?.day;

  const entries: TimelineEntry[] = timeline.map((ev) => ({
    id: ev.day,
    dayLabel: ev.day,
    title: ev.hasGap ? '' : ev.label,
    description: ev.hasGap ? undefined : ev.description,
    isGap: ev.hasGap,
    variant: ev.hasGap ? 'warning' : 'default',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.22 }}
    >
      <SectionContainer
        title="Treatment Timeline"
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        }
        defaultOpen
      >
        <div className="pt-4">
          <Timeline
            entries={entries}
            gapMessage={gapDay ? `Gap detected — no clinical records for Day ${gapDay}` : undefined}
          />
        </div>
      </SectionContainer>
    </motion.div>
  );
}
