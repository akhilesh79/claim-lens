import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiAlertTriangle, FiCheckCircle, FiZoomIn } from 'react-icons/fi';
import { Document, Page, pdfjs } from 'react-pdf';
import type { ForgeryFileResult, ForgeryPage, ForgeryDetection } from '@/types/forgery';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

function toProxiedUrl(link: string): string {
  try {
    const { pathname } = new URL(link);
    return `/forgery-proxy${pathname}`;
  } catch {
    return link;
  }
}

const THUMB_W = 220;
const PDF_REF_W = 1654;
const PDF_REF_H = 2338;

const CATEGORY_META: Record<string, { label: string; color: string; fill: string }> = {
  C1: { label: 'Copy-Paste', color: '#ef4444', fill: 'rgba(239,68,68,0.18)' },
  C2: { label: 'Overwrite Text', color: '#f59e0b', fill: 'rgba(245,158,11,0.18)' },
  C3: { label: 'Splicing', color: '#ef4444', fill: 'rgba(239,68,68,0.18)' },
  C4: { label: 'Erasure', color: '#f59e0b', fill: 'rgba(245,158,11,0.18)' },
  C10: { label: 'No Forgery', color: '#10b981', fill: 'rgba(16,185,129,0.12)' },
};

function categoryMeta(id: string) {
  return CATEGORY_META[id] ?? { label: id, color: '#ef4444', fill: 'rgba(239,68,68,0.18)' };
}

function confidencePct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

