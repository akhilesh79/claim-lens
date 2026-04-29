import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';
import { SectionContainer } from '@/components/ui';

interface Props {
  narrative: string | null;
  modelId: string;
}

export function ClinicalNarrativePanel({ narrative, modelId }: Props) {
  const shortModelId = modelId.split('/').pop() ?? modelId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
    >
      <SectionContainer title='Clinical Narrative' icon={<FiBookOpen size={14} />} defaultOpen>
        {narrative ? (
          <div className='pt-3 space-y-3'>
            <div className='p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]'>
              <p className='text-xs text-slate-300 leading-relaxed'>{narrative}</p>
            </div>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1 text-[9px] text-emerald-500 font-semibold'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                AI Generated
              </span>
            </div>
          </div>
        ) : (
          <div className='pt-3 flex flex-col items-center justify-center py-6 gap-2 text-center'>
            <span className='text-2xl opacity-25'>📝</span>
            <p className='text-xs text-slate-600'>No clinical narrative generated</p>
          </div>
        )}
      </SectionContainer>
    </motion.div>
  );
}
