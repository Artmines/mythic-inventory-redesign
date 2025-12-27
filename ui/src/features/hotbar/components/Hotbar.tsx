import { useEffect } from 'react';
import { Box, Slide, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { appActions } from '../../../store/appSlice';
import { Slot } from '../../inventory/components/Slot';

export const Hotbar = () => {
  const dispatch = useAppDispatch();
  const { showHotbar, mode, hidden } = useAppSelector((state) => state.app);
  const { itemsLoaded, player } = useAppSelector((state) => state.inventory);

  // Auto-hide hotbar after 5 seconds
  useEffect(() => {
    if (!showHotbar) return;

    const timer = setTimeout(() => {
      dispatch(appActions.hideHotbar());
    }, 5000);

    return () => clearTimeout(timer);
  }, [showHotbar, dispatch]);

  // Only render when inventory is CLOSED
  if (!hidden) return null;

  if (mode === 'crafting' || !itemsLoaded) {
    return null;
  }

  const hotbarSlots = [1, 2, 3, 4, 5];

  return (
    <Slide direction="up" in={showHotbar}>
      <Box sx={{
        position: 'fixed',
        bottom: '1vh',
        left: '0',
        right: '0',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {hotbarSlots.map((slotNumber) => {
          const item = player.inventory.find(i => i?.Slot === slotNumber) || null;

          return (
            <Box key={slotNumber} sx={{
              position: 'relative',
              width: '8.3333vh',
              height: '8.3333vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '5px',
            }}>
              {/* Large background slot number */}
              <Typography sx={{
                position: 'absolute',
                color: 'rgba(255, 255, 255, 0.075)',
                fontSize: '4vw',
                fontWeight: 700,
                fontFamily: 'Rubik, sans-serif',
                zIndex: 0,
                lineHeight: 0,
                marginTop: '-1vh',
              }}>
                {slotNumber}
              </Typography>

              {/* Slot component with higher z-index */}
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                <Slot
                  slot={slotNumber}
                  item={item}
                  invType={player.invType}
                  owner={player.owner}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Slide>
  );
};
