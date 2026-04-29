import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMonitor } from 'react-icons/fi';
import { SectionContainer, Tooltip } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setZoom, setContrast, resetViewport } from '@/features/imaging/imagingSlice';
import type { AIFinding } from '@/types/imaging';

interface Props {
  findings: AIFinding[];
  imageQuality: string;
}

const QUALITY_COLOR: Record<string, string> = {
  High: 'text-emerald-400',
  Moderate: 'text-amber-400',
  Low: 'text-red-400',
};

export function ImageViewer({ findings, imageQuality }: Props) {
  const dispatch = useAppDispatch();
  const { zoomLevel, contrastLevel } = useAppSelector((s) => s.imaging);
  const [hovered, setHovered] = useState<string | null>(null);

  const detected = findings.filter((f) => f.detected);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <SectionContainer
        title="Interactive Scan Viewer"
        icon={<FiMonitor size={14} />}
        defaultOpen
      >
        {/* Viewport controls */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 mb-3">
          <Tooltip content={`Zoom: ${zoomLevel.toFixed(2)}×`}>
            <button
              onClick={() => dispatch(setZoom(zoomLevel + 0.25))}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 transition-colors"
            >
              Zoom +
            </button>
          </Tooltip>
          <button
            onClick={() => dispatch(setZoom(zoomLevel - 0.25))}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 transition-colors"
          >
            Zoom −
          </button>
          <Tooltip content={`Contrast: ${contrastLevel.toFixed(2)}×`}>
            <button
              onClick={() => dispatch(setContrast(contrastLevel + 0.2))}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 transition-colors"
            >
              Contrast +
            </button>
          </Tooltip>
          <button
            onClick={() => dispatch(setContrast(contrastLevel - 0.2))}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 transition-colors"
          >
            Contrast −
          </button>
          <button
            onClick={() => dispatch(resetViewport())}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            Reset
          </button>
          <span className={`ml-auto text-[10px] font-semibold ${QUALITY_COLOR[imageQuality] ?? 'text-slate-500'}`}>
            {imageQuality} Quality
          </span>
        </div>

        {/* Scan viewport */}
        <div
          className="relative scan-bg rounded-xl overflow-hidden select-none"
          style={{
            aspectRatio: '1 / 1',
            maxHeight: 280,
            filter: `contrast(${contrastLevel}) brightness(${0.6 + contrastLevel * 0.2})`,
          }}
        >
          {/* Bone SVG mock */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 300 300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            {/* Background noise texture */}
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
            <rect width="300" height="300" fill="url(#scanBg)" opacity="0.4" filter="url(#noise)" />

            {/* Tibia shaft */}
            <path
              d="M 128 35 C 138 28,162 28,172 35 L 178 195 C 178 218,166 242,156 265 L 144 265 C 134 242,122 218,122 195 Z"
              fill="rgba(180,185,200,0.18)"
              stroke="rgba(210,215,225,0.55)"
              strokeWidth="1.5"
            />
            {/* Cortical bone */}
            <path
              d="M 134 44 C 141 38,159 38,166 44 L 170 190 C 170 208,162 230,153 252 L 147 252 C 138 230,130 208,130 190 Z"
              fill="rgba(200,205,215,0.12)"
            />
            {/* Medullary canal */}
            <ellipse cx="150" cy="145" rx="8" ry="45" fill="rgba(20,25,35,0.5)" />

            {/* FRACTURE LINE — highlighted */}
            <g opacity={hovered === 'fracture' ? 1 : 0.85}>
              <line x1="122" y1="128" x2="178" y2="137"
                stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" opacity="0.9" />
              <line x1="122" y1="128" x2="178" y2="137"
                stroke="#ef4444" strokeWidth="8" opacity="0.15" />
            </g>

            {/* Soft tissue swelling zone */}
            <ellipse cx="150" cy="150" rx="68" ry="55"
              fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="1.5" strokeDasharray="4,4" />
          </svg>

          {/* Fracture bounding box overlay */}
          <motion.div
            className="absolute cursor-pointer"
            style={{ top: '39%', left: '28%', width: '44%', height: '12%' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            onMouseEnter={() => setHovered('fracture')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-full h-full border-2 border-red-500/70 rounded-sm bg-red-500/10 hover:bg-red-500/20 transition-colors" />
            <div className="absolute -top-5 left-0 text-[9px] text-red-400 font-bold whitespace-nowrap bg-red-950/60 px-1.5 py-0.5 rounded">
              Fracture Zone · 94%
            </div>
          </motion.div>

          {/* Swelling overlay */}
          <div
            className="absolute rounded-full border border-amber-500/30"
            style={{ top: '25%', left: '15%', width: '70%', height: '65%', background: 'radial-gradient(ellipse, rgba(245,158,11,0.03) 0%, transparent 70%)' }}
          />

          {/* Scan line animation */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none"
            animate={{ top: ['5%', '95%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />

          {/* Corner info */}
          <div className="absolute top-2 left-2 text-[9px] text-slate-500 font-mono">X-RAY AP VIEW</div>
          <div className="absolute top-2 right-2 text-[9px] text-slate-500 font-mono">
            {zoomLevel.toFixed(2)}× ZOOM
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] text-emerald-500 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI ACTIVE
          </div>
        </div>

        {/* Detected regions */}
        <div className="mt-3 pt-3 border-t border-white/[0.05]">
          <p className="section-label mb-2">Detected Regions</p>
          <div className="space-y-1.5">
            {detected.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-red-500/70" />
                  <span className="text-slate-300">{f.name}</span>
                  {f.severity && (
                    <span className="text-[9px] text-slate-600">· {f.severity}</span>
                  )}
                </div>
                <span className="text-slate-500 font-mono tabular-nums">{f.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </motion.div>
  );
}
