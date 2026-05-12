function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value as string;
}

export const IMAGING_API_BASE = requireEnv('VITE_IMAGING_API_BASE');
export const CLAIMS_API_BASE  = requireEnv('VITE_CLAIMS_API_BASE');
export const CLAIMS_API_KEY   = requireEnv('VITE_CLAIMS_API_KEY');
export const FORGERY_API_BASE = requireEnv('VITE_FORGERY_API_BASE');
