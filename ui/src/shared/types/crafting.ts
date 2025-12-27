export interface RecipeItem {
  name: string;
  count: number;
}

export interface Recipe {
  id: string;
  result: RecipeItem;
  items: RecipeItem[];
  time: number;
  cooldown?: number;
}

export interface CraftingProgress {
  recipe: string;
  start: number;
  time: number;
  progress: number;
}

export interface CraftingState {
  currentCraft: number;
  benchName: string;
  bench: string;
  crafting: CraftingProgress | null;
  actionString: string;
  myCounts: Record<string, number>;
  cooldowns: Record<string, number>;
  recipes: Recipe[];
}
