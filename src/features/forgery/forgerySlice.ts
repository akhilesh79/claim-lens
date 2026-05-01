import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ForgeryFileResult } from '@/types/forgery';

interface ForgeryState {
  results: ForgeryFileResult[];
  apiError: string | null;
}

const initialState: ForgeryState = {
  results: [],
  apiError: null,
};

const forgerySlice = createSlice({
  name: 'forgery',
  initialState,
  reducers: {
    setForgeryData(state, action: PayloadAction<ForgeryFileResult[]>) {
      state.results  = action.payload;
      state.apiError = null;
    },
    setForgeryError(state, action: PayloadAction<string>) {
      state.apiError = action.payload;
      state.results  = [];
    },
    clearForgeryData(state) {
      state.results  = [];
      state.apiError = null;
    },
  },
});

export const { setForgeryData, setForgeryError, clearForgeryData } = forgerySlice.actions;
export default forgerySlice.reducer;
