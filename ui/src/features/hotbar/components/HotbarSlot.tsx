import { Box, LinearProgress, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { lua2json } from '../../../shared/utils/lua';
import { rarityColors } from '../../../styles/theme';
import type { InventoryItem, ItemMetadata } from '../../../shared/types';

interface HotbarSlotProps {
  slot: number;
  item: InventoryItem | null;
  invType: number;
  owner: string | number;
  isEquipped?: boolean;
}

export const HotbarSlot = ({ slot, item, isEquipped = false }: HotbarSlotProps) => {
  const { items } = useAppSelector((state) => state.inventory);

  const metadata: ItemMetadata = item?.MetaData
    ? typeof item.MetaData === 'string'
      ? lua2json(item.MetaData)
      : item.MetaData
    : {};

  const itemData = item ? items[item.Name] : null;
  const isEmpty = !item || !itemData;

  const calcDurability = (): number | null => {
    if (!(item as any)?.CreateDate || !itemData?.durability) return null;
    return Math.ceil(
      100 -
        ((Math.floor(Date.now() / 1000) - (item as any).CreateDate) /
          itemData.durability) *
          100
    );
  };

  const durability = calcDurability();
  const isBroken = durability !== null && durability <= 0;

  const getDurabilityColor = () => {
    if (!durability) return '#8685EF';
    if (durability >= 75) return '#52984a';
    if (durability >= 50) return '#f09348';
    return '#6e1616';
  };

  return (
    <Box
      sx={{
        width: '70px',
        height: '70px',
        background: isBroken
          ? 'linear-gradient(135deg, rgba(110, 22, 22, 0.8), rgba(110, 22, 22, 0.4))'
          : 'linear-gradient(to-br, rgba(26, 26, 26, 0.85), rgba(10, 10, 10, 0.7))',
        border: `2px solid ${
          itemData ? rarityColors[itemData.rarity] : 'rgba(134, 133, 239, 0.2)'
        }`,
        borderRadius: '12px',
        position: 'relative',
        boxShadow: isEquipped
          ? '0 0 20px rgba(134, 133, 239, 0.8)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease',
      }}
    >
      {!isEmpty && itemData && (
        <>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundImage: `url(${getItemImage(
                metadata.CustomItemImage || item.Name
              )})`,
              backgroundSize: '60%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            }}
          />

          {item.Count > 1 && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '0 3px',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'Rubik, sans-serif',
                zIndex: 4,
                textShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
              }}
            >
              {item.Count}
            </Typography>
          )}

          {durability !== null && durability > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                zIndex: 4,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={durability}
                sx={{
                  height: '100%',
                  backgroundColor: 'transparent',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getDurabilityColor(),
                    transition: 'none',
                  },
                }}
              />
            </Box>
          )}

          {isBroken && (
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                fontWeight: 'bold',
                fontFamily: 'Rubik, sans-serif',
                color: '#fff',
                textShadow: '0 0 5px rgba(0,0,0,0.8)',
                zIndex: 5,
              }}
            >
              BROKEN
            </Typography>
          )}

          {!isEquipped && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '0 4px',
                fontSize: '10px',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 600,
                textShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
                color: '#8685EF',
                background: 'rgba(10, 10, 10, 0.9)',
                borderRight: '1px solid rgba(134, 133, 239, 0.3)',
                borderBottom: '1px solid rgba(134, 133, 239, 0.3)',
                borderBottomRightRadius: '8px',
                borderTopLeftRadius: '11px',
                zIndex: 4,
              }}
            >
              {slot}
            </Typography>
          )}

          {isEquipped && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '0 4px',
                fontSize: '9px',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 700,
                textShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
                color: '#8685EF',
                background: 'rgba(10, 10, 10, 0.9)',
                borderRight: '1px solid rgba(134, 133, 239, 0.4)',
                borderBottom: '1px solid rgba(134, 133, 239, 0.4)',
                borderBottomRightRadius: '8px',
                borderTopLeftRadius: '11px',
                zIndex: 4,
              }}
            >
              EQUIPPED
            </Typography>
          )}
        </>
      )}

      {isEmpty && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '10px',
            fontFamily: 'Rubik, sans-serif',
            textShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
          }}
        >
          {slot}
        </Typography>
      )}
    </Box>
  );
};
