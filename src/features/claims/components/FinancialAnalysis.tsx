import { DollarSign, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { SectionContainer } from '@/components/ui';
import { Badge } from '@/ui';
import { formatCurrency } from '@/utils/formatters';
import type { FinancialItem, FraudSignal } from '@/types/claims';

interface Props {
  items: FinancialItem[];
  fraudSignals: FraudSignal[];
  className?: string;
}

const TONE: Record<FinancialItem['status'], 'success' | 'warning' | 'danger'> = {
  ok: 'success',
  warn: 'warning',
  fail: 'danger',
};

/**
 * Resolve a token CSS variable into rgb() at render time so Recharts gets
 * theme-aware colors without us hardcoding hex.
 */
function tokenColor(name: string): string {
  if (typeof window === 'undefined') return 'rgb(37, 99, 235)';
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `rgb(${v})` : 'rgb(37, 99, 235)';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-elev-2 text-small">
      <p className="text-text-subtle mb-0.5">{label}</p>
      <p className="text-text font-mono font-medium">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function FinancialAnalysis({ items, fraudSignals, className }: Props) {
  const total = items.reduce((s, i) => s + i.amount, 0);

  const chartData = items.map((item) => ({
    name: item.category.split(' ').slice(0, 2).join(' '),
    fullName: item.category,
    amount: item.amount,
    status: item.status,
  }));

  const barColor = (status: FinancialItem['status']) =>
    status === 'fail' ? tokenColor('--color-danger-fg')
      : status === 'warn' ? tokenColor('--color-warning-fg')
      : tokenColor('--color-brand-500');

  const axisColor    = tokenColor('--color-text-subtle');
  const cursorColor  = tokenColor('--color-surface-muted');

  return (
    <div className={className}>
      <SectionContainer title="Financial Analysis" icon={<DollarSign size={14} />} defaultOpen>
        <div className="pt-4 space-y-4">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={24} margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false}
                  interval={0} angle={-25} textAnchor="end" height={40} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `₹${v / 1000}k`} />
                <RechartTooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 pb-2 border-b border-border">
              <span className="label-caption">Category</span>
              <span className="label-caption text-right">Amount</span>
              <span className="label-caption text-center">Status</span>
            </div>
            {items.map((item) => (
              <div
                key={item.category}
                className="grid grid-cols-[1fr_auto_auto] gap-x-3 py-2.5 border-b border-border last:border-0 items-center"
              >
                <span className="text-body text-text-muted">{item.category}</span>
                <span className="num text-text text-right">{formatCurrency(item.amount)}</span>
                <Badge tone={TONE[item.status]} className="justify-center min-w-[64px]">
                  {item.status === 'ok' ? 'OK' : item.status === 'warn' ? 'Review' : 'Flag'}
                </Badge>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 pt-3">
              <span className="text-body-strong text-text">Total Claimed</span>
              <span className="num text-brand-600 text-right">{formatCurrency(total)}</span>
              <span />
            </div>
          </div>

          {fraudSignals.length > 0 && (
            <div className="pt-3 border-t border-border">
              <p className="label-caption text-danger-fg flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} /> Fraud Signals
              </p>
              <ul className="space-y-1.5">
                {fraudSignals.map((sig, i) => (
                  <li key={i}
                    className="flex items-start gap-2 text-body text-danger-fg bg-danger-bg border border-danger-border rounded-md px-3 py-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-danger-fg flex-shrink-0" />
                    {sig.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  );
}
