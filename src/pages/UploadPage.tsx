import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useAppDispatch } from '@/app/hooks';
import { useUploadForImagingMutation, useUploadForClaimsMutation, useUploadForForgeryMutation } from '@/services/uploadApi';
import { setClaimApiData, setClaimApiError } from '@/features/claims/claimsSlice';
import { setImagingApiData, setImagingApiError } from '@/features/imaging/imagingSlice';
import { setForgeryData, setForgeryError } from '@/features/forgery/forgerySlice';
import { normalizeImagingResponse } from '@/utils/imagingNormalizer';

const ACCEPTED = '.pdf,.jpg,.jpeg';
const ACCEPTED_MIME = ['application/pdf', 'image/jpeg', 'image/jpg'];

function extractErrorMessage(reason: unknown, engine: string): string {
  if (!reason) return `${engine} failed with an unknown error.`;

  // RTK Query serialised error: { status, data } or { status: 'FETCH_ERROR', error }
  if (typeof reason === 'object' && reason !== null) {
    const r = reason as Record<string, unknown>;

    if (r.status === 'FETCH_ERROR' || r.name === 'TypeError') {
      return `${engine} is unreachable. The service may be offline or your network blocked the request.`;
    }
    if (typeof r.status === 'number') {
      const statusLabel: Record<number, string> = {
        400: 'Bad request — the uploaded files may not be in a supported format.',
        401: 'Unauthorised — check your API credentials.',
        403: 'Forbidden — you don\'t have access to this service.',
        404: 'Endpoint not found — the service URL may have changed.',
        413: 'Files too large — try uploading fewer or smaller files.',
        422: 'Unprocessable files — the engine couldn\'t parse the document content.',
        429: 'Too many requests — please wait a moment and try again.',
        500: 'The server encountered an internal error. Try again in a few seconds.',
        502: 'Bad gateway — the service is temporarily unavailable.',
        503: 'Service unavailable — the analysis engine is down for maintenance.',
      };
      const detail = statusLabel[r.status] ?? `Server responded with status ${r.status}.`;
      return `${engine} failed: ${detail}`;
    }
    if (typeof r.error === 'string' && r.error.length > 0) {
      return `${engine} failed: ${r.error}`;
    }
    if (typeof r.message === 'string' && r.message.length > 0) {
      return `${engine} failed: ${r.message}`;
    }
  }

  if (typeof reason === 'string' && reason.length > 0) {
    return `${engine} failed: ${reason}`;
  }

  return `${engine} returned an unexpected error. Please try again.`;
}

function FileChip({ file, onRemove }: { file: File; onRemove: () => void }) {
  const ext = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
  return (
    <div className="flex items-center gap-2 glass-sm rounded-lg px-3 py-2 text-xs text-slate-300">
      <span className="text-[10px] font-bold font-heading tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded px-1.5 py-0.5">
        {ext}
      </span>
      <span className="truncate max-w-[180px]">{file.name}</span>
      <button
        onClick={onRemove}
        className="ml-auto text-slate-500 hover:text-red-400 transition-colors shrink-0"
        aria-label="Remove file"
      >
        ✕
      </button>
    </div>
  );
}

type EngineStatus = 'loading' | 'done' | 'failed';

const ENGINE_LABELS: { key: keyof EngineStatuses; label: string }[] = [
  { key: 'claims',  label: 'Claim Decision Engine'     },
  { key: 'imaging', label: 'Image Validation Engine'   },
  { key: 'forgery', label: 'Document Forgery Detector' },
];

interface EngineStatuses {
  claims:  EngineStatus;
  imaging: EngineStatus;
  forgery: EngineStatus;
}

function StatusIcon({ status }: { status: EngineStatus }) {
  if (status === 'done')    return <FiCheckCircle size={15} className="text-emerald-400 flex-shrink-0" />;
  if (status === 'failed')  return <FiXCircle     size={15} className="text-red-400 flex-shrink-0" />;
  return (
    <span className="flex-shrink-0 w-[15px] h-[15px] rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
  );
}

