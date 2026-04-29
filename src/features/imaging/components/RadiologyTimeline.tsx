import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { SectionContainer } from '@/components/ui';
import type { RadiologyEvent } from '@/types/imaging';

interface Props {
  timeline: RadiologyEvent[];
  isLogical: boolean;
}

const EVENT_ICONS: Record<string, string> = {
  'Coronary Angiogram': '🫀',
  'X-Ray': '🔬',
  'CT Scan': '🩻',
  'MRI': '🧲',
  'Surgery': '🏥',
  'Typed report': '📄',
  'Echocardiogram': '💓',
};

function getIcon(event: string): string {
  for (const key of Object.keys(EVENT_ICONS)) {
    if (event.toLowerCase().includes(key.toLowerCase())) return EVENT_ICONS[key];
  }
  return '📋';
}

export function RadiologyTimeline({ timeline, isLogical }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <SectionContainer title="Radiology Timeline" icon={<FiClock size={14} />} defaultOpen>
        <div className="pt-4 space-y-4">
          {timeline.length > 0 ? (
            <div className="relative">
              {/* Horizontal spine on lg+, vertical on mobile */}
              <div className="hidden lg:block absolute top-5 left-6 right-6 h-px bg-gradient-to-r from-blue-500/40 via-slate-700/40 to-transparent pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-0 lg:justify-between">
                {timeline.map((ev, i) => (
                  <motion.div
                    key={`${ev.day}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i }}
                    className="flex lg:flex-col items-start lg:items-center gap-3 lg:gap-2 lg:flex-1 group"
                  >
                    {/* Node */}
                    <div className="relative z-10 w-10 h-10 rounded-full border bg-blue-500/20 border-blue-500/40 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                      <span className="text-base">{getIcon(ev.event)}</span>
                    </div>

                    {/* Label */}
                    <div className="lg:text-center min-w-0">
                      <p className="text-xs font-semibold text-slate-200 leading-snug">{ev.event}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{ev.date}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                        Day {ev.day}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">No timeline events available</p>
          )}

          {/* Logic verdict */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
              isLogical
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
