import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CraftingState, Recipe } from '../../shared/types';

const initialState: CraftingState = {
  currentCraft: 1,
  benchName: 'Workbench',
  bench: 'none',
  crafting: null,
  actionString: 'Crafting',
  myCounts: {},
  cooldowns: {},
  recipes: [],
};

const craftingSlice = createSlice({
  name: 'crafting',
  initialState,
  reducers: {
    setBench: (
      state,
      action: PayloadAction<{
        benchName: string;
        bench: string;
        cooldowns: Record<string, number>;
        recipes: Recipe[];
        myCounts: Record<string, number>;
        actionString: string;
      }>
    ) => {
      state.benchName = action.payload.benchName;
      state.bench = action.payload.bench;
      state.cooldowns = action.payload.cooldowns;
      state.recipes = action.payload.recipes;
      state.myCounts = action.payload.myCounts;
      state.actionString = action.payload.actionString;
    },

    setCrafting: (state, action: PayloadAction<{ recipe: string; start: number; time: number }>) => {
      state.crafting = {
        ...action.payload,
        progress: 0,
      };
    },

    endCrafting: (state) => {
      state.crafting = null;
    },

    setCraftProgress: (state, action: PayloadAction<number>) => {
      if (state.crafting) {
        state.crafting.progress = action.payload;
      }
    },

    setCurrentCraft: (state, action: PayloadAction<number>) => {
      state.currentCraft = action.payload;
    },

    clearRecipes: (state) => {
      state.recipes = [];
    },

    updateCounts: (state, action: PayloadAction<Record<string, number>>) => {
      state.myCounts = action.payload;
    },
  },
});

export const craftingActions = craftingSlice.actions;
export default craftingSlice.reducer;
