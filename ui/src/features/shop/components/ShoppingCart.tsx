import { Box } from '@mui/material';
import { CartHeader } from './CartHeader';
import { CartItemsList } from './CartItemsList';
import { CartFooter } from './CartFooter';
import { colors } from '../../../styles/theme';

export const ShoppingCart = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: colors.inventory.background,
        border: `1px solid ${colors.primary.alpha(0.3)}`,
        borderRadius: '0.26vw',
        overflow: 'hidden',
      }}
    >
      <CartHeader />
      <CartItemsList />
      <CartFooter />
    </Box>
  );
};
