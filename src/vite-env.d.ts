/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMAGING_API_BASE: string;
  readonly VITE_CLAIMS_API_BASE: string;
  readonly VITE_CLAIMS_API_KEY: string;
  readonly VITE_FORGERY_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
