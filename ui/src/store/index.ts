import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import craftingReducer from '../features/crafting/craftingSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    inventory: inventoryReducer,
    crafting: craftingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
