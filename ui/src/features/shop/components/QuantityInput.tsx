import { useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { colors } from '../../../styles/theme';

interface QuantityInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const QuantityInput = ({ value, min = 1, max = 999, onChange, disabled = false }: QuantityInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
      setInputValue(String(clamped));
    } else {
      setInputValue(String(value));
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(String(value));
      setIsEditing(false);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5vh',
        background: colors.secondary.darkAlpha(0.5),
        border: `1px solid ${colors.primary.alpha(0.2)}`,
        borderRadius: '8px',
        padding: '0.5vh 1vh',
      }}
    >
      <IconButton
        disabled={disabled || value <= min}
        onClick={handleDecrement}
        size="small"
        sx={{
          color: colors.primary.main,
          '&:disabled': { color: colors.text.disabled },
          '&:hover': {
            background: colors.primary.alpha(0.1),
          },
        }}
      >
        <Remove fontSize="small" />
      </IconButton>

      {isEditing ? (
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '0.9vw',
              fontWeight: 600,
              fontFamily: 'Rubik, sans-serif',
              color: colors.text.primary,
              textAlign: 'center',
              minWidth: '30px',
              maxWidth: '50px',
            },
          }}
          sx={{
            '& input': {
              textAlign: 'center',
              padding: 0,
            },
          }}
        />
      ) : (
        <Typography
          onClick={() => !disabled && setIsEditing(true)}
          sx={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: '0.9vw',
            fontWeight: 600,
            minWidth: '30px',
            textAlign: 'center',
            cursor: disabled ? 'default' : 'pointer',
            color: disabled ? colors.text.disabled : colors.text.primary,
            '&:hover': {
              color: disabled ? colors.text.disabled : colors.primary.main,
            },
          }}
        >
          {value}
        </Typography>
      )}

      <IconButton
        disabled={disabled || value >= max}
        onClick={handleIncrement}
        size="small"
        sx={{
          color: colors.primary.main,
          '&:disabled': { color: colors.text.disabled },
          '&:hover': {
            background: colors.primary.alpha(0.1),
          },
        }}
      >
        <Add fontSize="small" />
      </IconButton>
    </Box>
  );
};
