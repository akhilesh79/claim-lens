import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/app/hooks';
import type { ForgeryFileResult } from '@/types/forgery';

import { DecisionSummaryPanel } from '@/features/claims/components/DecisionSummaryPanel';
import { PatientClaimCard } from '@/features/claims/components/PatientClaimCard';
import { DocumentInventory } from '@/features/claims/components/DocumentInventory';
import { VisualProofPanel } from '@/features/claims/components/VisualProofPanel';
import { DocumentPreviewModal } from '@/features/claims/components/DocumentPreviewModal';
import { STGComplianceTable } from '@/features/claims/components/STGComplianceTable';
import { TreatmentTimeline } from '@/features/claims/components/TreatmentTimeline';
import { FinancialAnalysis } from '@/features/claims/components/FinancialAnalysis';
import { RecommendedActions } from '@/features/claims/components/RecommendedActions';
import { DocumentForgeryPanel } from '@/features/claims/components/DocumentForgeryPanel';
import { ForgeryDrawer } from '@/features/claims/components/ForgeryDrawer';

function ApiErrorCard({ message }: { message: string }) {
  return (
    <div className='flex items-center justify-center min-h-[40vh]'>
      <div className='glass rounded-2xl p-8 text-center max-w-md space-y-3'>
        <div className='text-4xl'>⚠️</div>
        <h3 className='text-lg font-semibold text-red-400'>Claim Decision Engine Failed</h3>
        <p className='text-sm text-slate-400 leading-relaxed'>{message}</p>
      </div>
    </div>
  );
}

export default function ClaimDashboard() {
  const data           = useAppSelector((s) => s.claims.apiData);
  const error          = useAppSelector((s) => s.claims.apiError);
  const forgeryResults = useAppSelector((s) => s.forgery.results);
  const report         = data?.report;

  const [drawerFile, setDrawerFile] = useState<ForgeryFileResult | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className='space-y-4'>

      {/* ── Claim Decision Engine ─────────────────────────────── */}
      {error ? (
        <ApiErrorCard message={error} />
      ) : data && report ? (
        <>
          {/* Sticky summary header */}
          <div className='sticky top-14 z-30 pt-1 pb-1 -mx-1 px-1'>
            <DecisionSummaryPanel data={data} />
          </div>

          {/* Recommended actions */}
          <RecommendedActions actions={report.recommendedActions} status={report.status} claimId={report.summary.id} />

          {/* Flat 5-col grid */}
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
            <PatientClaimCard   summary={report.summary}                                          className="lg:col-span-2" />
            <STGComplianceTable rules={report.stgRules} complianceScore={report.complianceScore} className="lg:col-span-3" />

            <DocumentInventory  inventory={report.documentInventory}                              className="lg:col-span-2" />
            <TreatmentTimeline  timeline={report.timeline}                                        className="lg:col-span-3" />

            <VisualProofPanel   proofs={report.visualProofs}                                      className="lg:col-span-2" />
            <FinancialAnalysis  items={report.financialItems} fraudSignals={report.fraudSignals}  className="lg:col-span-3" />
          </div>
        </>
      ) : null}

      {/* ── Document Forgery Detection — always shown if available ── */}
      {forgeryResults.length > 0 && (
        <DocumentForgeryPanel
          results={forgeryResults}
          onSelect={setDrawerFile}
        />
      )}

      {/* Modals & drawers */}
      <DocumentPreviewModal />
      <ForgeryDrawer
        result={drawerFile}
        onClose={() => setDrawerFile(null)}
      />
    </motion.div>
  );
}
