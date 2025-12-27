import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  InventoryState,
  Inventory,
  InventoryItem,
  ItemDefinition,
  MoveItemPayload,
} from '../../shared/types';

const createInitialInventory = (): Inventory => ({
  size: 40,
  invType: 1,
  name: null,
  inventory: [],
  disabled: {},
  owner: 0,
  capacity: 0,
});

const devModeData = import.meta.env.MODE !== 'production' ? {
  player: {
    size: 40,
    invType: 1 as const,
    name: 'Player Storage',
    inventory: [
      { Name: 'burger', Slot: 1, Count: 5, CreateDate: Math.floor(Date.now() / 1000) },
      { Name: 'water', Slot: 2, Count: 3 },
      { Name: 'burger', Slot: 5, Count: 10 },
    ],
    disabled: {},
    owner: '12214124',
    capacity: 100,
    isWeaponEligble: true,
  },
  secondary: {
    size: 40,
    invType: 11 as const,
    name: 'Second Storage',
    inventory: [
      { Name: 'water', Slot: 1, Count: 10 },
      { Name: 'burger', Slot: 3, Count: 25 },
    ],
    disabled: {},
    owner: '346346346',
    capacity: 100,
  },
  showSecondary: true,
  items: {
    burger: {
      label: 'Burger',
      price: 0,
      isUsable: true,
      isRemoved: true,
      isStackable: 100,
      type: 1 as const,
      rarity: 1 as const,
      metalic: false,
      weight: 1,
    },
    water: {
      label: 'Water',
      price: 0,
      isUsable: true,
      isRemoved: true,
      isStackable: 10,
      type: 1 as const,
      rarity: 2 as const,
      metalic: false,
      weight: 1,
    },
  },
  itemsLoaded: true,
} : {};

const initialState: InventoryState = {
  player: {
    ...createInitialInventory(),
    isWeaponEligble: false,
    ...devModeData.player,
  },
  equipment: {
    inventory: [],
  },
  secondary: {
    ...createInitialInventory(),
    invType: 2,
    ...devModeData.secondary,
  },
  showSecondary: devModeData.showSecondary ?? false,
  hover: null,
  hoverOrigin: null,
  contextItem: null,
  splitItem: null,
  inUse: false,
  items: devModeData.items ?? {},
  itemsLoaded: devModeData.itemsLoaded ?? false,
  staticTooltip: false,
  cart: [],
  cartTotalPrice: 0,
  cartDisplayPrice: 0,
  paymentMethod: null,
  isPurchasing: false,
  nearbyPlayers: null,
  pendingGiveItem: null,
};

