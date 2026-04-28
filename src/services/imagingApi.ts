import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from './baseQuery';
import type { ImagingAnalysis } from '@/types/imaging';

export const imagingApi = createApi({
  reducerPath: 'imagingApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Imaging'],
  endpoints: (builder) => ({
    getImagingAnalysis: builder.query<ImagingAnalysis, string>({
      query: (studyId) => `imaging/${studyId}`,
      providesTags: (_result, _error, id) => [{ type: 'Imaging', id }],
    }),
  }),
});

export const { useGetImagingAnalysisQuery } = imagingApi;
