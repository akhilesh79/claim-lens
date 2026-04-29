import { motion } from 'framer-motion';
import { FiMonitor } from 'react-icons/fi';
import { SectionContainer } from '@/components/ui';
import type { AIFinding, ScanViewerInfo, ImageInventory } from '@/types/imaging';

interface Props {
  findings: AIFinding[];
  imageQuality: string | null;
  scanViewer: ScanViewerInfo;
  modality: string;
  imageInventory: ImageInventory;
}

const MODALITY_ICON: Record<string, string> = {
  'Coronary Angiogram': '🫀',
  'X-Ray': '🔬',
  'CT Scan': '🩻',
  'MRI': '🧲',
  'Echocardiogram': '💓',
  'Ultrasound': '🔊',
};

const STAGE_COLOR: Record<string, string> = {
  'pre-procedure': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'intra-procedure': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'post-procedure': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const MODALITY_BAR_COLOR: Record<string, string> = {
  'Typed report': 'bg-slate-500',
  'Coronary Angiogram': 'bg-red-500',
  'X-Ray': 'bg-blue-500',
  'CT Scan': 'bg-violet-500',
  'MRI': 'bg-cyan-500',
};

function shortFilename(src: string): string {
  const name = src.split('/').pop() ?? src;
  return name.length > 42 ? `…${name.slice(-39)}` : name;
}

export function ImageViewer({ findings, imageQuality, scanViewer, modality, imageInventory }: Props) {
  const icon = MODALITY_ICON[modality] ?? '📋';
  const detectedFindings = findings.filter((f) => f.detected);
  const totalImages = imageInventory.totalImages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <SectionContainer title="Scan Overview" icon={<FiMonitor size={14} />} defaultOpen>
        <div className="pt-3 space-y-4">
          {/* Modality hero */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="text-sm font-semibold text-slate-200">{modality}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono truncate">
                {shortFilename(scanViewer.primaryImageSource)}
              </p>
            </div>
          </div>

          {/* Image count breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Image Inventory</p>
              <span className="text-xs font-semibold text-slate-300 tabular-nums">{totalImages} total</span>
            </div>
            <div className="space-y-2">
              {Object.entries(imageInventory.byType).map(([type, count], i) => {
                const barColor = MODALITY_BAR_COLOR[type] ?? 'bg-slate-500';
                const pct = Math.round((count / totalImages) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">{type}</span>
                      <span className="text-slate-500 tabular-nums font-mono">{count}</span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stages */}
          {imageInventory.stagesPresent.length > 0 && (
            <div>
              <p className="section-label mb-2">Procedure Stages</p>
              <div className="flex flex-wrap gap-1.5">
                {imageInventory.stagesPresent.map((stage) => (
                  <span
                    key={stage}
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${STAGE_COLOR[stage] ?? 'text-slate-400 bg-white/[0.05] border-white/[0.07]'}`}
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI overlay + quality status row */}
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
            <span
              className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                scanViewer.aiOverlaysAvailable
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-slate-600 bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              {scanViewer.aiOverlaysAvailable ? '✓' : '—'}
              AI overlays {scanViewer.aiOverlaysAvailable ? 'available' : 'unavailable'}
            </span>
            <span className="text-[10px] text-slate-600">
              {imageQuality ? (
                <span className={
                  imageQuality === 'High' ? 'text-emerald-400 font-semibold' :
                  imageQuality === 'Moderate' ? 'text-amber-400 font-semibold' :
                  'text-red-400 font-semibold'
                }>
                  {imageQuality} quality
                </span>
              ) : 'Quality N/A'}
            </span>
          </div>

          {/* Detected AI findings (data, no overlay) */}
          {detectedFindings.length > 0 && (
            <div className="pt-1 border-t border-white/[0.06]">
              <p className="section-label mb-2">AI-Flagged Regions</p>
              <div className="space-y-1.5">
                {detectedFindings.map((f) => (
                  <div key={f.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm bg-red-500/70 flex-shrink-0" />
                      <span className="text-slate-300">{f.name}</span>
                      {f.severity && <span className="text-[9px] text-slate-600">· {f.severity}</span>}
                    </div>
                    {f.confidence !== null && (
                      <span className="text-slate-500 font-mono tabular-nums">{f.confidence}%</span>
                    )}
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
