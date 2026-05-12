import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Upload, X, AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { useUploadForImagingMutation, useUploadForClaimsMutation, useUploadForForgeryMutation } from '@/services/uploadApi';
import { setClaimApiData, setClaimApiError } from '@/features/claims/claimsSlice';
import { setImagingApiData, setImagingApiError } from '@/features/imaging/imagingSlice';
import { setForgeryData, setForgeryError } from '@/features/forgery/forgerySlice';
import { normalizeImagingResponse } from '@/utils/imagingNormalizer';
import { Surface, Button, Badge } from '@/ui';
import { cn } from '@/lib/cn';

const ACCEPTED = '.pdf,.jpg,.jpeg';
const ACCEPTED_MIME = ['application/pdf', 'image/jpeg', 'image/jpg'];

function extractErrorMessage(reason: unknown, engine: string): string {
  if (!reason) return `${engine} failed with an unknown error.`;
  if (typeof reason === 'object' && reason !== null) {
    const r = reason as Record<string, unknown>;
    if (r.status === 'FETCH_ERROR' || r.name === 'TypeError') {
      return `${engine} is unreachable. The service may be offline or your network blocked the request.`;
    }
    if (typeof r.status === 'number') {
      const m: Record<number, string> = {
        400: 'Bad request — the uploaded files may not be in a supported format.',
        401: 'Unauthorised — check your API credentials.',
        403: "Forbidden — you don't have access to this service.",
        404: 'Endpoint not found — the service URL may have changed.',
        413: 'Files too large — try uploading fewer or smaller files.',
        422: "Unprocessable files — the engine couldn't parse the document content.",
        429: 'Too many requests — please wait a moment and try again.',
        500: 'The server encountered an internal error. Try again in a few seconds.',
        502: 'Bad gateway — the service is temporarily unavailable.',
        503: 'Service unavailable — the analysis engine is down for maintenance.',
      };
      return `${engine} failed: ${m[r.status] ?? `Server responded with status ${r.status}.`}`;
    }
    if (typeof r.error === 'string' && r.error.length > 0)   return `${engine} failed: ${r.error}`;
    if (typeof r.message === 'string' && r.message.length > 0) return `${engine} failed: ${r.message}`;
  }
  if (typeof reason === 'string' && reason.length > 0) return `${engine} failed: ${reason}`;
  return `${engine} returned an unexpected error. Please try again.`;
}

type EngineStatus = 'loading' | 'done' | 'failed';
interface EngineStatuses { claims: EngineStatus; imaging: EngineStatus; forgery: EngineStatus; }

const ENGINES: { key: keyof EngineStatuses; label: string }[] = [
  { key: 'claims',  label: 'Claim Decision Engine' },
  { key: 'imaging', label: 'Image Validation Engine' },
  { key: 'forgery', label: 'Document Forgery Detector' },
];

function StatusIcon({ status }: { status: EngineStatus }) {
  if (status === 'done')   return <CheckCircle2 size={16} className="text-success-fg flex-shrink-0" />;
  if (status === 'failed') return <XCircle size={16} className="text-danger-fg flex-shrink-0" />;
  return <span className="h-4 w-4 rounded-full border-2 border-border border-t-brand-500 animate-spin flex-shrink-0" />;
}

