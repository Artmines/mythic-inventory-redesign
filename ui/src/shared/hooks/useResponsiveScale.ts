import { useState, useEffect } from 'react';

// Reference resolution (2K)
const REFERENCE_WIDTH = 2560;
const REFERENCE_HEIGHT = 1440;

/**
 * Hook to calculate responsive scale based on current viewport
 * relative to a reference resolution (2560x1440)
 */
export const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const widthScale = window.innerWidth / REFERENCE_WIDTH;
      const heightScale = window.innerHeight / REFERENCE_HEIGHT;

      // Use the smaller of the two scales to ensure everything fits
      const newScale = Math.min(widthScale, heightScale);

      // Clamp the scale to prevent extreme values
      const clampedScale = Math.max(0.5, Math.min(newScale, 2));

      setScale(clampedScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return scale;
};

/**
 * Convert viewport width (vw) to pixels scaled for current resolution
 */
export const vw = (value: number, scale: number = 1): string => {
  return `${(value * REFERENCE_WIDTH / 100) * scale}px`;
};

/**
 * Convert viewport height (vh) to pixels scaled for current resolution
 */
export const vh = (value: number, scale: number = 1): string => {
  return `${(value * REFERENCE_HEIGHT / 100) * scale}px`;
};

/**
 * Responsive font size using clamp for smooth scaling
 */
export const responsiveFontSize = (vwValue: number): string => {
  const minSize = (vwValue * 1920 / 100) * 0.75; // 75% at 1080p
  const preferredSize = vwValue;
  const maxSize = (vwValue * 3840 / 100) * 1.25; // 125% at 4K

  return `clamp(${minSize}px, ${preferredSize}vw, ${maxSize}px)`;
};