function LoadingOverlay({ statuses }: { statuses: EngineStatuses }) {
  const allDone   = Object.values(statuses).every((s) => s === 'done');
  const anyFailed = Object.values(statuses).some((s) => s === 'failed');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
        {/* Top spinner */}
        <div className="relative w-12 h-12">
          <span className="absolute inset-0 rounded-full border-2 border-blue-500/15" />
          <span className={`absolute inset-0 rounded-full border-t-2 border-blue-500 ${allDone ? '' : 'animate-spin'}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiLoader size={16} className={`text-blue-400 ${allDone ? '' : 'animate-spin'}`} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-slate-200">
            {allDone ? 'Analysis complete' : anyFailed ? 'Some engines failed' : 'Analyzing claim documents'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {allDone ? 'Redirecting…' : 'Running all engines in parallel'}
          </p>
        </div>

        {/* Per-engine status rows */}
        <div className="w-full space-y-2">
          {ENGINE_LABELS.map(({ key, label }) => {
            const s = statuses[key];
            return (
              <div
                key={key}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors',
                  s === 'done'    ? 'bg-emerald-500/[0.06] border-emerald-500/20' :
                  s === 'failed'  ? 'bg-red-500/[0.06]     border-red-500/20'     :
                                    'bg-white/[0.03]       border-white/[0.06]',
                ].join(' ')}
              >
                <StatusIcon status={s} />
                <span className={`flex-1 text-xs font-medium ${
                  s === 'done'   ? 'text-emerald-400' :
                  s === 'failed' ? 'text-red-400'     :
                                   'text-slate-300'
                }`}>
                  {label}
                </span>
                <span className={`text-[10px] font-semibold ${
                  s === 'done'   ? 'text-emerald-500' :
                  s === 'failed' ? 'text-red-500'     :
                                   'text-blue-400'
                }`}>
                  {s === 'done' ? 'Done' : s === 'failed' ? 'Failed' : 'Running…'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const inputRef   = useRef<HTMLInputElement>(null);
  const [files, setFiles]       = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [bothFailed, setBothFailed] = useState<string | null>(null);

  const [uploadImaging] = useUploadForImagingMutation();
  const [uploadClaims]  = useUploadForClaimsMutation();
  const [uploadForgery] = useUploadForForgeryMutation();

  const [loading, setLoading]           = useState(false);
  const [engineStatuses, setEngineStatuses] = useState<EngineStatuses>({
    claims:  'loading',
    imaging: 'loading',
    forgery: 'loading',
  });

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) =>
      ACCEPTED_MIME.includes(f.type) || ACCEPTED.split(',').some((ext) => f.name.toLowerCase().endsWith(ext)),
    );
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
  }, []);

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!files.length) return;
    setBothFailed(null);
    setLoading(true);
    setEngineStatuses({ claims: 'loading', imaging: 'loading', forgery: 'loading' });

    const claimId = `CLAIM_${Date.now()}`;

    const track = <T,>(key: keyof EngineStatuses, p: Promise<T>): Promise<T> =>
      p
        .then((r) => { setEngineStatuses((prev) => ({ ...prev, [key]: 'done' }));   return r; })
        .catch((e) => { setEngineStatuses((prev) => ({ ...prev, [key]: 'failed' })); throw e; });

    const [imagingResult, claimsResult, forgeryResult] = await Promise.allSettled([
      track('imaging', uploadImaging({ claimId, files }).unwrap()),
      track('claims',  uploadClaims({ files, claimId }).unwrap()),
      track('forgery', uploadForgery(files).unwrap()),
    ]);

    setLoading(false);

    const imagingOk = imagingResult.status === 'fulfilled';
    const claimsOk  = claimsResult.status  === 'fulfilled';
    const forgeryOk = forgeryResult.status  === 'fulfilled';

    // Stay on upload page only when every engine failed — nothing to show
    if (!imagingOk && !claimsOk && !forgeryOk) {
      const msgs = [
        extractErrorMessage(imagingResult.status === 'rejected' ? imagingResult.reason : null, 'Image Validation Engine'),
        extractErrorMessage(claimsResult.status  === 'rejected' ? claimsResult.reason  : null, 'Claim Decision Engine'),
        extractErrorMessage(forgeryResult.status === 'rejected' ? forgeryResult.reason  : null, 'Document Forgery Detector'),
      ].filter(Boolean);
      setBothFailed(msgs.join('\n') || 'All analysis engines are unreachable. Check your connection and try again.');
      return;
    }

    // Dispatch each result (data or error) to its slice
    if (imagingOk) {
      dispatch(setImagingApiData(normalizeImagingResponse(imagingResult.value)));
    } else {
      dispatch(setImagingApiError(extractErrorMessage(imagingResult.reason, 'Image Validation Engine')));
    }

    if (claimsOk) {
      dispatch(setClaimApiData(claimsResult.value));
    } else {
      dispatch(setClaimApiError(extractErrorMessage(claimsResult.reason, 'Claim Decision Engine')));
    }

    if (forgeryOk) {
      // Inject 0-based page index into each page (the API doesn't include it)
      const normalized = forgeryResult.value.results.map((r) => ({
        ...r,
        pages: r.pages.map((p, i) => ({ ...p, page: i })),
      }));
      dispatch(setForgeryData(normalized));
    } else {
      dispatch(setForgeryError(extractErrorMessage(forgeryResult.reason, 'Document Forgery Detector')));
    }

    navigate('/claims');
  };

  return (
    <>
      {loading && <LoadingOverlay statuses={engineStatuses} />}

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold font-heading text-gradient-blue">ClaimLens</span>
            <span className="text-[10px] font-bold font-heading uppercase tracking-widest text-slate-500 bg-white/[0.05] border border-white/[0.07] rounded px-2 py-0.5">
              AI Review Platform
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-xs">
            Upload claim documents to run the Decision Engine and Image Validation simultaneously.
          </p>
        </div>

        {/* Upload card */}
        <div className="glass rounded-2xl p-8 w-full max-w-lg space-y-6">
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={[
              'border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors select-none',
              dragOver
                ? 'border-blue-500/60 bg-blue-500/[0.06]'
                : 'border-white/[0.10] hover:border-white/[0.20] hover:bg-white/[0.02]',
            ].join(' ')}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
              ↑
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-200">Drop files here or click to browse</p>
              <p className="text-xs text-slate-500 mt-1">PDF, JPG, JPEG — multiple files supported</p>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {files.map((f, i) => (
                <FileChip key={`${f.name}-${i}`} file={f} onRemove={() => removeFile(i)} />
              ))}
            </div>
          )}

          {/* Both-failed error */}
          {bothFailed && (
            <div className="rounded-xl bg-red-500/[0.07] border border-red-500/20 px-4 py-4 flex gap-3">
              <span className="text-red-400 text-base shrink-0 mt-0.5">⚠</span>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-red-400">Analysis failed</p>
                {bothFailed.split('\n').map((line, i) => (
                  <p key={i} className="text-xs text-slate-400 leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || loading}
            className={[
              'w-full py-3 rounded-xl text-sm font-semibold font-heading transition-all',
              files.length === 0 || loading
                ? 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20',
            ].join(' ')}
          >
            {loading ? 'Analyzing…' : `Analyze Claim${files.length > 1 ? ` (${files.length} files)` : ''}`}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-600 text-center">
          Files are sent to the analysis engines and not stored anywhere.
        </p>
      </div>
    </>
  );
}
