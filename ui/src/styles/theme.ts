import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#85efe6ff',
      light: '#a7e9f5ff',
      dark: '#54aac4ff',
    },
    secondary: {
      main: '#1a1a1a',
      dark: '#0a0a0a',
    },
    success: {
      main: '#9CE60D',
    },
    error: {
      main: '#6e1616',
      light: '#dc3545',
      dark: '#ff4757',
    },
    warning: {
      main: '#f09348',
    },
    info: {
      main: '#247ba5',
    },
    background: {
      default: import.meta.env.MODE === 'production' ? 'transparent' : '#0a0a0a',
      paper: 'rgba(26, 26, 26, 0.85)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
    grey: {
      700: '#444444',
    },
  },
  typography: {
    fontFamily: [
      'Rubik',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Rubik, sans-serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: import.meta.env.MODE === 'production' ? 'transparent' : undefined,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(133, 235, 239, 0.6)',
            transition: 'background ease-in 0.15s',
            borderRadius: '0.375rem',
            '&:hover': {
              background: 'rgba(133, 239, 239, 0.9)',
            },
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(133, 214, 239, 0.1)',
          },
        },
      },
    },
  },
});

export const rarityColors = {
  1: '#ffffff',
  2: '#9CE60D',
  3: '#247ba5',
  4: '#8e3bb8',
  5: '#f2d411',
} as const;

// Glassmorphism helper styles
export const glassStyles = {
  card: {
    background: 'linear-gradient(to-br, rgba(26, 26, 26, 0.8), rgba(10, 10, 10, 0.6))',
    border: '1px solid rgba(133, 227, 239, 0.3)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(133, 227, 239, 0.2)',
  },
  slot: {
    background: 'linear-gradient(to-br, rgba(26, 26, 26, 0.6), rgba(10, 10, 10, 0.4))',
    border: '1px solid rgba(133, 239, 239, 0.2)',
    borderRadius: '12px',
  },
} as const;

// Helper function to convert hex to RGB string for rgba colors
export const getRGBFromHex = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '134, 133, 239'; // fallback to purple
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

// Global text shadow for all text elements
export const textShadow = '0px 1px 1px rgba(0, 0, 0, 0.25)';

// Color helper utilities - convert theme colors to rgba
export const alpha = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Predefined color utilities for common use cases
export const colors = {
  primary: {
    main: '#85efe6ff',
    alpha: (opacity: number) => alpha('#85efe6ff', opacity),
  },
  success: {
    main: '#9CE60D',
    alpha: (opacity: number) => alpha('#9CE60D', opacity),
  },
  secondary: {
    main: '#1a1a1a',
    dark: '#0a0a0a',
    mainAlpha: (opacity: number) => alpha('#1a1a1a', opacity),
    darkAlpha: (opacity: number) => alpha('#0a0a0a', opacity),
  },
  inventory: {
    background: '#1f1f1f',
  },
  error: {
    light: '#dc3545',
    dark: '#ff4757',
    lightAlpha: (opacity: number) => alpha('#dc3545', opacity),
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.4)',
  },
  grey: {
    main: '#444444',
    alpha: (opacity: number) => alpha('#444444', opacity),
  },
} as const;
