import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from './baseQuery';
import type { ClaimDecision, ClaimActionResult } from '@/types/claims';

export const claimsApi = createApi({
  reducerPath: 'claimsApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Claim'],
  endpoints: (builder) => ({
    getClaimDecision: builder.query<ClaimDecision, string>({
      query: (claimId) => `claims/${claimId}`,
      providesTags: (_result, _error, id) => [{ type: 'Claim', id }],
    }),
    approveClaim: builder.mutation<ClaimActionResult, string>({
      query: (claimId) => `claims/${claimId}/approve`,
      invalidatesTags: (_result, _error, id) => [{ type: 'Claim', id }],
    }),
    rejectClaim: builder.mutation<ClaimActionResult, string>({
      query: (claimId) => `claims/${claimId}/reject`,
      invalidatesTags: (_result, _error, id) => [{ type: 'Claim', id }],
    }),
    sendQuery: builder.mutation<ClaimActionResult, { claimId: string; message: string }>({
      query: ({ claimId }) => `claims/${claimId}/query`,
      invalidatesTags: (_result, _error, { claimId }) => [{ type: 'Claim', id: claimId }],
    }),
  }),
});

export const {
  useGetClaimDecisionQuery,
  useApproveClaimMutation,
  useRejectClaimMutation,
  useSendQueryMutation,
} = claimsApi;
