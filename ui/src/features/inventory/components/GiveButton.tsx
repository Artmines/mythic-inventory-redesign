import { Box, Fade, Typography } from '@mui/material';
import { PanTool } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../inventorySlice';
import { nuiActions } from '../../../services/nui';
import { colors } from '../../../styles/theme';
import { useState, useEffect, useMemo, useCallback } from 'react';

export const GiveButton = () => {
  const dispatch = useAppDispatch();
  const { hover, hoverOrigin, items, inUse, player, secondary } = useAppSelector(
    (state) => state.inventory
  );
  const [hasNearbyPlayers, setHasNearbyPlayers] = useState(false);

  // Check for nearby players periodically (optimized with longer interval)
  useEffect(() => {
    let isMounted = true;

    const checkNearby = async () => {
      try {
        const result: any = await nuiActions.checkNearbyPlayers();
        if (isMounted) {
          setHasNearbyPlayers(result?.count > 0);
        }
      } catch {
        if (isMounted) {
          setHasNearbyPlayers(false);
        }
      }
    };

    // Check immediately
    checkNearby();

    // Increased to 5 seconds to reduce state update frequency
    const interval = setInterval(() => {
      if (isMounted) checkNearby();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Memoize isGiveable calculation to prevent recalculating on every render
  const isGiveable = useMemo(() => {
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
  }, [hasNearbyPlayers, items, hover, hoverOrigin, secondary.shop, inUse, player.owner, player.invType]);

  const handleMouseUp = useCallback(() => {
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
  }, [hover, hoverOrigin, player.invType, dispatch]);

  return (
    <Fade in={isGiveable} timeout={200}>
      <Box
        onMouseUp={handleMouseUp}
        sx={{
          width: '12.96vh',
          height: '12.96vh',
          position: 'absolute',
          top: 'calc(50% + 9.26vh)',
          left: 0,
          right: 0,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.11vh',
          background: colors.inventory.background,
          border: `2px solid ${colors.primary.alpha(0.4)}`,
          borderRadius: '0.63vw',
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
            fontSize: '4.44vh',
            color: colors.primary.main,
            filter: `drop-shadow(0 0 12px ${colors.primary.alpha(0.6)})`,
          }}
        />
        <Typography
          sx={{
            fontSize: '0.97vh',
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
