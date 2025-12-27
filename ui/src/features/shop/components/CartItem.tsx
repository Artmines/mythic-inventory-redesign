import { Box, Collapse, Fade, IconButton, Typography } from '@mui/material';
import { memo, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../../inventory/inventorySlice';
import { nuiActions } from '../../../services/nui';
import { getItemImage } from '../../../shared/utils/inventory';
import { formatThousands } from '../../../shared/utils/formatters';
import { QuantityInput } from './QuantityInput';
import { RemoveIcon } from './icons';
import { colors } from '../../../styles/theme';
import type { CartItem as CartItemType } from '../../../shared/types';

interface CartItemProps {
  cartItem: CartItemType;
}

const CartItemComponent = ({ cartItem }: CartItemProps) => {
  const dispatch = useAppDispatch();
  const itemData = useAppSelector((state) => state.inventory.items[cartItem.itemName]);
  const shopItem = useAppSelector((state) =>
    state.inventory.secondary.inventory?.find(item => item.Name === cartItem.itemName)
  );

  const maxQuantity = useMemo(() => {
    if (!itemData) return 999;

    const stackLimit = itemData.isStackable === true
      ? 999
      : (typeof itemData.isStackable === 'number' ? itemData.isStackable : 999);

    // Max quantity is limited by the shop's total stock
    const shopStock = shopItem?.Count || 0;

    return Math.min(stackLimit, shopStock, 999);
  }, [itemData, shopItem?.Count]);

  if (!itemData) return null;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
    } else {
      dispatch(inventoryActions.updateCartQuantity({
        itemName: cartItem.itemName,
        quantity: newQuantity,
      }));
    }
  };

  const handleRemove = () => {
    dispatch(inventoryActions.removeFromCart(cartItem.itemName));
    nuiActions.frontEndSound('BACK');
  };

  return (
    <Collapse in timeout={200}>
      <Fade in timeout={200}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8vh',
            background: colors.primary.alpha(0.1),
            border: `1px solid ${colors.primary.alpha(0.2)}`,
            borderRadius: '0.42vw',
            padding: '1vh 0.8vh',
            marginBottom: '0.5vh',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: colors.primary.alpha(0.15),
              borderColor: colors.primary.alpha(0.3),
            },
          }}
        >
          {/* Item Image */}
          <Box
            component="img"
            src={getItemImage(cartItem.itemName)}
            sx={{
              width: '2.78vh',
              height: '2.78vh',
              objectFit: 'contain',
            }}
          />

          {/* Item Info */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2vh' }}>
            <Typography
              sx={{
                fontSize: '0.75vw',
                fontWeight: 600,
                fontFamily: 'Rubik, sans-serif',
                color: colors.text.primary,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {itemData.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.65vw',
                fontWeight: 500,
                fontFamily: 'Rubik, sans-serif',
                color: colors.success.main,
              }}
            >
              ${formatThousands(cartItem.unitPrice)} × {cartItem.quantity} = ${formatThousands(cartItem.unitPrice * cartItem.quantity)}
            </Typography>
          </Box>

          {/* Quantity Controls */}
          <QuantityInput
            value={cartItem.quantity}
            min={1}
            max={maxQuantity}
            onChange={handleQuantityChange}
          />

          {/* Remove Button */}
          <IconButton
            onClick={handleRemove}
            size="small"
            sx={{
              color: colors.error.light,
              padding: '0.42vh 0.31vw',
              minWidth: '1.67vw',
              '&:hover': {
                background: colors.error.lightAlpha(0.1),
                color: colors.error.dark,
              },
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </Box>
      </Fade>
    </Collapse>
  );
};

export const CartItem = memo(CartItemComponent);
