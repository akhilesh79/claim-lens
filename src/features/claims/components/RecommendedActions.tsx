import { useState } from 'react';
import { Check, X, Send, ArrowRight } from 'lucide-react';
import { useApproveClaimMutation, useRejectClaimMutation, useSendQueryMutation } from '@/services/claimsApi';
import { Surface, Button, StatusBadge } from '@/ui';
import { cn } from '@/lib/cn';
import type { Status } from '@/types/common';

interface Props {
  actions: string[];
  status: Status;
  claimId: string;
}

type ActionState = 'idle' | 'approved' | 'rejected' | 'queried';

const RESULT: Record<Exclude<ActionState, 'idle'>, { text: string; tone: string }> = {
  approved: { text: 'Claim approved and forwarded for processing.',                tone: 'bg-success-bg text-success-fg border-success-border' },
  rejected: { text: 'Claim rejected. Hospital has been notified.',                 tone: 'bg-danger-bg  text-danger-fg  border-danger-border'  },
  queried:  { text: 'Query sent to hospital. Awaiting response within 48 hours.', tone: 'bg-warning-bg text-warning-fg border-warning-border' },
};

function Spinner() {
  return <span className="h-3.5 w-3.5 rounded-full border-2 border-text-inverse/40 border-t-text-inverse animate-spin" />;
}

export function RecommendedActions({ actions, status, claimId }: Props) {
  const [state, setState] = useState<ActionState>('idle');
  const [approveClaim, { isLoading: approving }] = useApproveClaimMutation();
  const [rejectClaim,  { isLoading: rejecting }] = useRejectClaimMutation();
  const [sendQuery,    { isLoading: querying  }] = useSendQueryMutation();

  const busy = approving || rejecting || querying;

  if (state !== 'idle') {
    const r = RESULT[state];
    return (
      <Surface padding="default" className={cn('border', r.tone)}>
        <p className="text-body-strong">{r.text}</p>
        <Button variant="link" size="sm" className="mt-2" onClick={() => setState('idle')}>
          Reset
        </Button>
      </Surface>
    );
  }

  return (
    <Surface padding="default">
      <div className="flex flex-col lg:flex-row lg:items-start gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="label-caption">Recommended Actions</span>
            <StatusBadge status={status} />
          </div>
          <ul className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-body text-text-muted">
                <ArrowRight size={14} className="text-brand-600 flex-shrink-0 mt-1" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-[180px]">
          <Button variant="primary"   size="md" disabled={busy} onClick={async () => { await approveClaim(claimId); setState('approved'); }}
            leadingIcon={approving ? <Spinner /> : <Check size={16} />}>
            Approve
          </Button>
          <Button variant="secondary" size="md" disabled={busy} onClick={async () => { await sendQuery({ claimId, message: 'Please provide documentation for flagged items.' }); setState('queried'); }}
            leadingIcon={querying ? <Spinner /> : <Send size={16} />}>
            Send Query
          </Button>
          <Button variant="danger"    size="md" disabled={busy} onClick={async () => { await rejectClaim(claimId); setState('rejected'); }}
            leadingIcon={rejecting ? <Spinner /> : <X size={16} />}>
            Reject
          </Button>
        </div>
      </div>
    </Surface>
  );
}
