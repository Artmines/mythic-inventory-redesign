import { useState } from 'react';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { craftingActions } from '../craftingSlice';
import { nuiActions } from '../../../services/nui';
import { getItemImage } from '../../../shared/utils/inventory';
import { Reagent } from './Reagent';
import { Tooltip } from './Tooltip';
import type { Recipe as RecipeType } from '../../../shared/types';
import { colors, textShadow } from '../../../styles/theme';

interface RecipeProps {
  index: number;
  recipe: RecipeType;
  cooldown?: number;
}

const getRarityColor = (rarity: number): string => {
  switch (rarity) {
    case 1:
      return '#ffffff';
    case 2:
      return '#9CE60D';
    case 3:
      return '#247ba5';
    case 4:
      return '#8e3bb8';
    case 5:
      return '#f2d411';
    default:
      return '#ffffff';
  }
};

export const Recipe = ({ index, recipe, cooldown }: RecipeProps) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.inventory);
  const { bench, crafting, myCounts } = useAppSelector((state) => state.crafting);
  const hidden = useAppSelector((state) => state.app.hidden);

  const [qty, setQty] = useState(1);
  const [resultEl, setResultEl] = useState<HTMLElement | null>(null);
  const resultOpen = Boolean(resultEl);

  const craftItemData = items[recipe.result.name];

  const resultTPOpen = (event: React.MouseEvent<HTMLElement>) => {
    setResultEl(event.currentTarget);
  };

  const resultTPClose = () => {
    setResultEl(null);
  };

  const hasReagents = (): boolean => {
    const reagents: Record<string, number> = {};
    recipe.items.forEach((item) => {
      if (!Boolean(reagents[item.name])) {
        reagents[item.name] = item.count * qty;
      } else {
        reagents[item.name] += item.count * qty;
      }
    });

    for (const item in reagents) {
      if (!Boolean(myCounts[item]) || reagents[item] > myCounts[item]) {
        return false;
      }
    }

    return true;
  };

  const craft = async () => {
    if (Boolean(crafting)) return;

    try {
      const res: any = await nuiActions.craftItem({
        bench,
        qty,
        result: recipe.id,
      });

      if (res && !res.error) {
        nuiActions.frontEndSound('SELECT');
        dispatch(
          craftingActions.setCrafting({
            recipe: recipe.id,
            start: Date.now(),
            time: recipe.time * qty,
          })
        );
      } else {
        nuiActions.frontEndSound('DISABLED');
        // Could show res.message to user if needed
      }
    } catch (err) {
      console.error('Craft error:', err);
      nuiActions.frontEndSound('DISABLED');
    }
  };

  const cancel = async () => {
    try {
      const res = await nuiActions.craftCancel();
      if (res) {
        nuiActions.frontEndSound('BACK');
        dispatch(craftingActions.endCrafting());
      } else {
        nuiActions.frontEndSound('DISABLED');
      }
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  const onQtyChange = (change: number) => {
    if (Boolean(recipe.cooldown)) return;

    if ((change < 0 && qty <= 1) || (change > 0 && qty >= 99)) return;
    setQty(qty + change);
  };

  if (!craftItemData) return null;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.6), rgba(10, 10, 10, 0.4))',
        border: `1px solid ${colors.primary.alpha(0.3)}`,
        borderRadius: '12px',
        padding: '1.5vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5vh',
        overflow: 'hidden',
      }}
    >
      <Popover
        sx={{ pointerEvents: 'none' }}
        TransitionProps={{ timeout: 0 }}
        slotProps={{
          paper: {
            sx: {
              background: 'transparent',
              boxShadow: 'none',
            },
          },
        }}
        open={resultOpen && !hidden}
        anchorEl={resultEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={resultTPClose}
        disableEscapeKeyDown
        disableRestoreFocus
      >
        <Tooltip item={craftItemData} count={recipe.result.count} />
      </Popover>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5vh',
        overflow: 'auto',
        paddingRight: '8px',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: colors.primary.alpha(0.6),
          transition: 'background ease-in 0.15s',
          borderRadius: '0.375rem',
          '&:hover': {
            background: colors.primary.alpha(0.4),
          },
        },
        '&::-webkit-scrollbar-track': {
          background: colors.primary.alpha(0.1),
          borderRadius: '0.375rem',
        },
      }}>

      {/* Item Preview Section */}
      <Box
        sx={{
          display: 'flex',
          gap: '1.5vh',
          alignItems: 'center',
          background: colors.secondary.darkAlpha(0.5),
          padding: '1vh',
          borderRadius: '8px',
          border: `1px solid ${colors.primary.alpha(0.2)}`,
        }}
      >
        <Box
          sx={{
            width: '80px',
            height: '80px',
            background: `radial-gradient(circle, ${getRarityColor(craftItemData.rarity)}15 0%, transparent 70%)`,
            border: `2px solid ${getRarityColor(craftItemData.rarity)}`,
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={getItemImage(recipe.result.name)}
            onMouseEnter={resultTPOpen}
            onMouseLeave={resultTPClose}
            sx={{
              height: '60px',
              width: '60px',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
          <Typography
            sx={{
              fontSize: '1.2vw',
              fontWeight: 700,
              fontFamily: 'Rubik, sans-serif',
              color: getRarityColor(craftItemData.rarity),
              textShadow,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {craftItemData.label}
          </Typography>

          <Box sx={{ display: 'flex', gap: '2vh', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
              <Typography sx={{ color: colors.text.secondary, fontFamily: 'Rubik, sans-serif', fontSize: '0.7vw', fontWeight: 500 }}>
                Yield:
              </Typography>
              <Typography sx={{ color: colors.primary.main, fontFamily: 'Rubik, sans-serif', fontSize: '0.7vw', fontWeight: 600 }}>
                {recipe.result.count * qty}x
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vh' }}>
              <Typography sx={{ color: colors.text.secondary, fontFamily: 'Rubik, sans-serif', fontSize: '0.7vw', fontWeight: 500 }}>
                Time:
              </Typography>
              <Typography sx={{ color: colors.primary.main, fontFamily: 'Rubik, sans-serif', fontSize: '0.7vw', fontWeight: 600 }}>
                {recipe.time > 0 ? `${(recipe.time * qty) / 1000}s` : 'Instant'}
              </Typography>
            </Box>
          </Box>

          {Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now() && (
            <Typography
              sx={{
                color: '#f09348',
                fontFamily: 'Rubik, sans-serif',
                fontSize: '0.7vw',
                fontWeight: 600,
              }}
            >
              Available in {Math.ceil((cooldown! - Date.now()) / 1000)}s
            </Typography>
          )}
        </Box>
      </Box>

      {/* Required Items Section */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1vh' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5vh',
        }}>
          <Typography
            sx={{
              fontSize: '0.9vw',
              fontWeight: 700,
              fontFamily: 'Rubik, sans-serif',
              color: colors.text.primary,
              textShadow,
            }}
          >
            Required Materials
          </Typography>
          <Box sx={{
            width: '100%',
            height: '1px',
            background: `linear-gradient(90deg, ${colors.primary.alpha(0.5)} 0%, transparent 100%)`
          }} />
        </Box>

        <Box
          sx={{
            background: colors.secondary.darkAlpha(0.3),
            border: `1px solid ${colors.primary.alpha(0.2)}`,
            borderRadius: '8px',
            padding: '1vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '1.5vh',
            }}
          >
            {recipe.items.map((item, k) => (
              <Reagent key={`${recipe.id}-${index}-ing-${k}`} item={item} qty={qty} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Action Section */}
      <Box
        sx={{
          display: 'flex',
          gap: '1vh',
          alignItems: 'center',
        }}
      >
        {/* Quantity Control */}
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
            disabled={Boolean(recipe.cooldown) || qty <= 1}
            onClick={() => onQtyChange(-1)}
            size="small"
            sx={{
              color: colors.primary.main,
              '&:disabled': { color: colors.text.disabled },
            }}
          >
            <Remove fontSize="small" />
          </IconButton>

          <Typography sx={{ fontFamily: 'Rubik, sans-serif', fontSize: '0.9vw', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>
            {qty}
          </Typography>

          <IconButton
            disabled={Boolean(recipe.cooldown) || qty >= 99}
            onClick={() => onQtyChange(1)}
            size="small"
            sx={{
              color: colors.primary.main,
              '&:disabled': { color: colors.text.disabled },
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>

        {/* Craft Button */}
        {Boolean(crafting) && crafting!.recipe === recipe.id && recipe.time > 0 ? (
          <Button
            onClick={cancel}
            fullWidth
            sx={{
              height: '45px',
              color: 'white',
              fontWeight: 600,
              fontFamily: 'Rubik, sans-serif',
              fontSize: '0.8vw',
              background: 'linear-gradient(135deg, rgba(110, 22, 22, 0.6), rgba(110, 22, 22, 0.4))',
              border: '1px solid rgba(220, 53, 69, 0.5)',
              borderRadius: '8px',
              textTransform: 'none',
              textShadow,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(110, 22, 22, 0.8), rgba(110, 22, 22, 0.6))',
                borderColor: 'rgba(220, 53, 69, 0.7)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(220, 53, 69, 0.3)',
              },
            }}
          >
            Cancel Crafting
          </Button>
        ) : (
          <Button
            onClick={craft}
            disabled={
              Boolean(crafting) ||
              !hasReagents() ||
              (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
            }
            fullWidth
            sx={{
              height: '45px',
              color: 'white',
              fontWeight: 600,
              fontFamily: 'Rubik, sans-serif',
              fontSize: '0.8vw',
              background:
                Boolean(crafting) ||
                !hasReagents() ||
                (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                  ? colors.grey.alpha(0.3)
                  : `linear-gradient(135deg, ${colors.primary.alpha(0.3)}, ${colors.primary.alpha(0.15)})`,
              border:
                Boolean(crafting) ||
                !hasReagents() ||
                (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                  ? `1px solid ${colors.grey.alpha(0.5)}`
                  : `1px solid ${colors.primary.alpha(0.5)}`,
              borderRadius: '8px',
              textTransform: 'none',
              textShadow,
              transition: 'all 0.2s ease',
              '&:hover': {
                background:
                  Boolean(crafting) ||
                  !hasReagents() ||
                  (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                    ? colors.grey.alpha(0.3)
                    : `linear-gradient(135deg, ${colors.primary.alpha(0.4)}, ${colors.primary.alpha(0.2)})`,
                borderColor:
                  Boolean(crafting) ||
                  !hasReagents() ||
                  (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                    ? colors.grey.alpha(0.5)
                    : colors.primary.alpha(0.7),
                transform:
                  Boolean(crafting) ||
                  !hasReagents() ||
                  (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                    ? 'none'
                    : 'translateY(-2px)',
                boxShadow:
                  Boolean(crafting) ||
                  !hasReagents() ||
                  (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                    ? 'none'
                    : `0 4px 16px ${colors.primary.alpha(0.3)}`,
              },
              '&:disabled': {
                color: colors.text.disabled,
              },
            }}
          >
            {Boolean(crafting) || !hasReagents() ? 'Cannot Craft' : 'Craft Item'}
          </Button>
        )}
      </Box>
      </Box>
    </Box>
  );
};
