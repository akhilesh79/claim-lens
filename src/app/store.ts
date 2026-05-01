import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { claimsApi } from '@/services/claimsApi';
import { imagingApi } from '@/services/imagingApi';
import { uploadApi } from '@/services/uploadApi';
import claimsReducer from '@/features/claims/claimsSlice';
import imagingReducer from '@/features/imaging/imagingSlice';
import forgeryReducer from '@/features/forgery/forgerySlice';
import uiReducer from '@/features/ui/uiSlice';

const rootReducer = combineReducers({
  claims:  claimsReducer,
  imaging: imagingReducer,
  forgery: forgeryReducer,
  ui:      uiReducer,
  [claimsApi.reducerPath]:  claimsApi.reducer,
  [imagingApi.reducerPath]: imagingApi.reducer,
  [uploadApi.reducerPath]:  uploadApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['claims', 'imaging', 'forgery', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(claimsApi.middleware)
      .concat(imagingApi.middleware)
      .concat(uploadApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
