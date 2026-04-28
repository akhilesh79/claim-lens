import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  footer?: ReactNode;
  className?: string;
  rowHighlight?: (row: T) => boolean;
  emptyText?: string;
}

export function DataTable<T>({
  columns,
  data,
  footer,
  className = '',
  rowHighlight,
  emptyText = 'No data',
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm min-w-max">
        <thead>
          <tr className="border-b border-white/[0.07]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={`pb-2.5 pt-1 px-2 first:pl-0 last:pr-0 text-${col.align ?? 'left'}
                  text-[10px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-xs text-slate-600">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-white/[0.04] last:border-0 transition-colors
                  ${rowHighlight?.(row) ? 'bg-red-500/[0.04]' : 'hover:bg-white/[0.02]'}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-2 first:pl-0 last:pr-0 text-${col.align ?? 'left'} ${col.className ?? ''}`}
                  >
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {footer && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">{footer}</div>
      )}
    </div>
  );
}
