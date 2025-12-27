import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { Slot } from '../../inventory/components/Slot';

export const InventoryHotbar = () => {
  const { player } = useAppSelector((state) => state.inventory);
  const hotbarSlots = [1, 2, 3, 4, 5];

  return (
    <Box sx={{
      position: 'absolute',
      bottom: '1vh',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'flex-end',
      width: '700px',
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
  );
};
