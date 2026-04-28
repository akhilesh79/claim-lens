import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setSelectedVisualProof } from '@/features/ui/uiSlice';

export function DocumentPreviewModal() {
  const dispatch = useAppDispatch();
  const proofType = useAppSelector((s) => s.ui.selectedVisualProof);

  const close = () => dispatch(setSelectedVisualProof(null));

  return (
    <AnimatePresence>
      {proofType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-elevated rounded-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">{proofType}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Visual proof — AI verified</p>
              </div>
              <button
                onClick={close}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Mock document preview */}
            <div className="p-5">
              <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center">
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 29px)',
                  }}
                />
                {/* Mock document content */}
                <div className="relative z-10 p-6 w-full h-full flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-6 w-24 bg-blue-500/20 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-white/5 rounded" />
                  </div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-2.5 bg-white/[0.06] rounded" style={{ width: `${60 + Math.sin(i) * 20 + 20}%` }} />
                  ))}
                  <div className="mt-auto flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="h-2 w-20 bg-white/[0.05] rounded" />
                      <div className="h-8 w-24 bg-emerald-500/20 border border-emerald-500/30 rounded" />
                    </div>
                    {/* Stamp / seal */}
                    <div className="w-14 h-14 rounded-full border-2 border-blue-500/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center text-[8px] text-blue-400 text-center font-bold leading-tight">
                        AI<br />VERIFIED
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI verified overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI Verified
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
                </svg>
                Authenticity confirmed · Detected with {proofType === 'QR / Barcode' ? '99' : '96'}% confidence
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