// ── SVG bounding box overlay ──────────────────────────────────────────────────
function BBoxOverlay({ detections, viewW, viewH }: { detections: ForgeryDetection[]; viewW: number; viewH: number }) {
  if (!detections.length) return null;
  return (
    <svg
      className='absolute inset-0 w-full h-full pointer-events-none'
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio='none'
    >
      {detections.map((d, i) => {
        const meta = categoryMeta(d.category);
        const labelH = 20;
        const labelY = Math.max(0, d.y - labelH - 2);
        return (
          <g key={i}>
            <rect
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              fill={meta.fill}
              stroke={meta.color}
              strokeWidth={Math.max(2, viewW / 500)}
              rx={3}
            />
            <rect x={d.x} y={labelY} width={130} height={labelH} fill={meta.color} rx={3} />
            <text
              x={d.x + 5}
              y={labelY + 14}
              fill='white'
              fontSize={Math.max(11, viewW / 130)}
              fontWeight='bold'
              fontFamily='sans-serif'
            >
              {meta.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Detection list ─────────────────────────────────────────────────────────────
function DetectionList({ detections }: { detections: ForgeryDetection[] }) {
  return (
    <div className='space-y-1.5'>
      {detections.map((d, i) => {
        const meta = categoryMeta(d.category);
        return (
          <div key={i} className='px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] space-y-1'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-1.5 min-w-0'>
                <FiAlertTriangle size={11} style={{ color: meta.color, flexShrink: 0 }} />
                <p className='text-[11px] font-semibold text-slate-200 truncate'>{d.class_name.replace(/_/g, ' ')}</p>
              </div>
              <span
                className='text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0'
                style={{ color: meta.color, background: meta.fill, border: `1px solid ${meta.color}40` }}
              >
                {meta.label}
              </span>
            </div>
            <div className='flex items-center justify-between text-[10px] text-slate-500'>
              <span>
                x:{d.x} y:{d.y} · {d.w}×{d.h}px
              </span>
              <span className='font-medium' style={{ color: meta.color }}>
                {confidencePct(d.confidence)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ detections }: { detections: ForgeryDetection[] }) {
  return detections.length > 0 ? (
    <div className='flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-red-500/[0.08] border border-red-500/20'>
      <FiAlertTriangle size={10} className='text-red-400 flex-shrink-0' />
      <span className='text-[10px] text-red-400 font-semibold truncate'>
        {detections.length} detection{detections.length !== 1 ? 's' : ''}
      </span>
    </div>
  ) : (
    <div className='flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-500/[0.07] border border-emerald-500/15'>
      <FiCheckCircle size={10} className='text-emerald-400 flex-shrink-0' />
      <span className='text-[10px] text-emerald-400 font-semibold'>No forgery</span>
    </div>
  );
}

// ── PDF page card (must live inside a parent <Document>) ─────────────────────
function PdfPageCard({ pageNumber, pageData, onClick }: {
  pageNumber: number;
  pageData: ForgeryPage;
  onClick: () => void;
}) {
  const [ready, setReady] = useState(false);
  const { detections }    = pageData;
  const flagged           = detections.length > 0;
  return (
    <div className='flex flex-col gap-1.5'>
      <div
        className={[
          'relative cursor-zoom-in group rounded-xl overflow-hidden border transition-all bg-slate-800/50',
          flagged
            ? 'border-red-500/30 hover:border-red-400/50 shadow-sm shadow-red-900/20'
            : 'border-white/[0.08] hover:border-blue-500/40',
        ].join(' ')}
        onClick={onClick}
      >
        <Page
          pageNumber={pageNumber}
          width={THUMB_W}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onRenderSuccess={() => setReady(true)}
          className='block'
        />
        {ready && <BBoxOverlay detections={detections} viewW={PDF_REF_W} viewH={PDF_REF_H} />}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl'>
          <FiZoomIn size={22} className='text-white drop-shadow-lg' />
        </div>
        {flagged && <div className='absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 shadow shadow-red-500/60' />}
      </div>
      <span className='text-center text-[11px] font-semibold text-slate-400 tabular-nums'>{pageNumber}</span>
      <StatusPill detections={detections} />
    </div>
  );
}

// ── Image page card ───────────────────────────────────────────────────────────
function ImagePageCard({ src, pageIndex, pageData, onClick }: {
  src: string;
  pageIndex: number;
  pageData: ForgeryPage;
  onClick: () => void;
}) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const { detections } = pageData;
  const flagged        = detections.length > 0;
  return (
    <div className='flex flex-col gap-1.5'>
      <div
        className={[
          'relative cursor-zoom-in group rounded-xl overflow-hidden border transition-all bg-slate-800/50',
          flagged
            ? 'border-red-500/30 hover:border-red-400/50 shadow-sm shadow-red-900/20'
            : 'border-white/[0.08] hover:border-blue-500/40',
        ].join(' ')}
        onClick={onClick}
      >
        <img
          src={src}
          alt={`Page ${pageIndex + 1}`}
          style={{ width: THUMB_W, display: 'block' }}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
          }}
        />
        {naturalSize && <BBoxOverlay detections={detections} viewW={naturalSize.w} viewH={naturalSize.h} />}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl'>
          <FiZoomIn size={22} className='text-white drop-shadow-lg' />
        </div>
        {flagged && <div className='absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 shadow shadow-red-500/60' />}
      </div>
      <span className='text-center text-[11px] font-semibold text-slate-400 tabular-nums'>{pageIndex + 1}</span>
      <StatusPill detections={detections} />
    </div>
  );
}

// ── Lightbox zoom (full-res page with bboxes) ─────────────────────────────────
function LightboxImageView({ src, detections }: { src: string; detections: ForgeryDetection[] }) {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  return (
    <div className='relative w-full rounded-xl overflow-hidden border border-white/[0.06] bg-slate-800/60'>
      <img
        src={src}
        alt='Document page'
        className='w-full block'
        onLoad={(e) => {
          const img = e.currentTarget;
          setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        }}
      />
      {naturalSize && <BBoxOverlay detections={detections} viewW={naturalSize.w} viewH={naturalSize.h} />}
    </div>
  );
}

function LightboxPdfView({
  src,
  detections,
  pageNumber,
  fixedWidth,
}: {
  src: string;
  detections: ForgeryDetection[];
  pageNumber: number;
  fixedWidth: number;
}) {
  const proxiedSrc = toProxiedUrl(src);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    setPageReady(false);
  }, [pageNumber]);

  return (
    <div
      ref={containerRef}
      className='relative w-full rounded-xl overflow-hidden border border-white/[0.06] bg-slate-800/40'
      style={{ minHeight: '320px' }}
    >
      <Document
        file={proxiedSrc}
        loading={
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
            <span className='w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin' />
            <span className='text-xs text-slate-400'>Loading PDF…</span>
          </div>
        }
        error={
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center'>
            <span className='text-sm font-semibold text-red-400'>Failed to load PDF</span>
            <span className='text-xs text-slate-500'>Check network or restart the dev server.</span>
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          width={fixedWidth}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onRenderSuccess={() => setPageReady(true)}
          className='block'
        />
      </Document>
      {pageReady && <BBoxOverlay detections={detections} viewW={PDF_REF_W} viewH={PDF_REF_H} />}
    </div>
  );
}

function Lightbox({
  isImage,
  src,
  detections,
  pageNumber,
  onClose,
}: {
  isImage: boolean;
  src: string;
  detections: ForgeryDetection[];
  pageNumber: number;
  onClose: () => void;
}) {
  const zoomW = Math.min((typeof window !== 'undefined' ? window.innerWidth : 1200) * 0.85, 1100);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className='fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6'
      onClick={onClose}
    >
      <button
        className='absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors z-10'
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FiX size={16} />
      </button>
      <div
        className='max-w-[90vw] max-h-[90vh] overflow-auto rounded-xl'
        style={{ maxWidth: `${zoomW}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {isImage ? (
          <LightboxImageView src={src} detections={detections} />
        ) : (
          <LightboxPdfView src={src} detections={detections} pageNumber={pageNumber} fixedWidth={zoomW} />
        )}
      </div>
    </motion.div>
  );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
interface ForgeryDrawerProps {
  result: ForgeryFileResult | null;
  onClose: () => void;
}

export function ForgeryDrawer({ result, onClose }: ForgeryDrawerProps) {
  const [zoomedPage, setZoomedPage] = useState<number | null>(null);

  useEffect(() => {
    setZoomedPage(null);
  }, [result?.link]);

  const isImage = result ? /\.(jpg|jpeg|png|webp)$/i.test(result.fileName) : false;
  const totalDets = result?.pages.reduce((s, p) => s + p.detections.length, 0) ?? 0;
  const proxiedSrc = result ? toProxiedUrl(result.link) : '';

  return (
    <>
      <AnimatePresence>
        {result && (
          <>
            {/* Backdrop */}
            <motion.div
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              key='drawer'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className='fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-[600px] md:max-w-[820px] flex flex-col'
              style={{
                background: 'var(--glass-bg-elevated, rgba(10,13,20,0.97))',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* ── Header ── */}
              <div className='flex items-start gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] flex-shrink-0'>
                <div className='flex-1 min-w-0'>
                  <p className='text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-0.5'>
                    Document Forgery Analysis
                  </p>
                  <div className='flex items-center gap-2 mt-1.5'>
                    <span className='text-xs text-slate-500'>
                      {result.pages.length} page{result.pages.length !== 1 ? 's' : ''}
                    </span>
                    <span className='text-slate-700'>·</span>
                    {totalDets > 0 ? (
                      <span className='text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5'>
                        {totalDets} detection{totalDets !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className='text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5'>
                        All Clean
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className='w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors flex-shrink-0 mt-1'
                >
                  <FiX size={15} />
                </button>
              </div>

              {/* ── Grid body: pages as cards ── */}
              <div className='flex-1 min-h-0 overflow-y-auto p-4 sm:p-5'>
                {isImage ? (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                    {result.pages.map((page, i) => (
                      <ImagePageCard
                        key={i}
                        src={result.link}
                        pageIndex={i}
                        pageData={page}
                        onClick={() => setZoomedPage(i)}
                      />
                    ))}
                  </div>
                ) : (
                  <Document
                    file={proxiedSrc}
                    loading={
                      <div className='flex flex-col items-center justify-center gap-3 py-20'>
                        <span className='w-7 h-7 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin' />
                        <span className='text-xs text-slate-400'>Loading PDF…</span>
                      </div>
                    }
                    error={
                      <div className='flex flex-col items-center justify-center gap-2 py-20 px-6 text-center'>
                        <span className='text-sm font-semibold text-red-400'>Failed to load PDF</span>
                        <span className='text-xs text-slate-500'>Check network or restart the dev server.</span>
                      </div>
                    }
                  >
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                      {result.pages.map((page, i) => (
                        <PdfPageCard
                          key={i}
                          pageNumber={i + 1}
                          pageData={page}
                          onClick={() => setZoomedPage(i)}
                        />
                      ))}
                    </div>
                  </Document>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Zoom lightbox ── */}
      <AnimatePresence>
        {zoomedPage !== null && result && (
          <Lightbox
            isImage={isImage}
            src={result.link}
            detections={result.pages[zoomedPage]?.detections ?? []}
            pageNumber={zoomedPage + 1}
            onClose={() => setZoomedPage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
