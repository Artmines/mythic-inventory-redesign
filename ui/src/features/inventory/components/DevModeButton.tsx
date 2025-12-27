import { IconButton, Tooltip } from '@mui/material';
import { Settings } from '@mui/icons-material';

interface DevModeButtonProps {
  onClick: () => void;
}

export const DevModeButton = ({ onClick }: DevModeButtonProps) => {
  // Only show in dev mode
  if (import.meta.env.MODE === 'production') {
    return null;
  }

  return (
    <Tooltip title="Dev Mode Controls" placement="left">
      <IconButton
        onClick={onClick}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(36, 123, 165, 0.8)',
          color: 'white',
          width: 48,
          height: 48,
          zIndex: 9999,
          '&:hover': {
            backgroundColor: 'rgba(36, 123, 165, 1)',
          },
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Settings />
      </IconButton>
    </Tooltip>
  );
};
