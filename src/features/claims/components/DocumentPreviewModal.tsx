import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setSelectedVisualProof } from '@/features/ui/uiSlice';
import { Button, Surface } from '@/ui';

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
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/50"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Surface elevation={2} padding="none" radius="xl" className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="text-h3 text-text">{proofType}</h3>
                  <p className="text-small text-text-subtle mt-0.5">Visual proof — AI verified</p>
                </div>
                <Button variant="ghost" size="icon" onClick={close} aria-label="Close preview">
                  <X size={16} />
                </Button>
              </div>

              <div className="p-5">
                <div className="relative rounded-md border border-border bg-surface-muted aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-0 p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-6 w-24 bg-brand-100 rounded-sm" />
                      <div className="h-6 w-16 bg-border rounded-sm" />
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-2.5 bg-border rounded-sm" style={{ width: `${60 + Math.sin(i) * 20 + 20}%` }} />
                    ))}
                    <div className="mt-auto flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="h-2 w-20 bg-border rounded-sm" />
                        <div className="h-8 w-24 bg-success-bg border border-success-border rounded-sm" />
                      </div>
                      <div className="h-14 w-14 rounded-full border-2 border-brand-500 grid place-items-center">
                        <span className="text-caption text-brand-600 font-semibold leading-tight text-center">AI<br />VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-sm bg-success-bg border border-success-border text-success-fg text-caption">
                      <span className="h-1.5 w-1.5 rounded-full bg-success-fg" />
                      AI Verified
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-small text-text-muted bg-surface-muted border border-border rounded-md px-3 py-2">
                  <CheckCircle2 size={14} className="text-success-fg" />
                  Authenticity confirmed · Detected with {proofType === 'QR / Barcode' ? '99' : '96'}% confidence
                </div>
              </div>
            </Surface>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
