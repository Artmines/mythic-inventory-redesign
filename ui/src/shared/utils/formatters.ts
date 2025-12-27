export const formatThousands = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const getItemTypeLabel = (type: number): string => {
  const typeMap: Record<number, string> = {
    1: 'Consumable',
    2: 'Weapon',
    3: 'Tool',
    4: 'Crafting Ingredient',
    5: 'Collectable',
    6: 'Junk',
    8: 'Evidence',
    9: 'Ammunition',
    10: 'Container',
    11: 'Gem',
    12: 'Paraphernalia',
    13: 'Wearable',
    14: 'Contraband',
    15: 'Collectable (Gang Chain)',
    16: 'Weapon Attachment',
    17: 'Crafting Schematic',
  };
  return typeMap[type] || 'Unknown';
};

export const getRarityLabel = (rarity: number): string => {
  const rarityMap: Record<number, string> = {
    1: 'Common',
    2: 'Uncommon',
    3: 'Rare',
    4: 'Epic',
    5: 'Objective',
  };
  return rarityMap[rarity] || 'Unknown';
};