// Weight calculation utility - currently unused but kept for future weight validation
// const calcWeight = (inv: InventoryItem[], items: Record<string, ItemDefinition>): number => {
//   return inv.reduce((total, item) => {
//     if (!item) return total;
//     const itemDef = items[item.Name];
//     return total + (itemDef?.weight || 0) * item.Count;
//   }, 0);
// };

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    resetInventory: (state) => {
      state.player = {
        ...initialState.player,
        disabled: { ...state.player.disabled },
      };
      state.secondary = {
        ...initialState.secondary,
        disabled: { ...state.secondary.disabled },
      };
    },

    setPlayerInventory: (state, action: PayloadAction<Inventory>) => {
      state.player = {
        ...action.payload,
        invType: 1,
        inventory: action.payload.inventory || [],
        disabled: action.payload.disabled || state.player.disabled || {},
      };
    },

    setSecondaryInventory: (state, action: PayloadAction<Inventory>) => {
      const isSameInventory =
        state.secondary.owner === action.payload.owner &&
        state.secondary.invType === action.payload.invType;

      state.secondary = {
        ...action.payload,
        inventory: action.payload.inventory || [],
        disabled: action.payload.disabled || (isSameInventory ? state.secondary.disabled : {}) || {},
      };
    },

    showSecondaryInventory: (state) => {
      state.showSecondary = true;
    },

    hideSecondaryInventory: (state) => {
      state.showSecondary = false;
      state.secondary = initialState.secondary;
    },

    setItems: (state, action: PayloadAction<Record<string, ItemDefinition>>) => {
      state.items = action.payload;
    },

    addItem: (state, action: PayloadAction<{ id: string; item: ItemDefinition }>) => {
      state.items[action.payload.id] = action.payload.item;
    },

    setItemsLoaded: (state, action: PayloadAction<boolean>) => {
      state.itemsLoaded = action.payload;
    },

    setHover: (state, action: PayloadAction<InventoryItem | null>) => {
      state.hover = action.payload;
    },

    setHoverOrigin: (
      state,
      action: PayloadAction<InventoryItem | null>
    ) => {
      state.hoverOrigin = action.payload;
    },

    setContextItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.contextItem = action.payload;
    },

    setSplitItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.splitItem = action.payload;
    },

    setInUse: (state, action: PayloadAction<boolean>) => {
      state.inUse = action.payload;
    },

    setStaticTooltip: (state, action: PayloadAction<InventoryItem | false>) => {
      state.staticTooltip = action.payload;
    },

    setPlayerSlotDisabled: (state, action: PayloadAction<{ slot: number; disabled: boolean; itemData?: InventoryItem | null }>) => {
      state.player.disabled[action.payload.slot] = action.payload.disabled;

      // Update slot data if provided
      if (action.payload.itemData !== undefined) {
        if (action.payload.itemData === null) {
          // Remove item from slot
          state.player.inventory = state.player.inventory.filter(item => item?.Slot !== action.payload.slot);
        } else {
          // Update or add item
          const existingIndex = state.player.inventory.findIndex(item => item?.Slot === action.payload.slot);
          if (existingIndex >= 0) {
            state.player.inventory[existingIndex] = action.payload.itemData;
          } else {
            state.player.inventory.push(action.payload.itemData);
          }
        }
      }
    },

    setSecondarySlotDisabled: (
      state,
      action: PayloadAction<{ slot: number; disabled: boolean; itemData?: InventoryItem | null }>
    ) => {
      state.secondary.disabled[action.payload.slot] = action.payload.disabled;

      // Update slot data if provided
      if (action.payload.itemData !== undefined) {
        if (action.payload.itemData === null) {
          // Remove item from slot
          state.secondary.inventory = state.secondary.inventory.filter(item => item?.Slot !== action.payload.slot);
        } else {
          // Update or add item
          const existingIndex = state.secondary.inventory.findIndex(item => item?.Slot === action.payload.slot);
          if (existingIndex >= 0) {
            state.secondary.inventory[existingIndex] = action.payload.itemData;
          } else {
            state.secondary.inventory.push(action.payload.itemData);
          }
        }
      }
    },

    moveItemPlayerSame: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      state.player.inventory = state.player.inventory.map((item) => {
        if (item?.Slot === originSlot) {
          return { ...item, Slot: destSlot };
        }
        return item;
      });
      state.player.disabled[originSlot] = true;
      state.player.disabled[destSlot] = true;
    },

    mergeItemPlayerSame: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      const originItem = state.player.inventory.find((item) => item?.Slot === originSlot);

      state.player.inventory = state.player.inventory
        .filter((item) => item?.Slot !== originSlot)
        .map((item) => {
          if (item?.Slot === destSlot && originItem) {
            return { ...item, Count: item.Count + originItem.Count };
          }
          return item;
        });

      state.player.disabled[originSlot] = true;
      state.player.disabled[destSlot] = true;
    },

    swapItemPlayerSame: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      state.player.inventory = state.player.inventory.map((item) => {
        if (item?.Slot === originSlot) {
          return { ...item, Slot: destSlot };
        } else if (item?.Slot === destSlot) {
          return { ...item, Slot: originSlot };
        }
        return item;
      });

      state.player.disabled[originSlot] = true;
      state.player.disabled[destSlot] = true;
    },

    swapItemPlayerToSecondary: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      // Get the items to swap
      const originItem = state.player.inventory.find((item) => item?.Slot === originSlot);
      const destItem = state.secondary.inventory.find((item) => item?.Slot === destSlot);

      if (originItem && destItem) {
        // Remove origin from player, add dest to player (with origin slot)
        state.player.inventory = [
          ...state.player.inventory.filter((item) => item?.Slot !== originSlot),
          { ...destItem, Slot: originSlot },
        ];

        // Remove dest from secondary, add origin to secondary (with dest slot)
        state.secondary.inventory = [
          ...state.secondary.inventory.filter((item) => item?.Slot !== destSlot),
          { ...originItem, Slot: destSlot },
        ];

        state.player.disabled[originSlot] = true;
        state.secondary.disabled[destSlot] = true;
      }
    },

    swapItemSecondaryToPlayer: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      // Get the items to swap
      const originItem = state.secondary.inventory.find((item) => item?.Slot === originSlot);
      const destItem = state.player.inventory.find((item) => item?.Slot === destSlot);

      if (originItem && destItem) {
        // Remove origin from secondary, add dest to secondary (with origin slot)
        state.secondary.inventory = [
          ...state.secondary.inventory.filter((item) => item?.Slot !== originSlot),
          { ...destItem, Slot: originSlot },
        ];

        // Remove dest from player, add origin to player (with dest slot)
        state.player.inventory = [
          ...state.player.inventory.filter((item) => item?.Slot !== destSlot),
          { ...originItem, Slot: destSlot },
        ];

        state.secondary.disabled[originSlot] = true;
        state.player.disabled[destSlot] = true;
      }
    },

    moveItemSecondaryToPlayer: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot, origin } = action.payload;
      // Remove from secondary inventory
      state.secondary.inventory = state.secondary.inventory.filter(
        (item) => item?.Slot !== originSlot
      );
      // Add to player inventory
      state.player.inventory.push({
        ...origin,
        Slot: destSlot,
      });
      state.player.disabled[destSlot] = true;
      state.secondary.disabled[originSlot] = true;
    },

    moveItemPlayerToSecondary: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot, origin } = action.payload;
      // Remove from player inventory
      state.player.inventory = state.player.inventory.filter(
        (item) => item?.Slot !== originSlot
      );
      // Add to secondary inventory
      state.secondary.inventory.push({
        ...origin,
        Slot: destSlot,
      });
      state.secondary.disabled[destSlot] = true;
      state.player.disabled[originSlot] = true;
    },

    mergeItemSecondaryToPlayer: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot, origin } = action.payload;
      // Remove from secondary inventory (unless it's a shop)
      if (!origin.shop) {
        state.secondary.inventory = state.secondary.inventory.filter(
          (item) => item?.Slot !== originSlot
        );
      }
      // Add count to player inventory
      state.player.inventory = state.player.inventory.map((item) => {
        if (item?.Slot === destSlot) {
          return { ...item, Count: item.Count + origin.Count };
        }
        return item;
      });
      state.player.disabled[destSlot] = true;
      state.secondary.disabled[originSlot] = true;
    },

    mergeItemPlayerToSecondary: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot, origin } = action.payload;
      // Remove from player inventory
      state.player.inventory = state.player.inventory.filter(
        (item) => item?.Slot !== originSlot
      );
      // Add count to secondary inventory
      state.secondary.inventory = state.secondary.inventory.map((item) => {
        if (item?.Slot === destSlot) {
          return { ...item, Count: item.Count + origin.Count };
        }
        return item;
      });
      state.secondary.disabled[destSlot] = true;
      state.player.disabled[originSlot] = true;
    },

    setEquipment: (state, action: PayloadAction<{ inventory: InventoryItem[] }>) => {
      state.equipment = action.payload;
    },

    clearHover: (state) => {
      state.hover = null;
      state.hoverOrigin = null;
    },

    setNearbyPlayers: (state, action: PayloadAction<any[]>) => {
      state.nearbyPlayers = action.payload;
    },

    clearNearbyPlayers: (state) => {
      state.nearbyPlayers = null;
      state.pendingGiveItem = null;
    },

    setPendingGiveItem: (state, action: PayloadAction<any>) => {
      state.pendingGiveItem = action.payload;
    },

    addToCart: (state, action: PayloadAction<import('../../shared/types').CartItem>) => {
      const existing = state.cart.find(i => i.itemName === action.payload.itemName);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }

      state.cartTotalPrice = state.cart.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity),
        0
      );
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.itemName !== action.payload);
      state.cartTotalPrice = state.cart.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity),
        0
      );
    },

    updateCartQuantity: (state, action: PayloadAction<{ itemName: string; quantity: number }>) => {
      const item = state.cart.find(i => i.itemName === action.payload.itemName);
      if (item) {
        item.quantity = action.payload.quantity;
        state.cartTotalPrice = state.cart.reduce(
          (sum, item) => sum + (item.unitPrice * item.quantity),
          0
        );
      }
    },

    clearCart: (state) => {
      state.cart = [];
      state.cartTotalPrice = 0;
      state.cartDisplayPrice = 0;
      state.paymentMethod = null;
      state.isPurchasing = false;
    },

    setPaymentMethod: (state, action: PayloadAction<'bank' | 'cash' | null>) => {
      state.paymentMethod = action.payload;
    },

    setCartPurchasing: (state, action: PayloadAction<boolean>) => {
      state.isPurchasing = action.payload;
    },

    setCartDisplayPrice: (state, action: PayloadAction<number>) => {
      state.cartDisplayPrice = action.payload;
    },
  },
});

export const inventoryActions = inventorySlice.actions;
export default inventorySlice.reducer;
