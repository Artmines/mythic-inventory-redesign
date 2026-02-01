import { Box, Typography, Popover } from '@mui/material';
import { useMemo } from 'react';
import { useAppSelector } from '../../../shared/hooks';
import { lua2json } from '../../../shared/utils/lua';
import { formatThousands, getItemTypeLabel, getRarityLabel } from '../../../shared/utils/formatters';
import { rarityColors, colors } from '../../../styles/theme';
import type { InventoryItem, ItemMetadata } from '../../../shared/types';

interface TooltipProps {
  item: InventoryItem | null;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  isShop?: boolean;
}

const ignoredFields = [
  'ammo',
  'clip',
  'CreateDate',
  'Container',
  'Quality',
  'CustomItemLabel',
  'CustomItemImage',
  'Items',
];

export const Tooltip = ({ item, anchorEl, onClose, isShop = false }: TooltipProps) => {
  const { items } = useAppSelector((state) => state.inventory);

  const itemData = item ? items[item.Name] : null;

  const metadata: ItemMetadata = useMemo(() => {
    if (!item?.MetaData) return {};
    return typeof item.MetaData === 'string' ? lua2json(item.MetaData) : item.MetaData;
  }, [item?.MetaData]);

  const durability = useMemo(() => {
    if (!metadata.CreateDate || !itemData?.durability) return null;
    return Math.ceil(
      100 -
        ((Math.floor(Date.now() / 1000) - metadata.CreateDate) / itemData.durability) * 100
    );
  }, [metadata.CreateDate, itemData?.durability]);

  const metadataEntries = useMemo(() =>
    Object.entries(metadata).filter(([key]) => !ignoredFields.includes(key)),
    [metadata]
  );

  if (!item || !anchorEl || !itemData) return null;

  const label = metadata.CustomItemLabel || itemData.label;
  const rarityLabel = getRarityLabel(itemData.rarity);
  const typeLabel = getItemTypeLabel(itemData.type);

  const renderMetadataField = (key: string, value: any) => {
    if (ignoredFields.includes(key)) return null;

    switch (key) {
      case 'SerialNumber':
        return (
          <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
            <strong>Serial Number:</strong> {value}
          </Typography>
        );
      case 'ScratchedSerialNumber':
        return (
          <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
            <strong>Serial Number:</strong> {'<scratched off>'}
          </Typography>
        );
      case 'WeaponComponents':
        if (!value || Object.keys(value).length === 0) return null;
        return (
          <Box key={key} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Weapon Attachments:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {Object.entries(value).map(([slot, attach]: [string, any]) => {
                const attachItem = items[attach.item];
                if (!attachItem) return null;
                return (
                  <Typography key={slot} component="li" variant="body2" sx={{ fontSize: '12px' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{slot}:</strong>{' '}
                    {attachItem.label}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        );
      default:
        if (typeof value === 'object') return null;
        return (
          <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
            <strong>{key}:</strong> {String(value)}
          </Typography>
        );
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      disableEscapeKeyDown
      TransitionProps={{ timeout: 0 }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{ pointerEvents: 'none' }}
      slotProps={{
        paper: {
          sx: {
            background: 'transparent',
            boxShadow: 'none',
          },
        },
      }}
    >
      <Box sx={{
        minWidth: 250,
        maxWidth: 350,
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(10, 10, 10, 0.98) 100%)',
        border: `2px solid ${rarityColors[itemData.rarity]}`,
        borderRadius: '12px',
        padding: '1.5vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1vh',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.9), 0 0 40px ${rarityColors[itemData.rarity]}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${rarityColors[itemData.rarity]}, transparent)`,
          animation: 'borderShine 3s ease-in-out infinite',
          zIndex: 10,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${rarityColors[itemData.rarity]}20, transparent)`,
          transform: 'translateX(-100%)',
          animation: 'shimmer 6s infinite',
          pointerEvents: 'none',
          zIndex: 1,
        },
      }}>
        {/* Header with item name, count, and price */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingBottom: '0.5vh',
          borderBottom: `1px solid ${rarityColors[itemData.rarity]}40`,
          gap: '1vh',
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '0.9vw',
                fontWeight: 700,
                fontFamily: 'Rubik, sans-serif',
                color: rarityColors[itemData.rarity],
                textShadow: `0 0 8px ${rarityColors[itemData.rarity]}80`,
                lineHeight: 1.2,
              }}
            >
              {label}
            </Typography>
            {item.Count > 1 && (
              <Typography
                sx={{
                  fontSize: '0.65vw',
                  fontWeight: 600,
                  fontFamily: 'Rubik, sans-serif',
                  color: colors.primary.main,
                  marginTop: '0.3vh',
                }}
              >
                x{item.Count}
              </Typography>
            )}
          </Box>
          {isShop && itemData.price > 0 && (
            <Typography
              sx={{
                fontSize: '0.75vw',
                fontWeight: 700,
                fontFamily: 'Rubik, sans-serif',
                color: '#9CE60D',
                textShadow: '0 0 6px rgba(156, 230, 13, 0.6)',
              }}
            >
              ${formatThousands(itemData.price)}
            </Typography>
          )}
        </Box>

        {/* Rarity and Type */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
            <Box sx={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: rarityColors[itemData.rarity],
              boxShadow: `0 0 6px ${rarityColors[itemData.rarity]}`,
            }} />
            <Typography
              sx={{
                fontSize: '0.65vw',
                fontWeight: 600,
                fontFamily: 'Rubik, sans-serif',
                color: rarityColors[itemData.rarity],
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {rarityLabel}
            </Typography>
          </Box>

          <Typography sx={{
            fontSize: '0.65vw',
            fontFamily: 'Rubik, sans-serif',
            color: colors.text.secondary,
            fontWeight: 500,
          }}>
            {typeLabel}
          </Typography>

          {/* Tags row */}
          <Box sx={{ display: 'flex', gap: '0.5vh', flexWrap: 'wrap', marginTop: '0.5vh' }}>
            {itemData.isUsable && (
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

            {itemData.isStackable && (
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
                  {item.Count} / {itemData.isStackable}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Description */}
        {itemData.description && (
          <Box
            sx={{
              paddingTop: '0.5vh',
              paddingBottom: '0.5vh',
              borderTop: `1px solid ${colors.primary.alpha(0.2)}`,
              borderBottom: `1px solid ${colors.primary.alpha(0.2)}`,
              fontSize: '0.6vw',
              fontFamily: 'Rubik, sans-serif',
              color: colors.text.secondary,
              fontWeight: 400,
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
            dangerouslySetInnerHTML={{ __html: itemData.description }}
          />
        )}

        {/* Stats Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          {/* Weight */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
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
              {itemData.weight} lbs
              {item.Count > 1 && ` (${(itemData.weight * item.Count).toFixed(2)} lbs total)`}
            </Typography>
          </Box>

          {/* Durability */}
          {durability !== null && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
              <Typography
                sx={{
                  fontSize: '0.65vw',
                  fontFamily: 'Rubik, sans-serif',
                  color: colors.text.disabled,
                  fontWeight: 500,
                }}
              >
                Durability:
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.65vw',
                  fontFamily: 'Rubik, sans-serif',
                  fontWeight: 600,
                  color:
                    durability >= 75
                      ? '#9CE60D'
                      : durability >= 50
                      ? '#f09348'
                      : '#dc3545',
                }}
              >
                {Math.max(durability, 0)}%
              </Typography>
            </Box>
          )}

          {/* Quality */}
          {!isNaN(item.Quality ?? NaN) && (item.Quality ?? 0) > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
              <Typography
                sx={{
                  fontSize: '0.65vw',
                  fontFamily: 'Rubik, sans-serif',
                  color: colors.text.disabled,
                  fontWeight: 500,
                }}
              >
                Quality:
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.65vw',
                  fontFamily: 'Rubik, sans-serif',
                  fontWeight: 600,
                  color:
                    (item.Quality ?? 0) >= 75
                      ? '#9CE60D'
                      : (item.Quality ?? 0) >= 50
                      ? '#f09348'
                      : '#dc3545',
                }}
              >
                {item.Quality}%
              </Typography>
            </Box>
          )}
        </Box>

        {/* Metadata Section */}
        {metadataEntries.length > 0 && (
          <Box
            sx={{
              paddingTop: '1vh',
              borderTop: `1px solid ${colors.primary.alpha(0.2)}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5vh',
              '& strong': {
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
              },
              '& p': {
                fontSize: '0.6vw',
                fontFamily: 'Rubik, sans-serif',
                color: colors.text.secondary,
                margin: 0,
              },
            }}
          >
            {metadataEntries.map(([key, value]) =>
              renderMetadataField(key, value)
            )}
          </Box>
        )}
      </Box>
    </Popover>
  );
};
