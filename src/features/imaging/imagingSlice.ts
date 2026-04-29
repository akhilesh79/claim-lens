import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ImagingState {
  selectedStudyId: string;
  activeImageIndex: number;
}

const initialState: ImagingState = {
  selectedStudyId: 'PMJAY_MH_S_G_R2_2026040210048407',
  activeImageIndex: 0,
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
  },
});

export const { setSelectedStudy, setActiveImage } = imagingSlice.actions;
export default imagingSlice.reducer;