function LoadingOverlay({ statuses }: { statuses: EngineStatuses }) {
  const allDone   = Object.values(statuses).every((s) => s === 'done');
  const anyFailed = Object.values(statuses).some((s) => s === 'failed');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 p-4">
      <Surface elevation={2} padding="comfortable" className="max-w-sm w-full">
        <div className="flex flex-col items-center gap-5">
          <div className="h-10 w-10 rounded-full border-2 border-border border-t-brand-500 animate-spin" />
          <div className="text-center">
            <p className="text-h3 text-text">
              {allDone ? 'Analysis complete' : anyFailed ? 'Some engines failed' : 'Analyzing claim documents'}
            </p>
            <p className="text-small text-text-subtle mt-1">
              {allDone ? 'Redirecting…' : 'Running all engines in parallel'}
            </p>
          </div>
          <ul className="w-full space-y-2">
            {ENGINES.map(({ key, label }) => {
              const s = statuses[key];
              return (
                <li
                  key={key}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md border',
                    s === 'done'   ? 'bg-success-bg border-success-border' :
                    s === 'failed' ? 'bg-danger-bg  border-danger-border'  :
                                     'bg-surface    border-border',
                  )}
                >
                  <StatusIcon status={s} />
                  <span className={cn(
                    'flex-1 text-body-strong',
                    s === 'done' ? 'text-success-fg' : s === 'failed' ? 'text-danger-fg' : 'text-text',
                  )}>
                    {label}
                  </span>
                  <span className="text-caption text-text-subtle">
                    {s === 'done' ? 'Done' : s === 'failed' ? 'Failed' : 'Running…'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Surface>
    </div>
  );
}

function FileChip({ file, onRemove }: { file: File; onRemove: () => void }) {
  const ext = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
  return (
    <div className="flex items-center gap-2 bg-surface border border-border rounded-md px-3 py-2 text-body">
      <Badge tone="brand">{ext}</Badge>
      <span className="truncate flex-1 text-text">{file.name}</span>
      <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove file" className="h-7 w-7">
        <X size={14} />
      </Button>
    </div>
  );
}

export default function UploadPage() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const inputRef   = useRef<HTMLInputElement>(null);
  const [files, setFiles]       = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [allFailed, setAllFailed] = useState<string | null>(null);

  const [uploadImaging] = useUploadForImagingMutation();
  const [uploadClaims]  = useUploadForClaimsMutation();
  const [uploadForgery] = useUploadForForgeryMutation();

  const [loading, setLoading] = useState(false);
  const [engineStatuses, setEngineStatuses] = useState<EngineStatuses>({
    claims: 'loading', imaging: 'loading', forgery: 'loading',
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
    setAllFailed(null);
    setLoading(true);
    setEngineStatuses({ claims: 'loading', imaging: 'loading', forgery: 'loading' });

    const claimId = `CLAIM_${Date.now()}`;
    const track = <T,>(key: keyof EngineStatuses, p: Promise<T>): Promise<T> =>
      p.then((r) => { setEngineStatuses((prev) => ({ ...prev, [key]: 'done' }));   return r; })
       .catch((e) => { setEngineStatuses((prev) => ({ ...prev, [key]: 'failed' })); throw e; });

    const [imagingResult, claimsResult, forgeryResult] = await Promise.allSettled([
      track('imaging', uploadImaging({ claimId, files }).unwrap()),
      track('claims',  uploadClaims({ files, claimId }).unwrap()),
      track('forgery', uploadForgery(files).unwrap()),
    ]);
    setLoading(false);

    const imagingOk = imagingResult.status === 'fulfilled';
    const claimsOk  = claimsResult.status  === 'fulfilled';
    const forgeryOk = forgeryResult.status === 'fulfilled';

    if (!imagingOk && !claimsOk && !forgeryOk) {
      const msgs = [
        extractErrorMessage(imagingResult.status === 'rejected' ? imagingResult.reason : null, 'Image Validation Engine'),
        extractErrorMessage(claimsResult.status  === 'rejected' ? claimsResult.reason  : null, 'Claim Decision Engine'),
        extractErrorMessage(forgeryResult.status === 'rejected' ? forgeryResult.reason : null, 'Document Forgery Detector'),
      ].filter(Boolean);
      setAllFailed(msgs.join('\n') || 'All analysis engines are unreachable. Check your connection and try again.');
      return;
    }

    if (imagingOk) dispatch(setImagingApiData(normalizeImagingResponse(imagingResult.value)));
    else dispatch(setImagingApiError(extractErrorMessage(imagingResult.reason, 'Image Validation Engine')));

    if (claimsOk) dispatch(setClaimApiData(claimsResult.value));
    else dispatch(setClaimApiError(extractErrorMessage(claimsResult.reason, 'Claim Decision Engine')));

    if (forgeryOk) {
      const normalized = forgeryResult.value.results.map((r) => ({
        ...r,
        pages: r.pages.map((p, i) => ({ ...p, page: i })),
      }));
      dispatch(setForgeryData(normalized));
    } else {
      dispatch(setForgeryError(extractErrorMessage(forgeryResult.reason, 'Document Forgery Detector')));
    }

    const newClaimId = claimsOk ? claimsResult.value.claim_id : 'new';
    navigate(`/cases/${newClaimId}`);
  };

  return (
    <>
      {loading && <LoadingOverlay statuses={engineStatuses} />}

      <div className="px-6 py-10 max-w-[720px] mx-auto">
        <header className="mb-6">
          <h1 className="text-h1 text-text">New case — upload documents</h1>
          <p className="text-body text-text-muted mt-1">
            Files are sent to all three analysis engines in parallel. Results populate the case workspace once complete.
          </p>
        </header>

        <Surface padding="comfortable">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer select-none',
              'transition-colors duration-fast',
              dragOver ? 'border-brand-500 bg-brand-50' : 'border-border-strong hover:border-brand-500 hover:bg-surface-muted',
            )}
            role="button"
            tabIndex={0}
          >
            <div className="h-12 w-12 rounded-md bg-brand-50 text-brand-700 grid place-items-center">
              <Upload size={20} />
            </div>
            <div className="text-center">
              <p className="text-body-strong text-text">Drop files here or click to browse</p>
              <p className="text-small text-text-subtle mt-1">PDF, JPG, JPEG — multiple files supported</p>
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

          {files.length > 0 && (
            <ul className="space-y-1.5 mt-4 max-h-52 overflow-y-auto pr-1">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`}>
                  <FileChip file={f} onRemove={() => removeFile(i)} />
                </li>
              ))}
            </ul>
          )}

          {allFailed && (
            <div className="mt-4 rounded-md bg-danger-bg border border-danger-border px-4 py-3 flex gap-2">
              <AlertTriangle size={16} className="text-danger-fg flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-body-strong text-danger-fg">Analysis failed</p>
                {allFailed.split('\n').map((line, i) => (
                  <p key={i} className="text-small text-danger-fg/90">{line}</p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-small text-text-subtle">
              {files.length === 0 ? 'No files selected' : `${files.length} file${files.length > 1 ? 's' : ''} ready`}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={files.length === 0 || loading}
            >
              {loading ? 'Analyzing…' : 'Run analysis'}
            </Button>
          </div>
        </Surface>

        <p className="mt-4 text-caption text-text-subtle text-center">
          Files are sent to the analysis engines and not stored anywhere.
        </p>
      </div>
    </>
  );
}
