import { Box, Fade, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../inventorySlice';
import { nuiActions } from '../../../services/nui';
import { colors } from '../../../styles/theme';

interface NearbyPlayer {
  serverId: number;
  name: string;
  distance: number;
}

export const PlayerSelectionPopup = () => {
  const dispatch = useAppDispatch();
  const { nearbyPlayers, pendingGiveItem } = useAppSelector(
    (state) => state.inventory
  );

  const handleSelectPlayer = (player: NearbyPlayer) => {
    if (!pendingGiveItem) return;

    nuiActions.frontEndSound('SELECT');
    nuiActions.giveItem({
      targetServerId: player.serverId,
      owner: pendingGiveItem.owner,
      slot: pendingGiveItem.slot,
      invType: pendingGiveItem.invType,
      itemName: pendingGiveItem.itemName,
      count: pendingGiveItem.count,
    });

    dispatch(inventoryActions.clearNearbyPlayers());
    dispatch(inventoryActions.clearHover());
  };

  const handleClose = () => {
    nuiActions.frontEndSound('BACK');
    dispatch(inventoryActions.clearNearbyPlayers());
  };

  const isVisible = !!(nearbyPlayers && nearbyPlayers.length > 0);

  return (
    <Fade in={isVisible} timeout={200}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          width: '400px',
          height: 'fit-content',
          maxHeight: '500px',
          background: colors.inventory.background,
          border: `2px solid ${colors.primary.alpha(0.4)}`,
          borderRadius: '12px',
          boxShadow: `0 0 30px ${colors.primary.alpha(0.5)}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            padding: '20px',
            borderBottom: `1px solid ${colors.primary.alpha(0.2)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'Rubik, sans-serif',
              color: colors.primary.main,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
          >
            Select Player
          </Typography>
          <Box
            onClick={handleClose}
            sx={{
              cursor: 'pointer',
              color: colors.text.secondary,
              fontSize: '20px',
              transition: 'color 0.2s',
              '&:hover': {
                color: colors.primary.main,
              },
            }}
          >
            ✕
          </Box>
        </Box>

        {/* Player List */}
        <Box
          sx={{
            padding: '10px',
            overflowY: 'auto',
            maxHeight: '400px',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: colors.secondary.darkAlpha(0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: colors.primary.alpha(0.5),
              borderRadius: '4px',
              '&:hover': {
                background: colors.primary.alpha(0.7),
              },
            },
          }}
        >
          {nearbyPlayers?.map((player) => (
            <Box
              key={player.serverId}
              onClick={() => handleSelectPlayer(player)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                margin: '5px 0',
                background: colors.primary.alpha(0.05),
                border: `1px solid ${colors.primary.alpha(0.2)}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: colors.primary.alpha(0.15),
                  borderColor: colors.primary.alpha(0.6),
                  transform: 'translateX(5px)',
                },
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: colors.primary.alpha(0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Person
                  sx={{
                    fontSize: '24px',
                    color: colors.primary.main,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'Rubik, sans-serif',
                    color: colors.text.primary,
                  }}
                >
                  {player.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'Rubik, sans-serif',
                    color: colors.text.disabled,
                  }}
                >
                  {player.distance.toFixed(1)}m away • ID: {player.serverId}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Fade>
  );
};
