export type InventoryType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type ItemRarity = 1 | 2 | 3 | 4 | 5;

export type ItemType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ItemMetadata {
  CreateDate?: number;
  CustomItemImage?: string;
  CustomItemLabel?: string;
  SerialNumber?: string;
  Container?: number;
  ammo?: number;
  clip?: number;
  DOB?: string;
  EvidenceColor?: string;
  ChopList?: string[];
  WeaponComponents?: Record<string, { label: string; item: string }>;
  [key: string]: unknown;
}

export interface InventoryItem {
  Name: string;
  Slot: number;
  Count: number;
  Quality?: number;
  MetaData?: ItemMetadata;
  CreateDate?: number;
  Price?: number;
  shop?: boolean;
  owner?: string | number;
  invType?: InventoryType;
  slot?: number;
}

export interface ItemDefinition {
  label: string;
  description?: string;
  price: number;
  isUsable: boolean;
  isRemoved: boolean;
  isStackable: number | boolean;
  type: ItemType;
  rarity: ItemRarity;
  metalic: boolean;
  weight: number;
  durability?: number;
  requiresLicense?: boolean;
  qualification?: string;
  closeUseMenu?: boolean;
  iconOverride?: string;
}

export interface Inventory {
  size: number;
  invType: InventoryType;
  name: string | null;
  inventory: InventoryItem[];
  disabled: Record<number, boolean>;
  owner: string | number;
  capacity: number;
  isWeaponEligble?: boolean;
  shop?: boolean;
}

export interface InventoryState {
  player: Inventory;
  equipment: {
    inventory: InventoryItem[];
  };
  secondary: Inventory;
  showSecondary: boolean;
  hover: InventoryItem | null;
  hoverOrigin: InventoryItem | null;
  contextItem: InventoryItem | null;
  splitItem: InventoryItem | null;
  inUse: boolean;
  items: Record<string, ItemDefinition>;
  itemsLoaded: boolean;
  staticTooltip: InventoryItem | false;
  cart: CartItem[];
  cartTotalPrice: number;
  cartDisplayPrice: number;
  paymentMethod: 'bank' | 'cash' | null;
  isPurchasing: boolean;
  nearbyPlayers: NearbyPlayer[] | null;
  pendingGiveItem: PendingGiveItem | null;
}

export interface MoveItemPayload {
  originSlot: number;
  destSlot: number;
  origin: InventoryItem;
}

export interface CartItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  slot: number;
}

export interface NearbyPlayer {
  serverId: number;
  name: string;
  distance: number;
}

export interface PendingGiveItem {
  owner: string | number;
  slot: number;
  invType: InventoryType;
  itemName: string;
  count: number;
}
