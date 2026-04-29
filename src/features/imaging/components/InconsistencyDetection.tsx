import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { SectionContainer } from '@/components/ui';
import type { Inconsistency } from '@/types/imaging';

interface Props {
  inconsistencies: Inconsistency[];
}

export function InconsistencyDetection({ inconsistencies }: Props) {
  const warnings = inconsistencies.filter((i) => i.type === 'warning');
  const passes = inconsistencies.filter((i) => i.type === 'pass');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
    >
      <SectionContainer
        title="Inconsistency Detection"
        icon={<FiAlertTriangle size={14} />}
        defaultOpen
      >
        <div className="space-y-2 pt-3">
          {warnings.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20"
            >
              <span className="text-amber-400 flex-shrink-0 mt-0.5 text-sm">⚠</span>
              <p className="text-xs text-amber-300/90 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
          {passes.map((item, i) => (
            <motion.div
              key={`pass-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * (warnings.length + i) }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15"
            >
              <span className="text-emerald-400 flex-shrink-0 mt-0.5 text-sm">✓</span>
              <p className="text-xs text-emerald-300/80 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
