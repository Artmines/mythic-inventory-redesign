import { Box, Fade, Typography } from '@mui/material';
import { PanTool } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../inventorySlice';
import { nuiActions } from '../../../services/nui';
import { colors } from '../../../styles/theme';
import { useState, useEffect } from 'react';

export const GiveButton = () => {
  const dispatch = useAppDispatch();
  const { hover, hoverOrigin, items, inUse, player, secondary } = useAppSelector(
    (state) => state.inventory
  );
  const [hasNearbyPlayers, setHasNearbyPlayers] = useState(false);

  // Check for nearby players periodically
  useEffect(() => {
    const checkNearby = async () => {
      try {
        const result: any = await nuiActions.checkNearbyPlayers();
        setHasNearbyPlayers(result?.count > 0);
      } catch {
        setHasNearbyPlayers(false);
      }
    };

    // Check immediately
    checkNearby();

    // Check every 2 seconds
    const interval = setInterval(checkNearby, 2000);

    return () => clearInterval(interval);
  }, []);

  const isGiveable = (): boolean => {
    if (!hasNearbyPlayers) return false;
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
      hoverOrigin.invType === player.invType &&
      isDurable
    );
  };

  const handleMouseUp = () => {
    if (!hover || !hoverOrigin || hoverOrigin.invType !== player.invType) return;

    nuiActions.frontEndSound('SELECT');

    // Store the pending give item data
    dispatch(inventoryActions.setPendingGiveItem({
      owner: hoverOrigin.owner,
      slot: hoverOrigin.Slot,
      invType: hoverOrigin.invType,
      itemName: hover.Name,
      count: hover.Count,
    }));

    // Clear hover to hide the button like Use button does
    dispatch(inventoryActions.clearHover());

    // Get nearby players - this will trigger the popup if there are any
    nuiActions.getNearbyPlayers();
  };

  return (
    <Fade in={isGiveable()} timeout={200}>
      <Box
        onMouseUp={handleMouseUp}
        sx={{
          width: '150px',
          height: '140px',
          position: 'absolute',
          top: 'calc(50% + 100px)',
          left: 0,
          right: 0,
          margin: '0 auto',
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
        <PanTool
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
          Give Item
        </Typography>
      </Box>
    </Fade>
  );
};
