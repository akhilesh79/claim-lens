import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ImagingAnalysis } from '@/types/imaging';

interface ImagingState {
  selectedStudyId: string;
  activeImageIndex: number;
  apiData: ImagingAnalysis | null;
  apiError: string | null;
}

const initialState: ImagingState = {
  selectedStudyId: 'PMJAY_MH_S_G_R2_2026040210048407',
  activeImageIndex: 0,
  apiData: null,
  apiError: null,
};

const imagingSlice = createSlice({
  name: 'imaging',
  initialState,
  reducers: {
    setSelectedStudy(state, action: PayloadAction<string>) {
      state.selectedStudyId = action.payload;
    },
    setActiveImage(state, action: PayloadAction<number>) {
      state.activeImageIndex = action.payload;
    },
    setImagingApiData(state, action: PayloadAction<ImagingAnalysis>) {
      state.apiData = action.payload;
      state.apiError = null;
    },
    setImagingApiError(state, action: PayloadAction<string>) {
      state.apiError = action.payload;
      state.apiData = null;
    },
    clearImagingApiData(state) {
      state.apiData = null;
      state.apiError = null;
    },
  },
});

export const {
  setSelectedStudy,
  setActiveImage,
  setImagingApiData,
  setImagingApiError,
  clearImagingApiData,
} = imagingSlice.actions;
export default imagingSlice.reducer;
