import { useEffect, useState } from 'react';
import { Typography, type TypographyProps } from '@mui/material';
import { formatThousands } from '../../../shared/utils/formatters';
import { colors } from '../../../styles/theme';

interface PriceDisplayProps extends TypographyProps {
  targetPrice: number;
  duration?: number;
}

export const PriceDisplay = ({ targetPrice, duration = 150, ...typographyProps }: PriceDisplayProps) => {
  const [displayPrice, setDisplayPrice] = useState(targetPrice);

  useEffect(() => {
    const startPrice = displayPrice;
    const diff = targetPrice - startPrice;

    if (diff === 0) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      const current = startPrice + (diff * eased);

      setDisplayPrice(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [targetPrice, duration]);

  return (
    <Typography
      {...typographyProps}
      sx={{
        fontSize: '1.5vw',
        fontWeight: 700,
        fontFamily: 'Rubik, sans-serif',
        color: colors.success.main,
        textShadow: `0 0 8px ${colors.success.alpha(0.6)}`,
        ...typographyProps.sx,
      }}
    >
      ${formatThousands(Math.round(displayPrice))}
    </Typography>
  );
};
