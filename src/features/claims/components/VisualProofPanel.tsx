import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import { SectionContainer, Tooltip } from '@/components/ui';
import { useAppDispatch } from '@/app/hooks';
import { setSelectedVisualProof } from '@/features/ui/uiSlice';
import type { VisualProof } from '@/types/claims';

interface Props {
  proofs: VisualProof[];
}

const ICONS: Record<string, string> = {
  'Hospital Stamp': '🏥',
  'Doctor Signature': '✍️',
  'Implant Sticker': '🔖',
  'QR / Barcode': '📱',
  'Pharmacy Seal': '💊',
};

export function VisualProofPanel({ proofs }: Props) {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.26 }}
    >
      <SectionContainer
        title="Visual Proof Detected"
        icon={<FiEye size={14} />}
        defaultOpen
      >
        <div className="space-y-2 pt-3">
          {proofs.map((proof, i) => (
            <motion.div
              key={proof.type}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all
                ${proof.detected
                  ? 'border-emerald-500/15 hover:border-emerald-500/25 hover:bg-emerald-500/[0.04]'
                  : 'border-slate-700/50 bg-white/[0.01]'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-base ${!proof.detected ? 'grayscale opacity-40' : ''}`}>
                  {ICONS[proof.type] ?? '📄'}
                </span>
                <span className={`text-xs font-medium ${proof.detected ? 'text-slate-200' : 'text-slate-600'}`}>
                  {proof.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip content={proof.detected ? 'Detected' : 'Not found'}>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold
                      ${proof.detected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'}`}
                  >
                    {proof.detected ? '✓' : '–'}
                  </span>
                </Tooltip>
                {proof.detected && (
                  <button
                    onClick={() => dispatch(setSelectedVisualProof(proof.type))}
                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-500/10 transition-colors"
                  >
                    View
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
