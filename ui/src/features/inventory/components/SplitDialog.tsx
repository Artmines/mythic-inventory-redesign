import { useState } from 'react';
import {
  Menu,
  MenuItem,
  TextField,
  ButtonGroup,
  Button,
  Box,
  Fade,
} from '@mui/material';
import type { InventoryItem } from '../../../shared/types';
import { colors, textShadow } from '../../../styles/theme';

interface SplitDialogProps {
  open: boolean;
  item: InventoryItem | null;
  anchorPosition: { x: number; y: number };
  onClose: () => void;
  onSplit: (amount: number) => void;
}

export const SplitDialog = ({
  open,
  item,
  anchorPosition,
  onClose,
  onSplit,
}: SplitDialogProps) => {
  const [amount, setAmount] = useState<number>(item ? Math.ceil(item.Count / 2) : 1);

  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setAmount(Math.max(1, Math.min(value, item.Count)));
  };

  const handleQuickSet = (value: number) => {
    setAmount(Math.max(1, Math.min(value, item.Count)));
  };

  const handleDrag = () => {
    onSplit(amount);
    setAmount(Math.ceil(item.Count / 2));
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      disableEscapeKeyDown
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
      anchorReference="anchorPosition"
      anchorPosition={{ top: anchorPosition.y, left: anchorPosition.x }}
      TransitionComponent={Fade}
      slotProps={{
        paper: {
          sx: {
            background: 'linear-gradient(to-br, rgba(26, 26, 26, 0.95), rgba(10, 10, 10, 0.95))',
            border: `1px solid ${colors.primary.alpha(0.3)}`,
            borderRadius: '12px',
            boxShadow: `0 8px 32px ${colors.primary.alpha(0.2)}`,
          },
        },
      }}
    >
      <MenuItem disabled>Split Stack</MenuItem>
      <Box sx={{ p: 2, minWidth: '200px' }}>
        <TextField
          fullWidth
          type="number"
          value={amount}
          onChange={handleChange}
          inputProps={{
            min: 1,
            max: item.Count,
          }}
          sx={{ mb: 2 }}
        />
        <ButtonGroup variant="contained" fullWidth sx={{ mb: 2 }}>
          <Button onClick={() => handleQuickSet(1)}>1</Button>
          <Button onClick={() => handleQuickSet(Math.ceil(item.Count / 2))}>½</Button>
          <Button onClick={() => handleQuickSet(item.Count)}>All</Button>
        </ButtonGroup>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleDrag}
          sx={{
            background: `linear-gradient(135deg, ${colors.primary.alpha(0.2)}, rgba(84, 65, 209, 0.1))`,
            border: `1px solid ${colors.primary.alpha(0.3)}`,
            borderRadius: '8px',
            color: colors.text.primary,
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 600,
            textShadow,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.primary.alpha(0.3)}, rgba(84, 65, 209, 0.2))`,
              borderColor: colors.primary.main,
              boxShadow: `0 4px 16px ${colors.primary.alpha(0.2)}`,
              transform: 'translateY(-2px)',
            },
          }}
        >
          Drag {amount}
        </Button>
      </Box>
    </Menu>
  );
};
