import { configureStore } from '@reduxjs/toolkit';
import { claimsApi } from '@/services/claimsApi';
import { imagingApi } from '@/services/imagingApi';
import claimsReducer from '@/features/claims/claimsSlice';
import imagingReducer from '@/features/imaging/imagingSlice';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    claims: claimsReducer,
    imaging: imagingReducer,
    ui: uiReducer,
    [claimsApi.reducerPath]: claimsApi.reducer,
    [imagingApi.reducerPath]: imagingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(claimsApi.middleware)
      .concat(imagingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
