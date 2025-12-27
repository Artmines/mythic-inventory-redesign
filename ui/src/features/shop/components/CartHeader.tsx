import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { CartIcon } from './icons';
import { colors, textShadow } from '../../../styles/theme';

export const CartHeader = () => {
  const { cart } = useAppSelector((state) => state.inventory);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '1vh',
        padding: '1vh',
        borderBottom: `1px solid ${colors.primary.alpha(0.3)}`,
      }}
    >
      <CartIcon
        sx={{
          fontSize: '1.5vw',
          color: colors.primary.main,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontSize: '1vw',
            fontWeight: 700,
            fontFamily: 'Rubik, sans-serif',
            color: colors.text.primary,
            textShadow,
          }}
        >
          Shopping Cart
        </Typography>
        <Typography
          sx={{
            fontSize: '0.7vw',
            fontWeight: 500,
            fontFamily: 'Rubik, sans-serif',
            color: colors.text.secondary,
          }}
        >
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Typography>
      </Box>
    </Box>
  );
};
