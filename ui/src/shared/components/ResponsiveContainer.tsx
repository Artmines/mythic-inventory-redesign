import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
}

/**
 * Responsive container that scales content based on viewport size
 * Reference resolution: 2560x1440 (2K)
 */
export const ResponsiveContainer = ({ children }: ResponsiveContainerProps) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      // Reference resolution (2K)
      const referenceWidth = 2560;
      const referenceHeight = 1440;

      // Calculate scale based on current viewport
      const widthScale = window.innerWidth / referenceWidth;
      const heightScale = window.innerHeight / referenceHeight;

      // Use the smaller scale to ensure everything fits
      const newScale = Math.min(widthScale, heightScale);

      // Clamp between 0.6 and 1.2 for reasonable min/max sizes
      const clampedScale = Math.max(0.6, Math.min(newScale, 1.2));

      setScale(clampedScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        transformOrigin: 'center center',
        transform: `scale(${scale})`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </Box>
  );
};
