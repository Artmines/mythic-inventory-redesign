import type { InventoryItem, ItemDefinition } from '../types';

export const normalizeInventory = (inv: InventoryItem[] | Record<number, InventoryItem>): InventoryItem[] => {
  return Array.isArray(inv) ? inv : Object.values(inv || {});
};

export const calcWeight = (inventory: InventoryItem[], items: Record<string, ItemDefinition>): number => {
  return inventory
    .filter((item) => Boolean(item))
    .reduce((total, item) => {
      const itemDef = items[item.Name];
      return total + (itemDef?.weight || 0) * item.Count;
    }, 0);
};

export const getItemImage = (itemName: string): string => {
  // In development mode, return a placeholder or local image
  if (import.meta.env.MODE !== 'production') {
    // Return a data URL placeholder image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iIzI0N2JhNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SXRlbTwvdGV4dD48L3N2Zz4=';
  }
  return `nui://mythic-inventory/ui/images/items/${itemName}.webp`;
};
