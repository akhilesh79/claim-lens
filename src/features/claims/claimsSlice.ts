import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Status } from '@/types/common';
import type { ClaimDecision } from '@/types/claims';

interface ClaimsState {
  selectedClaimId: string;
  filterStatus: Status | 'ALL';
  searchQuery: string;
  apiData: ClaimDecision | null;
  apiError: string | null;
}

const initialState: ClaimsState = {
  selectedClaimId: 'CLAIM-2024-001',
  filterStatus: 'ALL',
  searchQuery: '',
  apiData: null,
  apiError: null,
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setSelectedClaim(state, action: PayloadAction<string>) {
      state.selectedClaimId = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<ClaimsState['filterStatus']>) {
      state.filterStatus = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setClaimApiData(state, action: PayloadAction<ClaimDecision>) {
      state.apiData = action.payload;
      state.apiError = null;
    },
    setClaimApiError(state, action: PayloadAction<string>) {
      state.apiError = action.payload;
      state.apiData = null;
    },
    clearClaimApiData(state) {
      state.apiData = null;
      state.apiError = null;
    },
  },
});

export const {
  setSelectedClaim,
  setFilterStatus,
  setSearchQuery,
  setClaimApiData,
  setClaimApiError,
  clearClaimApiData,
} = claimsSlice.actions;
export default claimsSlice.reducer;
