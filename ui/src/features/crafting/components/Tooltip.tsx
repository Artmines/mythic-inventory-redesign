import { Box, Typography } from '@mui/material';
import type { ItemDefinition } from '../../../shared/types';
import { colors } from '../../../styles/theme';

interface TooltipProps {
  item: ItemDefinition;
  count: number;
  showRarity?: boolean;
}

const getTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return 'Consumable';
    case 2:
      return 'Weapon';
    case 3:
      return 'Tool';
    case 4:
      return 'Crafting Ingredient';
    case 5:
      return 'Collectable';
    case 6:
      return 'Junk';
    case 8:
      return 'Evidence';
    case 9:
      return 'Ammunition';
    case 10:
      return 'Container';
    case 11:
      return 'Gem';
    case 12:
      return 'Paraphernalia';
    case 13:
      return 'Wearable';
    case 14:
      return 'Contraband';
    case 15:
      return 'Collectable (Gang Chain)';
    case 16:
      return 'Weapon Attachment';
    case 17:
      return 'Crafting Schematic';
    case 18:
      return 'Equipment';
    default:
      return 'Unknown Item';
  }
};

const getRarityLabel = (rarity: number): string => {
  switch (rarity) {
    case 1:
      return 'Common';
    case 2:
      return 'Uncommon';
    case 3:
      return 'Rare';
    case 4:
      return 'Epic';
    case 5:
      return 'Objective';
    default:
      return 'Dogshit';
  }
};

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

export const Tooltip = ({ item, count, showRarity = false }: TooltipProps) => {
  if (!item) return null;

  return (
    <Box sx={{
      minWidth: 200,
      maxWidth: 300,
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(10, 10, 10, 0.95))',
      border: `2px solid ${getRarityColor(item.rarity)}`,
      borderRadius: '8px',
      padding: '1.5vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '1vh',
    }}>
      {/* Header with item name and count */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '0.5vh',
        borderBottom: `1px solid ${getRarityColor(item.rarity)}40`,
      }}>
        <Typography
          sx={{
            fontSize: '0.9vw',
            fontWeight: 700,
            fontFamily: 'Rubik, sans-serif',
            color: getRarityColor(item.rarity),
            textShadow: `0 0 8px ${getRarityColor(item.rarity)}80`,
            flex: 1,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.7vw',
            fontWeight: 600,
            fontFamily: 'Rubik, sans-serif',
            color: colors.primary.main,
            marginLeft: '1vh',
          }}
        >
          x{count}
        </Typography>
      </Box>

      {/* Info section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
        {showRarity && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
            <Box sx={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: getRarityColor(item.rarity),
              boxShadow: `0 0 6px ${getRarityColor(item.rarity)}`,
            }} />
            <Typography
              sx={{
                fontSize: '0.65vw',
                fontWeight: 600,
                fontFamily: 'Rubik, sans-serif',
                color: getRarityColor(item.rarity),
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {getRarityLabel(item.rarity)}
            </Typography>
          </Box>
        )}

        <Typography sx={{
          fontSize: '0.65vw',
          fontFamily: 'Rubik, sans-serif',
          color: colors.text.secondary,
          fontWeight: 500,
        }}>
          {getTypeLabel(item.type)}
        </Typography>

        {/* Tags row */}
        <Box sx={{ display: 'flex', gap: '0.5vh', flexWrap: 'wrap', marginTop: '0.5vh' }}>
          {item.isUsable && (
            <Box sx={{
              background: colors.primary.alpha(0.2),
              border: `1px solid ${colors.primary.alpha(0.4)}`,
              borderRadius: '4px',
              padding: '0.2vh 0.8vh',
            }}>
              <Typography sx={{
                fontSize: '0.6vw',
                fontFamily: 'Rubik, sans-serif',
                color: colors.primary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                Usable
              </Typography>
            </Box>
          )}

          {item.isStackable && (
            <Box sx={{
              background: 'rgba(156, 230, 13, 0.15)',
              border: '1px solid rgba(156, 230, 13, 0.3)',
              borderRadius: '4px',
              padding: '0.2vh 0.8vh',
            }}>
              <Typography sx={{
                fontSize: '0.6vw',
                fontFamily: 'Rubik, sans-serif',
                color: '#9CE60D',
                fontWeight: 600,
              }}>
                Max: {item.isStackable}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Weight */}
        {(item.weight || 0) > 0 && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5vh',
            marginTop: '0.5vh',
            paddingTop: '0.5vh',
            borderTop: `1px solid ${colors.primary.alpha(0.2)}`,
          }}>
            <Typography
              sx={{
                fontSize: '0.65vw',
                fontFamily: 'Rubik, sans-serif',
                color: colors.text.disabled,
                fontWeight: 500,
              }}
            >
              Weight:
            </Typography>
            <Typography
              sx={{
                fontSize: '0.65vw',
                fontFamily: 'Rubik, sans-serif',
                color: colors.primary.main,
                fontWeight: 600,
              }}
            >
              {item.weight.toFixed(2)} {(item.weight || 0) > 1 ? 'lbs' : 'lb'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Description */}
      {item.description && (
        <Box
          sx={{
            paddingTop: '1vh',
            borderTop: `1px solid ${colors.primary.alpha(0.2)}`,
            fontSize: '0.6vw',
            fontFamily: 'Rubik, sans-serif',
            color: colors.text.secondary,
            fontWeight: 400,
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}
    </Box>
  );
};
