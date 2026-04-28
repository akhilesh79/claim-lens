import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'dark' | 'light';
  activeModal: string | null;
  selectedVisualProof: string | null;
}

const initialState: UIState = {
  theme: 'dark',
  activeModal: null,
  selectedVisualProof: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setActiveModal(state, action: PayloadAction<string | null>) {
      state.activeModal = action.payload;
    },
    setSelectedVisualProof(state, action: PayloadAction<string | null>) {
      state.selectedVisualProof = action.payload;
    },
  },
});

export const { toggleTheme, setActiveModal, setSelectedVisualProof } = uiSlice.actions;
export default uiSlice.reducer;
