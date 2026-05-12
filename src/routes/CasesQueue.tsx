import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Search } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { AppShell } from '@/components/AppShell/AppShell';
import {
  Button, Input, StatusBadge,
  Table, THead, TBody, TR, TH, TD, EmptyState,
} from '@/ui';
import { formatCurrency } from '@/utils/formatters';
import type { Status } from '@/types/common';

interface CaseRow {
  id: string;
  patient: string;
  hospital: string;
  amount: number;
  status: Status;
  confidence: number;
  slaHours: number;
  assignee: string;
  updatedAt: string;
}

/**
 * Builds the queue from any in-store data + a small mock pool.
 * In the real app this comes from /cases endpoint.
 */
function useCaseRows(): CaseRow[] {
  const claimsData = useAppSelector((s) => s.claims.apiData);

  return useMemo(() => {
    const rows: CaseRow[] = [
      { id: 'CL-2026-0419', patient: 'Asha Verma',     hospital: 'Apollo Hyderabad',   amount: 184500, status: 'CONDITIONAL', confidence: 78, slaHours: 4,  assignee: 'You',         updatedAt: '12m ago' },
      { id: 'CL-2026-0418', patient: 'Rohit Mehta',    hospital: 'Fortis Bengaluru',   amount: 92300,  status: 'APPROVED',    confidence: 94, slaHours: 22, assignee: 'You',         updatedAt: '1h ago'  },
      { id: 'CL-2026-0417', patient: 'Sneha Patil',    hospital: 'Manipal Pune',       amount: 248900, status: 'REJECTED',    confidence: 88, slaHours: 0,  assignee: 'P. Iyer',     updatedAt: '3h ago'  },
      { id: 'CL-2026-0416', patient: 'Mohammad Iqbal', hospital: 'Max Delhi',          amount: 412000, status: 'CONDITIONAL', confidence: 71, slaHours: 9,  assignee: 'You',         updatedAt: '4h ago'  },
      { id: 'CL-2026-0415', patient: 'Lakshmi Nair',   hospital: 'Kauvery Chennai',    amount: 67800,  status: 'APPROVED',    confidence: 96, slaHours: 28, assignee: 'A. Rao',      updatedAt: '6h ago'  },
    ];
    if (claimsData?.claim_id) {
      rows.unshift({
        id: claimsData.claim_id,
        patient: claimsData.report.summary.patient.name,
        hospital: claimsData.report.summary.hospital || '—',
        amount: claimsData.report.summary.claimedAmount,
        status: claimsData.report.status,
        confidence: claimsData.report.confidence,
        slaHours: 6,
        assignee: 'You',
        updatedAt: 'Just now',
      });
    }
    return rows;
  }, [claimsData]);
}

export default function CasesQueue() {
  const rows = useCaseRows();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = rows.filter((r) =>
    [r.id, r.patient, r.hospital].some((v) => v.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <AppShell>
      <div className="px-6 py-6 max-w-[1440px] mx-auto">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-h1 text-text">Cases</h1>
            <p className="text-small text-text-subtle mt-1">{filtered.length} cases · sorted by SLA</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" leadingIcon={<Filter size={16} />}>Filter</Button>
            <Button variant="primary" leadingIcon={<Plus size={16} />} onClick={() => navigate('/cases/new')}>
              New Case
            </Button>
          </div>
        </header>

        <div className="mb-4 max-w-md">
          <Input
            placeholder="Search by case ID, patient, hospital…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={<Search size={16} />}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No cases match your search"
            description="Try clearing filters or check back when new cases are assigned."
            action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>}
          />
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Case ID</TH>
                <TH>Patient</TH>
                <TH>Hospital</TH>
                <TH align="right">Amount</TH>
                <TH>Status</TH>
                <TH align="right">AI Confidence</TH>
                <TH align="right">SLA</TH>
                <TH>Assignee</TH>
                <TH>Updated</TH>
              </tr>
            </THead>
            <TBody>
              {filtered.map((r) => (
                <TR
                  key={r.id}
                  flagged={r.slaHours <= 4 && r.status === 'CONDITIONAL' ? 'warning' : undefined}
                  className="cursor-pointer"
                  onClick={() => navigate(`/cases/${r.id}`)}
                >
                  <TD mono>{r.id}</TD>
                  <TD>{r.patient}</TD>
                  <TD className="text-text-muted">{r.hospital}</TD>
                  <TD mono align="right">{formatCurrency(r.amount)}</TD>
                  <TD><StatusBadge status={r.status} /></TD>
                  <TD mono align="right">{r.confidence}</TD>
                  <TD mono align="right" className={r.slaHours <= 4 ? 'text-warning-fg' : ''}>
                    {r.slaHours === 0 ? '—' : `${r.slaHours}h`}
                  </TD>
                  <TD className="text-text-muted">{r.assignee}</TD>
                  <TD className="text-text-subtle">{r.updatedAt}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </div>
    </AppShell>
  );
}
