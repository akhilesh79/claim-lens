import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from './baseQuery';
import type { ImagingApiResponse, ImagingAnalysis } from '@/types/imaging';
import { normalizeImagingResponse } from '@/utils/imagingNormalizer';

export const imagingApi = createApi({
  reducerPath: 'imagingApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Imaging'],
  endpoints: (builder) => ({
    getImagingAnalysis: builder.query<ImagingAnalysis, string>({
      query: (studyId) => `imaging/${studyId}`,
      transformResponse: (raw: ImagingApiResponse) => normalizeImagingResponse(raw),
      providesTags: (_result, _error, id) => [{ type: 'Imaging', id }],
    }),
  }),
});

export const { useGetImagingAnalysisQuery } = imagingApi;
