import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../../inventory/inventorySlice';
import { nuiActions } from '../../../services/nui';
import { PriceDisplay } from './PriceDisplay';
import { BankIcon, CashIcon } from './icons';
import { colors, textShadow } from '../../../styles/theme';

export const CartFooter = () => {
  const dispatch = useAppDispatch();
  const { cart, cartTotalPrice, paymentMethod, isPurchasing, secondary } = useAppSelector((state) => state.inventory);

  const canPurchase = cart.length > 0 && paymentMethod !== null && !isPurchasing;

  const handlePaymentMethodChange = (_: React.MouseEvent<HTMLElement>, newMethod: 'bank' | 'cash' | null) => {
    if (newMethod !== null) {
      dispatch(inventoryActions.setPaymentMethod(newMethod));
    }
  };

  const handlePurchase = async () => {
    if (!canPurchase || !paymentMethod) return;

    try {
      dispatch(inventoryActions.setCartPurchasing(true));

      // Send purchase request - backend will respond with SHOP_PURCHASE_SUCCESS or SHOP_PURCHASE_FAILED messages
      await nuiActions.purchaseCart({
        shopOwner: secondary.owner,
        shopInvType: secondary.invType,
        items: cart,
        paymentMethod,
        totalPrice: cartTotalPrice,
      });

      // Success/failure is handled via message events in App.tsx
    } catch (err) {
      console.error('Purchase error:', err);
      nuiActions.frontEndSound('DISABLED');
      dispatch(inventoryActions.setCartPurchasing(false));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1vh',
        padding: '1vh',
        borderTop: `1px solid ${colors.primary.alpha(0.3)}`,
      }}
    >
      {/* Total Price */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1vh',
          background: colors.secondary.darkAlpha(0.5),
          borderRadius: '0.42vw',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.9vw',
            fontWeight: 600,
            fontFamily: 'Rubik, sans-serif',
            color: colors.text.secondary,
          }}
        >
          Total:
        </Typography>
        <PriceDisplay targetPrice={cartTotalPrice} />
      </Box>

      {/* Payment Method Selection */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
        <Typography
          sx={{
            fontSize: '0.75vw',
            fontWeight: 600,
            fontFamily: 'Rubik, sans-serif',
            color: colors.text.secondary,
          }}
        >
          Payment Method:
        </Typography>
        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          onChange={handlePaymentMethodChange}
          fullWidth
          sx={{
            '& .MuiToggleButton-root': {
              color: colors.text.secondary,
              borderColor: colors.primary.alpha(0.3),
              fontFamily: 'Rubik, sans-serif',
              fontSize: '0.7vw',
              fontWeight: 600,
              textTransform: 'none',
              padding: '0.8vh',
              '&.Mui-selected': {
                color: colors.primary.main,
                background: colors.primary.alpha(0.2),
                borderColor: colors.primary.alpha(0.5),
                '&:hover': {
                  background: colors.primary.alpha(0.3),
                },
              },
              '&:hover': {
                background: colors.primary.alpha(0.1),
              },
            },
          }}
        >
          <ToggleButton value="bank">
            <BankIcon sx={{ fontSize: '1vw', marginRight: '0.5vh' }} />
            Bank
          </ToggleButton>
          <ToggleButton value="cash">
            <CashIcon sx={{ fontSize: '1vw', marginRight: '0.5vh' }} />
            Cash
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={!canPurchase}
        fullWidth
        sx={{
          height: '3.13vh',
          color: 'white',
          fontWeight: 600,
          fontFamily: 'Rubik, sans-serif',
          fontSize: '0.85vw',
          background: canPurchase
            ? `linear-gradient(135deg, ${colors.primary.alpha(0.4)}, ${colors.primary.alpha(0.2)})`
            : colors.grey.alpha(0.3),
          border: canPurchase
            ? `1px solid ${colors.primary.alpha(0.6)}`
            : `1px solid ${colors.grey.alpha(0.5)}`,
          borderRadius: '0.42vw',
          textTransform: 'none',
          textShadow,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: canPurchase
              ? `linear-gradient(135deg, ${colors.primary.alpha(0.5)}, ${colors.primary.alpha(0.3)})`
              : colors.grey.alpha(0.3),
            borderColor: canPurchase
              ? colors.primary.alpha(0.8)
              : colors.grey.alpha(0.5),
            transform: canPurchase ? 'translateY(-2px)' : 'none',
            boxShadow: canPurchase
              ? `0 4px 16px ${colors.primary.alpha(0.4)}`
              : 'none',
          },
          '&:disabled': {
            color: colors.text.disabled,
          },
        }}
      >
        {isPurchasing ? 'Processing...' : cart.length === 0 ? 'Cart is Empty' : paymentMethod === null ? 'Select Payment Method' : 'Complete Purchase'}
      </Button>
    </Box>
  );
};
