import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { Surface } from '@/ui';
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
      <Surface padding='comfortable' className='max-w-md text-center'>
        <div className='grid place-items-center mb-3'>
          <div className='h-10 w-10 rounded-full bg-danger-bg border border-danger-border grid place-items-center'>
            <AlertCircle size={20} className='text-danger-fg' />
          </div>
        </div>
        <h3 className='text-h3 text-danger-fg mb-1'>Claim Decision Engine Failed</h3>
        <p className='text-body text-text-muted'>{message}</p>
      </Surface>
    </div>
  );
}

export default function ClaimDashboard() {
  const data = useAppSelector((s) => s.claims.apiData);
  const error = useAppSelector((s) => s.claims.apiError);
  const forgeryResults = useAppSelector((s) => s.forgery.results);
  const report = data?.report;

  const [drawerFile, setDrawerFile] = useState<ForgeryFileResult | null>(null);

  return (
    <div className='space-y-4'>
      {error ? (
        <ApiErrorCard message={error} />
      ) : data && report ? (
        <>
          <DecisionSummaryPanel data={data} />

          <RecommendedActions actions={report.recommendedActions} status={report.status} claimId={report.summary.id} />

          <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
            <PatientClaimCard summary={report.summary} className='lg:col-span-2' />
            <STGComplianceTable
              rules={report.stgRules}
              complianceScore={report.complianceScore}
              className='lg:col-span-3'
            />

            <DocumentInventory inventory={report.documentInventory} className='lg:col-span-2' />
            <TreatmentTimeline timeline={report.timeline} className='lg:col-span-3' />

            <VisualProofPanel proofs={report.visualProofs} className='lg:col-span-2' />
            <FinancialAnalysis
              items={report.financialItems}
              fraudSignals={report.fraudSignals}
              className='lg:col-span-3'
            />
          </div>
        </>
      ) : null}

      {forgeryResults.length > 0 && <DocumentForgeryPanel results={forgeryResults} onSelect={setDrawerFile} />}

      <DocumentPreviewModal />
      <ForgeryDrawer result={drawerFile} onClose={() => setDrawerFile(null)} />
    </div>
  );
}
