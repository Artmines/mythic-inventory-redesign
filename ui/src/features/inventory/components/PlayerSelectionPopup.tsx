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
          width: '20.83vw',
          height: 'fit-content',
          maxHeight: '46.3vh',
          background: colors.inventory.background,
          border: `2px solid ${colors.primary.alpha(0.4)}`,
          borderRadius: '0.63vw',
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
            padding: '1.39vh 1.04vw',
            borderBottom: `1px solid ${colors.primary.alpha(0.2)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.25vh',
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
              fontSize: '1.39vh',
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
            padding: '0.69vh 0.52vw',
            overflowY: 'auto',
            maxHeight: '37.04vh',
            '&::-webkit-scrollbar': {
              width: '0.42vw',
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
                gap: '0.78vw',
                padding: '1.04vh 0.78vw',
                margin: '0.35vh 0',
                background: colors.primary.alpha(0.05),
                border: `1px solid ${colors.primary.alpha(0.2)}`,
                borderRadius: '0.42vw',
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
                  width: '2.78vh',
                  height: '2.78vh',
                  borderRadius: '50%',
                  background: colors.primary.alpha(0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Person
                  sx={{
                    fontSize: '1.67vh',
                    color: colors.primary.main,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '1.11vh',
                    fontWeight: 600,
                    fontFamily: 'Rubik, sans-serif',
                    color: colors.text.primary,
                  }}
                >
                  {player.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.83vh',
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
