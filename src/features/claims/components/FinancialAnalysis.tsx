import { motion } from 'framer-motion';
import { FiDollarSign } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { SectionContainer } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';
import type { FinancialItem, FraudSignal } from '@/types/claims';

interface Props {
  items: FinancialItem[];
  fraudSignals: FraudSignal[];
}

const STATUS_BADGE: Record<FinancialItem['status'], { icon: string; cls: string }> = {
  ok: { icon: '✓', cls: 'text-emerald-400 bg-emerald-500/10' },
  warn: { icon: '⚠', cls: 'text-amber-400 bg-amber-500/10' },
  fail: { icon: '✗', cls: 'text-red-400 bg-red-500/10' },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function FinancialAnalysis({ items, fraudSignals }: Props) {
  const total = items.reduce((s, i) => s + i.amount, 0);

  const chartData = items.map((item) => ({
    name: item.category.split(' ').slice(0, 2).join(' '),
    fullName: item.category,
    amount: item.amount,
    status: item.status,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28 }}
    >
      <SectionContainer
        title="Financial Analysis"
        icon={<FiDollarSign size={14} />}
        defaultOpen
      >
        <div className="pt-3 space-y-4">
          {/* Chart */}
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={22} margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={36}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `₹${v / 1000}k`}
                />
                <RechartTooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.status === 'warn' ? '#f59e0b' : entry.status === 'fail' ? '#ef4444' : '#3b82f6'}
                      fillOpacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="space-y-0">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 pb-2 border-b border-white/[0.06]">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Category</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Status</span>
            </div>
            {items.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <div
                  key={item.category}
                  className={`grid grid-cols-[1fr_auto_auto] gap-x-3 py-2.5 border-b border-white/[0.04] last:border-0
                    hover:bg-white/[0.02] transition-colors rounded
                    ${item.status !== 'ok' ? 'bg-amber-500/[0.025]' : ''}`}
                >
                  <span className="text-xs text-slate-300">{item.category}</span>
                  <span className="text-xs font-semibold text-slate-200 text-right font-mono tabular-nums">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-center ${badge.cls}`}>
                    {badge.icon}
                  </span>
                </div>
              );
            })}
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 pt-3 mt-1">
              <span className="text-xs font-bold text-slate-200">Total Claimed</span>
              <span className="text-xs font-black text-blue-400 text-right font-mono tabular-nums">
                {formatCurrency(total)}
              </span>
              <span />
            </div>
          </div>

          {/* Fraud signals */}
          {fraudSignals.length > 0 && (
            <div className="mt-2 pt-3 border-t border-white/[0.06]">
              <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2">
                ⚠ Fraud Signals
              </p>
              <div className="space-y-1.5">
                {fraudSignals.map((sig, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-red-300 bg-red-500/[0.06] border border-red-500/15 rounded-lg px-3 py-2"
                  >
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    {sig.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionContainer>
    </motion.div>
  );
}
