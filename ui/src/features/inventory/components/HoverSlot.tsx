import { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { lua2json } from '../../../shared/utils/lua';
import { rarityColors, getRGBFromHex, colors, textShadow } from '../../../styles/theme';

export const HoverSlot = () => {
  const hover = useAppSelector((state) => state.inventory.hover);
  const itemData = useAppSelector((state) =>
    state.inventory.hover ? state.inventory.items[state.inventory.hover.Name] : null
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Cancel previous frame if it exists
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for smoother updates
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Memoize metadata parsing to avoid recalculating on every render
  const metadata = useMemo(() => {
    if (!hover?.MetaData) return {};
    return typeof hover.MetaData === 'string' ? lua2json(hover.MetaData) : hover.MetaData;
  }, [hover?.MetaData]);

  // Memoize rarity calculations
  const rarityColor = useMemo(() => {
    return itemData ? rarityColors[itemData.rarity] : rarityColors[1];
  }, [itemData?.rarity]);

  const rarityRGB = useMemo(() => {
    return itemData ? getRGBFromHex(rarityColors[itemData.rarity]) : '134, 133, 239';
  }, [itemData?.rarity]);

  if (!hover || !itemData) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: mousePos.y,
        left: mousePos.x,
        transform: 'translate(-50%, -50%)',
        width: '125px',
        height: '125px',
        background: 'linear-gradient(to-br, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9))',
        border: `2px solid ${rarityColor}`,
        borderRadius: '12px',
        boxShadow: `0 8px 32px rgba(${rarityRGB}, 0.4)`,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '100%',
          backgroundImage: `url(${getItemImage(
            metadata.CustomItemImage || hover.Name
          )})`,
          backgroundSize: '55%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      />

      {hover.Count > 1 && (
        <Typography
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '0 5px',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Rubik, sans-serif',
            zIndex: 4,
            textShadow,
          }}
        >
          {hover.Count}
        </Typography>
      )}

      <Typography
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
          padding: '2px 5px',
          fontSize: '12px',
          fontFamily: 'Rubik, sans-serif',
          textShadow,
          background: colors.secondary.darkAlpha(0.9),
          borderTop: `1px solid ${colors.primary.alpha(0.2)}`,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          zIndex: 4,
        }}
      >
        {metadata.CustomItemLabel || itemData.label}
      </Typography>
    </Box>
  );
};
