import { motion } from 'framer-motion';
import { useGetClaimDecisionQuery } from '@/services/claimsApi';
import { useAppSelector } from '@/app/hooks';
import { ClaimDashboardSkeleton } from '@/components/ui';

import { DecisionSummaryPanel } from '@/features/claims/components/DecisionSummaryPanel';
import { PatientClaimCard } from '@/features/claims/components/PatientClaimCard';
import { DocumentInventory } from '@/features/claims/components/DocumentInventory';
import { VisualProofPanel } from '@/features/claims/components/VisualProofPanel';
import { DocumentPreviewModal } from '@/features/claims/components/DocumentPreviewModal';
import { STGComplianceTable } from '@/features/claims/components/STGComplianceTable';
import { TreatmentTimeline } from '@/features/claims/components/TreatmentTimeline';
import { FinancialAnalysis } from '@/features/claims/components/FinancialAnalysis';
import { RecommendedActions } from '@/features/claims/components/RecommendedActions';

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="glass rounded-2xl p-8 text-center max-w-md">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Claim</h3>
        <p className="text-sm text-slate-400">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-sm text-slate-300 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function ClaimDashboard() {
  const claimId = useAppSelector((s) => s.claims.selectedClaimId);
  const { data, isLoading, isError, error } = useGetClaimDecisionQuery(claimId);

  if (isLoading) return <ClaimDashboardSkeleton />;
  if (isError || !data) {
    const msg = error && 'message' in error ? String(error.message) : 'Unknown error occurred';
    return <ErrorState message={msg} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Sticky summary header */}
      <div className="sticky top-14 z-30 pt-1 pb-1 -mx-1 px-1">
        <DecisionSummaryPanel data={data} />
      </div>

      {/* Recommended actions — directly after header */}
      <RecommendedActions
        actions={data.recommendedActions}
        status={data.status}
        claimId={data.summary.id}
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left column (40%) */}
        <div className="lg:col-span-2 space-y-4">
          <PatientClaimCard summary={data.summary} />
          <DocumentInventory inventory={data.documentInventory} />
          <VisualProofPanel proofs={data.visualProofs} />
        </div>

        {/* Right column (60%) */}
        <div className="lg:col-span-3 space-y-4">
          <STGComplianceTable rules={data.stgRules} complianceScore={data.complianceScore} />
          <TreatmentTimeline timeline={data.timeline} />
          <FinancialAnalysis items={data.financialItems} fraudSignals={data.fraudSignals} />
        </div>
      </div>

      {/* Document preview modal (portal-style via Redux) */}
      <DocumentPreviewModal />
    </motion.div>
  );
}
