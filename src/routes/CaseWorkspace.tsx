import { useState, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { AppShell } from '@/components/AppShell/AppShell';
import { CaseHeader } from '@/components/AppShell/CaseHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent, Surface, EmptyState, Button } from '@/ui';

const ClaimDashboard = lazy(() => import('@/pages/ClaimDashboard'));
const ImagingDashboard = lazy(() => import('@/pages/ImagingDashboard'));

type TabKey = 'decision' | 'imaging' | 'forgery' | 'documents' | 'audit';

function PanelLoader() {
  return (
    <div className='grid place-items-center py-24'>
      <div className='h-6 w-6 rounded-full border-2 border-border border-t-brand-500 animate-spin' />
    </div>
  );
}

export default function CaseWorkspace() {
  const claims = useAppSelector((s) => s.claims.apiData);
  const imaging = useAppSelector((s) => s.imaging.apiData);
  const forgery = useAppSelector((s) => s.forgery.results);

  const hasAny = claims || imaging || forgery.length > 0;
  const [tab, setTab] = useState<TabKey>('decision');

  if (!hasAny) return <Navigate to='/cases/new' replace />;

  const summary = claims?.report.summary;
  const status = claims?.report.status ?? 'CONDITIONAL';

  return (
    <AppShell rightRail={null}>
      <CaseHeader
        patientName={summary?.patient.name ?? 'Unknown patient'}
        patientId={summary?.id}
        hospital={summary?.hospital}
        claimId={claims?.claim_id ?? '—'}
        amount={summary?.claimedAmount ?? 0}
        status={status}
        aiConfidence={claims?.report.confidence}
        onApprove={() => alert('Approve (A)')}
        onConditional={() => alert('Conditional (C)')}
        onReject={() => alert('Reject (R)')}
        onQuery={() => alert('Query (Q)')}
      />

      <div className='px-6'>
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <TabsList className='mb-6'>
            <TabsTrigger value='decision'>Decision</TabsTrigger>
            <TabsTrigger value='imaging' count={imaging?.aiFindings?.length}>
              Imaging
            </TabsTrigger>
            <TabsTrigger value='forgery' count={forgery.length || undefined}>
              Forgery
            </TabsTrigger>
            <TabsTrigger value='documents'>Documents</TabsTrigger>
            <TabsTrigger value='audit'>Audit</TabsTrigger>
          </TabsList>

          <TabsContent value='decision' className='pb-12'>
            {claims ? (
              <Suspense fallback={<PanelLoader />}>
                <ClaimDashboard />
              </Suspense>
            ) : (
              <EmptyState
                title='No decision data'
                description='Run the Claim Decision Engine on this case to populate this tab.'
              />
            )}
          </TabsContent>

          <TabsContent value='imaging' className='pb-12'>
            {imaging ? (
              <Suspense fallback={<PanelLoader />}>
                <ImagingDashboard />
              </Suspense>
            ) : (
              <EmptyState
                title='No imaging analysis'
                description='Run the Image Validation Engine to populate this tab.'
              />
            )}
          </TabsContent>

          <TabsContent value='forgery' className='pb-12'>
            <Surface>
              {forgery.length === 0 ? (
                <EmptyState title='No forgery scan results' description='Upload documents and run forgery detection.' />
              ) : (
                <ul className='divide-y divide-border'>
                  {forgery.map((f, i) => (
                    <li key={i} className='py-3 flex items-center justify-between'>
                      <span className='text-body'>{f.fileName}</span>
                      <span className='text-small text-text-subtle'>{(f as any).verdict ?? 'reviewed'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Surface>
          </TabsContent>

          <TabsContent value='documents' className='pb-12'>
            <Surface>
              <EmptyState title='Documents view' description='Searchable list with PDF preview pane lands here next.' />
            </Surface>
          </TabsContent>

          <TabsContent value='audit' className='pb-12'>
            <Surface>
              <EmptyState title='Audit trail' description='All status changes, with who/when, will appear here.' />
            </Surface>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
