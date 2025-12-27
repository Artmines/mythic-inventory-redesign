import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useAppSelector } from '../../../shared/hooks';
import { ShopItemCard } from './ShopItemCard';
import { colors } from '../../../styles/theme';

export const ShopItems = () => {
  const secondary = useAppSelector((state) => state.inventory.secondary);

  const shopItems = useMemo(() => {
    return secondary.inventory || [];
  }, [secondary.inventory]);

  if (!secondary.shop || !shopItems || shopItems.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: colors.text.disabled,
            fontFamily: 'Rubik, sans-serif',
            fontSize: '1.2vw',
            fontWeight: 500,
          }}
        >
          No items available in this shop
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        padding: '1.5vw',
        overflow: 'auto',
        willChange: 'scroll-position',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: colors.primary.alpha(0.6),
          transition: 'background ease-in 0.15s',
          borderRadius: '0.375rem',
          '&:hover': {
            background: colors.primary.alpha(0.9),
          },
        },
        '&::-webkit-scrollbar-track': {
          background: colors.primary.alpha(0.1),
        },
      }}
    >
      {shopItems.map((item, index) => (
        <ShopItemCard key={`shop-item-${index}-${item.Slot}`} item={item} />
      ))}
    </Box>
  );
};
