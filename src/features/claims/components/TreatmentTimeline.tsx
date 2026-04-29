import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
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
        icon={<FiClock size={14} />}
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
