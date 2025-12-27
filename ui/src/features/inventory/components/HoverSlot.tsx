import { useEffect, useState, useMemo, useRef, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { lua2json } from '../../../shared/utils/lua';
import { rarityColors, getRGBFromHex, colors, textShadow } from '../../../styles/theme';

const HoverSlotComponent = () => {
  const { hover, itemData } = useAppSelector((state) => {
    const hover = state.inventory.hover;
    return {
      hover,
      itemData: hover ? state.inventory.items[hover.Name] : null,
    };
  }, shallowEqual);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update ref immediately without creating new objects
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      // Schedule only one update per frame
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePos({ x: posRef.current.x, y: posRef.current.y });
          rafRef.current = undefined;
        });
      }
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
        width: '8.68vh',
        height: '8.68vh',
        background: 'linear-gradient(to-br, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.9))',
        border: `2px solid ${rarityColor}`,
        borderRadius: '0.63vw',
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
            padding: '0 0.26vw',
            fontSize: '0.97vh',
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
          padding: '0.14vh 0.26vw',
          fontSize: '0.83vh',
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

// Memoize component to prevent unnecessary re-renders from parent
export const HoverSlot = memo(HoverSlotComponent);
