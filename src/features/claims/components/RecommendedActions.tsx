import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApproveClaimMutation, useRejectClaimMutation, useSendQueryMutation } from '@/services/claimsApi';
import { StatusBadge } from '@/components/ui';
import type { Status } from '@/types/common';

interface Props {
  actions: string[];
  status: Status;
  claimId: string;
}

type ActionState = 'idle' | 'approved' | 'rejected' | 'queried';

export function RecommendedActions({ actions, status, claimId }: Props) {
  const [actionState, setActionState] = useState<ActionState>('idle');
  const [approveClaim, { isLoading: approveLoading }] = useApproveClaimMutation();
  const [rejectClaim, { isLoading: rejectLoading }] = useRejectClaimMutation();
  const [sendQuery, { isLoading: queryLoading }] = useSendQueryMutation();

  const isAnyLoading = approveLoading || rejectLoading || queryLoading;

  const handleApprove = async () => {
    await approveClaim(claimId);
    setActionState('approved');
  };

  const handleReject = async () => {
    await rejectClaim(claimId);
    setActionState('rejected');
  };

  const handleQuery = async () => {
    await sendQuery({ claimId, message: 'Please provide documentation for flagged items.' });
    setActionState('queried');
  };

  if (actionState !== 'idle') {
    const messages: Record<Exclude<ActionState, 'idle'>, { text: string; cls: string }> = {
      approved: { text: '✓ Claim has been approved and forwarded for processing.', cls: 'status-pass' },
      rejected: { text: '✗ Claim has been rejected. Hospital notified.', cls: 'status-fail' },
      queried: { text: '↗ Query sent to hospital. Awaiting response within 48 hours.', cls: 'status-conditional' },
    };
    const msg = messages[actionState];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass rounded-2xl p-5 border ${msg.cls}`}
      >
        <p className="text-sm font-semibold">{msg.text}</p>
        <button
          onClick={() => setActionState('idle')}
          className="mt-2 text-xs text-slate-500 hover:text-slate-300 underline"
        >
          Reset
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-5">
        {/* Actions list */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Recommended Actions
            </span>
            <StatusBadge status={status} size="sm" />
          </div>
          <ul className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {actions.map((action, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-start gap-2.5 text-sm text-slate-300"
              >
                <span className="text-blue-400 flex-shrink-0 mt-0.5 text-xs">→</span>
                {action}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2.5 lg:flex-col lg:items-stretch lg:min-w-[160px]">
          <button
            onClick={handleApprove}
            disabled={isAnyLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-emerald-600 hover:bg-emerald-500 text-white transition-all
              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30
              hover:shadow-emerald-900/50 hover:-translate-y-0.5 active:translate-y-0"
          >
            {approveLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>✓</span>
            )}
            Approve Claim
          </button>

          <button
            onClick={handleQuery}
            disabled={isAnyLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-amber-600 hover:bg-amber-500 text-white transition-all
              disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20
              hover:shadow-amber-900/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {queryLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>↗</span>
            )}
            Send Query
          </button>

          <button
            onClick={handleReject}
            disabled={isAnyLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-red-700/80 hover:bg-red-600 text-white transition-all
              disabled:opacity-50 disabled:cursor-not-allowed border border-red-600/50
              hover:border-red-500 hover:-translate-y-0.5 active:translate-y-0"
          >
            {rejectLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>✗</span>
            )}
            Reject Claim
          </button>
        </div>
      </div>
    </motion.div>
  );
}
