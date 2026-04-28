import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ImagingState {
  selectedStudyId: string;
  activeImageIndex: number;
  zoomLevel: number;
  contrastLevel: number;
}

const initialState: ImagingState = {
  selectedStudyId: 'CLM-2024-002',
  activeImageIndex: 0,
  zoomLevel: 1,
  contrastLevel: 1,
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
    setZoom(state, action: PayloadAction<number>) {
      state.zoomLevel = parseFloat(Math.min(Math.max(action.payload, 0.5), 3).toFixed(2));
    },
    setContrast(state, action: PayloadAction<number>) {
      state.contrastLevel = parseFloat(Math.min(Math.max(action.payload, 0.5), 2.5).toFixed(2));
    },
    resetViewport(state) {
      state.zoomLevel = 1;
      state.contrastLevel = 1;
    },
  },
});

export const { setSelectedStudy, setActiveImage, setZoom, setContrast, resetViewport } = imagingSlice.actions;
export default imagingSlice.reducer;
