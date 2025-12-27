import { Box, Fade, Typography } from '@mui/material';
import { Fingerprint } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../inventorySlice';
import { nuiActions } from '../../../services/nui';
import { colors } from '../../../styles/theme';

export const UseButton = () => {
  const dispatch = useAppDispatch();
  const { hover, hoverOrigin, items, inUse, player, secondary } = useAppSelector(
    (state) => state.inventory
  );

  const isUsable = (): boolean => {
    if (Object.keys(items).length === 0) return false;
    if (!hover) return false;
    if (!hoverOrigin) return false;
    if (secondary.shop) return false; // Hide in shop mode

    const itemData = items[hover.Name];
    if (!itemData) return false;

    const isDurable = !itemData.durability ||
      (!!((hover as any).CreateDate) &&
        (hover as any).CreateDate + itemData.durability > Date.now() / 1000);

    return (
      !inUse &&
      hoverOrigin.owner === player.owner &&
      itemData.isUsable &&
      isDurable
    );
  };

  const handleUseItem = () => {
    if (!hover || !hoverOrigin || hoverOrigin.invType !== player.invType) return;

    nuiActions.frontEndSound('SELECT');
    nuiActions.useItem({
      owner: hoverOrigin.owner,
      slot: hoverOrigin.Slot,
      invType: hoverOrigin.invType,
    });

    // Disable the slot optimistically while item is being used
    dispatch(
      inventoryActions.setPlayerSlotDisabled({
        slot: hoverOrigin.Slot,
        disabled: true,
      })
    );

    dispatch(inventoryActions.clearHover());
  };

  return (
    <Fade in={isUsable()} timeout={200}>
      <Box
        onMouseUp={handleUseItem}
        sx={{
          width: '150px',
          height: '140px',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          background: colors.inventory.background,
          border: `2px solid ${colors.primary.alpha(0.4)}`,
          borderRadius: '12px',
          boxShadow: `0 0 20px ${colors.primary.alpha(0.3)}, inset 0 0 20px ${colors.primary.alpha(0.1)}`,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          zIndex: 9999,
          '&:hover': {
            background: colors.grey.main,
            borderColor: colors.primary.alpha(0.8),
            boxShadow: `0 0 30px ${colors.primary.alpha(0.5)}, inset 0 0 30px ${colors.primary.alpha(0.2)}`,
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        <Fingerprint
          sx={{
            fontSize: '64px',
            color: colors.primary.main,
            filter: `drop-shadow(0 0 12px ${colors.primary.alpha(0.6)})`,
          }}
        />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'Rubik, sans-serif',
            color: colors.primary.main,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            textShadow: `0 0 10px ${colors.primary.alpha(0.8)}`,
          }}
        >
          Use Item
        </Typography>
      </Box>
    </Fade>
  );
};
