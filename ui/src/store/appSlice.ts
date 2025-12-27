import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppState, AppMode, AppSettings, ChangeAlert, InventoryItem } from '../shared/types';

const devModeData = import.meta.env.MODE !== 'production' ? {
  showHotbar: true,
  hotbarItems: [
    { Name: 'burger', Slot: 1, Count: 5 },
    { Name: 'water', Slot: 2, Count: 3 },
    null,
    null,
    { Name: 'burger', Slot: 5, Count: 10 },
  ] as (InventoryItem | null)[],
  equipped: null,
} : {};

const initialState: AppState = {
  hidden: import.meta.env.MODE === 'production',
  showHotbar: devModeData.showHotbar ?? false,
  mode: 'inventory',
  settings: {
    muted: false,
    useBank: false,
  },
  hotbarItems: devModeData.hotbarItems ?? Array(5).fill(null),
  equipped: devModeData.equipped ?? null,
  changes: {
    alerts: [],
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showApp: (state) => {
      state.hidden = false;
    },

    hideApp: (state) => {
      state.hidden = true;
    },

    setMode: (state, action: PayloadAction<AppMode>) => {
      state.mode = action.payload;
    },

    showHotbar: (state) => {
      state.showHotbar = true;
    },

    hideHotbar: (state) => {
      state.showHotbar = false;
    },

    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    setHotbarItems: (state, action: PayloadAction<(InventoryItem | null)[]>) => {
      state.hotbarItems = action.payload;
    },

    setEquipped: (state, action: PayloadAction<InventoryItem | null>) => {
      state.equipped = action.payload;
    },

    addAlert: (state, action: PayloadAction<Omit<ChangeAlert, 'timestamp'>>) => {
      const alert: ChangeAlert = {
        ...action.payload,
        timestamp: Date.now(),
      };
      state.changes.alerts.unshift(alert);
      if (state.changes.alerts.length > 4) {
        state.changes.alerts = state.changes.alerts.slice(0, 4);
      }
    },

    removeAlert: (state, action: PayloadAction<number>) => {
      state.changes.alerts = state.changes.alerts.filter(
        (alert) => alert.timestamp !== action.payload
      );
    },

    clearAlerts: (state) => {
      state.changes.alerts = [];
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
