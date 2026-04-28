import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Status } from '@/types/common';

interface ClaimsState {
  selectedClaimId: string;
  filterStatus: Status | 'ALL';
  searchQuery: string;
}

const initialState: ClaimsState = {
  selectedClaimId: 'CLAIM-2024-001',
  filterStatus: 'ALL',
  searchQuery: '',
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
  },
});

export const { setSelectedClaim, setFilterStatus, setSearchQuery } = claimsSlice.actions;
export default claimsSlice.reducer;
