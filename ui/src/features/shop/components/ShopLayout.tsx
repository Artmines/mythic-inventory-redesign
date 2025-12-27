import { Box } from '@mui/material';
import { ShopItems } from './ShopItems';
import { ShoppingCart } from './ShoppingCart';
import { colors } from '../../../styles/theme';

export const ShopLayout = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        gap: '1vw',
        padding: '1vw',
      }}
    >
      {/* Shop Items - 65% */}
      <Box
        sx={{
          width: '65%',
          height: '100%',
          background: colors.inventory.background,
          border: `1px solid ${colors.primary.alpha(0.3)}`,
          borderRadius: '0.26vw',
          overflow: 'hidden',
        }}
      >
        <ShopItems />
      </Box>

      {/* Shopping Cart - 35% */}
      <Box
        sx={{
          width: '35%',
          height: '100%',
        }}
      >
        <ShoppingCart />
      </Box>
    </Box>
  );
};
