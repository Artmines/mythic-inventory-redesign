import { useState, memo, useMemo } from 'react';
import { Box, Button, Popover, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../../inventory/inventorySlice';
import { nuiActions } from '../../../services/nui';
import { getItemImage } from '../../../shared/utils/inventory';
import { formatThousands } from '../../../shared/utils/formatters';
import { rarityColors, colors } from '../../../styles/theme';
import { Tooltip } from '../../inventory/components/Tooltip';
import type { InventoryItem } from '../../../shared/types';

interface ShopItemCardProps {
  item: InventoryItem;
}

const getRarityGlow = (rarity: number): string => {
  const color = rarityColors[rarity as keyof typeof rarityColors] || rarityColors[1];
  return color;
};

const ShopItemCardComponent = ({ item }: ShopItemCardProps) => {
  const dispatch = useAppDispatch();
  const itemData = useAppSelector((state) => state.inventory.items[item.Name]);
  const hidden = useAppSelector((state) => state.app.hidden);
  const cart = useAppSelector((state) => state.inventory.cart);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const rarityColor = useMemo(() => {
    return itemData ? getRarityGlow(itemData.rarity) : rarityColors[1];
  }, [itemData]);

  // Calculate available stock (total stock - quantity already in cart)
  const cartQuantity = useMemo(() => {
    const cartItem = cart.find(c => c.itemName === item.Name);
    return cartItem ? cartItem.quantity : 0;
  }, [cart, item.Name]);

  const availableStock = useMemo(() => {
    return (item.Count || 0) - cartQuantity;
  }, [item.Count, cartQuantity]);

  if (!itemData) return null;

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleAddToCart = () => {
    if (!itemData.price || itemData.price <= 0) return;
    if (availableStock <= 0) {
      nuiActions.frontEndSound('DISABLED');
      return;
    }

    dispatch(inventoryActions.addToCart({
      itemName: item.Name,
      quantity: 1,
      unitPrice: itemData.price,
      slot: item.Slot,
    }));

    nuiActions.frontEndSound('SELECT');
  };

  return (
    <>
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '20.83vh',
          background: `radial-gradient(circle at center, ${rarityColor}15 0%, transparent 70%)`,
          border: `1px solid ${rarityColor}40`,
          borderRadius: '0.63vw',
          overflow: 'hidden',
          transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
          cursor: 'pointer',
          position: 'relative',
          willChange: 'transform',
          containIntrinsicSize: '19.44vh',
          contentVisibility: 'auto',
          '&:hover': {
            transform: 'scale(1.02)',
            borderColor: `${rarityColor}60`,
            boxShadow: `0 4px 12px ${rarityColor}30`,
          },
        }}
      >
        {/* Price Badge - Top Right */}
        {itemData.price > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '0.56vh',
              right: '0.42vw',
              background: `linear-gradient(135deg, ${colors.success.alpha(0.25)}, ${colors.success.alpha(0.15)})`,
              border: `1px solid ${colors.success.alpha(0.5)}`,
              borderRadius: '0.42vw',
              padding: '0.28vh 0.52vw',
              backdropFilter: 'blur(4px)',
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                color: colors.success.main,
                fontSize: '0.75vw',
                fontWeight: 700,
                fontFamily: 'Rubik, sans-serif',
                textShadow: `0 0 6px ${colors.success.alpha(0.6)}`,
                lineHeight: 1,
              }}
            >
              ${formatThousands(itemData.price)}
            </Typography>
          </Box>
        )}

        {/* Stock Badge - Top Left */}
        {item.Count !== undefined && item.Count !== null && (
          <Box
            sx={{
              position: 'absolute',
              top: '0.56vh',
              left: '0.42vw',
              background: availableStock <= 0
                ? `linear-gradient(135deg, ${colors.error.lightAlpha(0.25)}, ${colors.error.lightAlpha(0.15)})`
                : `linear-gradient(135deg, ${colors.primary.alpha(0.25)}, ${colors.primary.alpha(0.15)})`,
              border: availableStock <= 0
                ? `1px solid ${colors.error.lightAlpha(0.5)}`
                : `1px solid ${colors.primary.alpha(0.5)}`,
              borderRadius: '0.42vw',
              padding: '0.28vh 0.52vw',
              backdropFilter: 'blur(4px)',
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                color: availableStock <= 0 ? colors.error.light : colors.primary.main,
                fontSize: '0.65vw',
                fontWeight: 600,
                fontFamily: 'Rubik, sans-serif',
                lineHeight: 1,
              }}
            >
              {availableStock <= 0 ? 'Out of Stock' : `Stock: ${availableStock}`}
            </Typography>
          </Box>
        )}

        {/* Item Image */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4vh 1vh 1vh 1vh',
            minHeight: '8.33vh',
            flex: 1,
          }}
        >
          <Box
            component="img"
            src={getItemImage(item.Name)}
            sx={{
              maxHeight: '7.64vh',
              maxWidth: '100%',
              objectFit: 'contain',
              filter: `drop-shadow(0 0 8px ${rarityColor}40)`,
            }}
          />
        </Box>

        {/* Item Info Section */}
        <Box
          sx={{
            background: `linear-gradient(180deg, transparent 0%, ${colors.secondary.darkAlpha(0.75)} 100%)`,
            padding: '1.5vh 1.8vh 1.8vh 1.8vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2vh',
            marginTop: 'auto',
          }}
        >
          {/* Item Label */}
          <Typography
            sx={{
              textAlign: 'center',
              color: rarityColor,
              fontSize: '0.9vw',
              fontWeight: 700,
              fontFamily: 'Rubik, sans-serif',
              textShadow: `0 0 4px ${rarityColor}80`,
              letterSpacing: '0.5px',
              minHeight: '2.5em',
              lineHeight: '1.25em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {itemData.label}
          </Typography>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!itemData.price || itemData.price <= 0 || availableStock <= 0}
            startIcon={<Add />}
            fullWidth
            sx={{
              height: '3.19vh',
              color: 'white',
              fontWeight: 600,
              fontFamily: 'Rubik, sans-serif',
              fontSize: '0.85vw',
              background: itemData.price > 0 && availableStock > 0
                ? `linear-gradient(135deg, ${colors.primary.alpha(0.4)}, ${colors.primary.alpha(0.2)})`
                : colors.grey.alpha(0.3),
              border: itemData.price > 0 && availableStock > 0
                ? `1px solid ${colors.primary.alpha(0.6)}`
                : `1px solid ${colors.grey.alpha(0.5)}`,
              borderRadius: '0.42vw',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: itemData.price > 0 && availableStock > 0
                  ? `linear-gradient(135deg, ${colors.primary.alpha(0.5)}, ${colors.primary.alpha(0.3)})`
                  : colors.grey.alpha(0.3),
                borderColor: itemData.price > 0 && availableStock > 0
                  ? colors.primary.alpha(0.8)
                  : colors.grey.alpha(0.5),
                transform: itemData.price > 0 && availableStock > 0 ? 'translateY(-2px)' : 'none',
                boxShadow: itemData.price > 0 && availableStock > 0
                  ? `0 4px 12px ${colors.primary.alpha(0.4)}`
                  : 'none',
              },
              '&:disabled': {
                color: colors.text.disabled,
              },
            }}
          >
            {availableStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </Box>

      <Popover
        sx={{ pointerEvents: 'none' }}
        TransitionProps={{ timeout: 0 }}
        slotProps={{
          paper: {
            sx: {
              background: 'transparent',
              boxShadow: 'none',
            },
          },
        }}
        open={open && !hidden}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleMouseLeave}
        disableEscapeKeyDown
        disableRestoreFocus
      >
        <Tooltip item={item} anchorEl={anchorEl} onClose={handleMouseLeave} />
      </Popover>
    </>
  );
};

export const ShopItemCard = memo(ShopItemCardComponent);
