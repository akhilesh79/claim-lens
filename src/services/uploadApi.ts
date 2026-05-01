import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ClaimDecision } from '@/types/claims';
import type { ImagingApiResponse } from '@/types/imaging';
import type { ForgeryApiResponse } from '@/types/forgery';
import { IMAGING_API_BASE, CLAIMS_API_BASE, CLAIMS_API_KEY, FORGERY_API_BASE } from '@/config/apiEndpoints';

interface UploadImagingArgs {
  claimId: string;
  files: File[];
}

interface UploadClaimsArgs {
  files: File[];
  claimId: string;
  packageCode?: string;
}

function toQueryError(e: unknown, status?: number): { error: FetchBaseQueryError } {
  if (status !== undefined) {
    return { error: { status, data: String(e) } };
  }
  return { error: { status: 'FETCH_ERROR', error: String(e) } };
}

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    uploadForImaging: builder.mutation<ImagingApiResponse, UploadImagingArgs>({
      queryFn: async ({ claimId, files }) => {
        try {
          const form = new FormData();
          form.append('claimId', claimId);
          files.forEach((f) => form.append('files', f));

          const res = await fetch(`${IMAGING_API_BASE}/api/summary`, {
            method: 'POST',
            body: form,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => res.statusText);
            return toQueryError(text, res.status);
          }

          const data: ImagingApiResponse = await res.json();
          return { data };
        } catch (e) {
          return toQueryError(e);
        }
      },
    }),

    uploadForClaims: builder.mutation<ClaimDecision, UploadClaimsArgs>({
      queryFn: async ({ files, claimId, packageCode = 'SB039A' }) => {
        try {
          const form = new FormData();
          files.forEach((f) => form.append('files', f));
          form.append('claim_id', claimId);
          form.append('package_code', packageCode);

          const res = await fetch(`${CLAIMS_API_BASE}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${CLAIMS_API_KEY}` },
            body: form,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => res.statusText);
            return toQueryError(text, res.status);
          }

          const data: ClaimDecision = await res.json();
          return { data };
        } catch (e) {
          return toQueryError(e);
        }
      },
    }),

    uploadForForgery: builder.mutation<ForgeryApiResponse, File[]>({
      queryFn: async (files) => {
        try {
          const form = new FormData();
          files.forEach((f) => form.append('files', f));

          const res = await fetch(`${FORGERY_API_BASE}/predict`, {
            method: 'POST',
            body: form,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => res.statusText);
            return toQueryError(text, res.status);
          }

          const data: ForgeryApiResponse = await res.json();
          return { data };
        } catch (e) {
          return toQueryError(e);
        }
      },
    }),
  }),
});

export const { useUploadForImagingMutation, useUploadForClaimsMutation, useUploadForForgeryMutation } = uploadApi;
