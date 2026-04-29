import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { mockClaimDecision } from '@/data/mockClaims';
import { mockImagingApiResponse } from '@/data/mockImaging';

type MockError = { status: number; message: string };

const mockDB: Record<string, unknown> = {
  'claims/CLAIM-2024-001': mockClaimDecision,
  'imaging/PMJAY_MH_S_G_R2_2026040210048407': mockImagingApiResponse,
  'claims/CLAIM-2024-001/approve': { success: true, message: 'Claim approved successfully' },
  'claims/CLAIM-2024-001/reject': { success: true, message: 'Claim rejected and queued for review' },
  'claims/CLAIM-2024-001/query': { success: true, message: 'Query sent to hospital successfully' },
};

export const mockBaseQuery: BaseQueryFn<string, unknown, MockError> = async (endpoint) => {
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500));
  const data = mockDB[endpoint];
  if (data !== undefined) return { data };
  return { error: { status: 404, message: `Endpoint "${endpoint}" not found in mock database` } };
};
