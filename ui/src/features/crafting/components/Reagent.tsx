import { useState } from 'react';
import { Box, Popover, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { Tooltip } from './Tooltip';
import type { RecipeItem } from '../../../shared/types';
import { colors, textShadow } from '../../../styles/theme';

interface ReagentProps {
  item: RecipeItem;
  qty: number;
}

const getRarityColor = (rarity: number): string => {
  switch (rarity) {
    case 1:
      return '#ffffff';
    case 2:
      return '#9CE60D';
    case 3:
      return '#247ba5';
    case 4:
      return '#8e3bb8';
    case 5:
      return '#f2d411';
    default:
      return '#ffffff';
  }
};

export const Reagent = ({ item, qty }: ReagentProps) => {
  const { items } = useAppSelector((state) => state.inventory);
  const hidden = useAppSelector((state) => state.app.hidden);
  const { myCounts } = useAppSelector((state) => state.crafting);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const itemData = items[item.name];
  const hasItems =
    Boolean(myCounts[item.name]) && myCounts[item.name] >= item.count * qty;

  const tooltipOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const tooltipClose = () => {
    setAnchorEl(null);
  };

  if (!itemData) return null;

  return (
    <Box
      onMouseEnter={tooltipOpen}
      onMouseLeave={tooltipClose}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8vh',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.4), rgba(10, 10, 10, 0.2))',
        border: hasItems
          ? `1px solid ${colors.primary.alpha(0.4)}`
          : '1px solid rgba(220, 53, 69, 0.4)',
        borderRadius: '10px',
        padding: '1vh',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: hasItems
            ? `linear-gradient(90deg, transparent 0%, ${colors.primary.alpha(0.6)} 50%, transparent 100%)`
            : 'linear-gradient(90deg, transparent 0%, rgba(220, 53, 69, 0.6) 50%, transparent 100%)',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: hasItems ? colors.primary.alpha(0.6) : 'rgba(220, 53, 69, 0.6)',
          boxShadow: hasItems
            ? `0 4px 16px ${colors.primary.alpha(0.2)}`
            : '0 4px 16px rgba(220, 53, 69, 0.2)',
        },
      }}
    >
      {/* Item Image Container */}
      <Box
        sx={{
          width: '100%',
          height: 'auto',
          aspectRatio: '1 / 1',
          background: `radial-gradient(circle, ${getRarityColor(itemData.rarity)}15 0%, transparent 70%)`,
          border: `1px solid ${getRarityColor(itemData.rarity)}40`,
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={getItemImage(item.name)}
          sx={{
            width: '70%',
            height: '70%',
            objectFit: 'contain',
            filter: hasItems ? 'none' : 'grayscale(50%) opacity(0.7)',
          }}
        />
      </Box>

      {/* Divider Line */}
      <Box sx={{
        width: '100%',
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${colors.primary.alpha(0.3)} 50%, transparent 100%)`
      }} />

      {/* Item Label */}
      <Typography
        sx={{
          textAlign: 'center',
          color: colors.text.primary,
          fontSize: '0.55vw',
          fontWeight: 600,
          fontFamily: 'Rubik, sans-serif',
          textShadow,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          opacity: 0.9,
        }}
      >
        {itemData.label}
      </Typography>

      {/* Count Display */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          border: `1px solid ${colors.primary.alpha(0.2)}`,
          borderRadius: '6px',
          padding: '0.5vh 1vh',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.7vw',
            fontWeight: 600,
            fontFamily: 'Rubik, sans-serif',
            color: hasItems ? colors.primary.main : '#dc3545',
          }}
        >
          {Boolean(myCounts[item.name]) ? myCounts[item.name] : 0}
          <Box component="span" sx={{ color: 'rgba(255, 255, 255, 0.5)', margin: '0 0.3vw' }}>
            /
          </Box>
          {item.count * qty}
        </Typography>
      </Box>

      <Popover
        sx={{
          pointerEvents: 'none',
        }}
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
          horizontal: 'center',
        }}
        onClose={tooltipClose}
        disableEscapeKeyDown
        disableRestoreFocus
      >
        <Tooltip item={itemData} count={item.count} />
      </Popover>
    </Box>
  );
};
