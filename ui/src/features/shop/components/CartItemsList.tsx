import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { CartItem } from './CartItem';
import { colors } from '../../../styles/theme';

export const CartItemsList = () => {
  const { cart } = useAppSelector((state) => state.inventory);

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2vh',
        }}
      >
        <Typography
          sx={{
            color: colors.text.disabled,
            fontFamily: 'Rubik, sans-serif',
            fontSize: '0.8vw',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          Your cart is empty.
          <br />
          Add items from the shop to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        padding: '1vh',
        '&::-webkit-scrollbar': {
          width: '0.21vw',
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
      {cart.map((cartItem) => (
        <CartItem key={cartItem.itemName} cartItem={cartItem} />
      ))}
    </Box>
  );
};
