import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';
import { SectionContainer, ProgressBar } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setActiveImage } from '@/features/imaging/imagingSlice';
import type { ImageScan } from '@/types/imaging';

interface Props {
  images: ImageScan[];
  consistencyScore: number | null;
}

const MODALITY_COLOR: Record<string, string> = {
  'X-Ray': 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  'CT Scan': 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400',
  MRI: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
  'Coronary Angiogram': 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  'Typed report': 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400',
};

const FALLBACK_COLOR = 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400';

export function MultiImageAnalysis({ images, consistencyScore }: Props) {
  const theme = useAppSelector((s) => s.ui.theme);
  const isDark = theme === 'dark';
  const dispatch = useAppDispatch();
  const activeIdx = useAppSelector((s) => s.imaging.activeImageIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12 }}
    >
      <SectionContainer title='Multi-Image Analysis' icon={<FiGrid size={14} />} defaultOpen>
        <div className='space-y-2 pt-3'>
          {images.length > 0 ? (
            images.map((img, i) => {
              const colorCls = MODALITY_COLOR[img.modality] ?? FALLBACK_COLOR;
              const isActive = i === activeIdx;

              return (
                <motion.button
                  key={img.id}
                  type='button'
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 * i }}
                  onClick={() => dispatch(setActiveImage(i))}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border bg-gradient-to-r transition-all text-left
                    ${colorCls} ${isActive ? 'ring-1 ring-white/15 ' : 'hover:brightness-110'}`}
                >
                  <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-black/30 flex flex-col items-center justify-center'>
                    <span className='text-[9px] font-bold text-slate-400'>DAY</span>
                    <span className='text-sm font-black'>{img.day}</span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-bold'>{img.modality}</span>
                      {isActive && (
                        <span
                          className={`text-[9px] font-semibold bg-blue-600 px-1.5 py-0.5 rounded-full`}
                          style={{ color: `${isDark ? '#000' : '#FFF'}` }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <p className='text-[11px] text-slate-300 mt-0.5'>{img.finding}</p>
                    <p className='text-[10px] text-slate-600 mt-0.5'>{img.date}</p>
                  </div>
                  <span className={`text-sm flex-shrink-0 ${img.consistent ? 'text-emerald-400' : 'text-red-400'}`}>
                    {img.consistent ? '✓' : '✗'}
                  </span>
                </motion.button>
              );
            })
          ) : (
            <p className='text-xs text-slate-600 italic py-2'>No image entries available</p>
          )}

          {consistencyScore !== null && (
            <ProgressBar
              value={consistencyScore}
              label='Cross-Image Consistency Score'
              size='sm'
              color='auto'
              className='pt-2 mt-1 border-t border-white/[0.06]'
              delay={0.5}
            />
          )}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
