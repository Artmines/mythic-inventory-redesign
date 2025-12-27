import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { craftingActions } from '../craftingSlice';
import { getItemImage } from '../../../shared/utils/inventory';
import { Recipe } from './Recipe';
import { colors, textShadow } from '../../../styles/theme';

// Crafting Icon
const CraftingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1.3021vw" height="2.3148vh" viewBox="0 0 512 512" fill="none">
    <path fill="white" d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
  </svg>
);

export const Crafting = () => {
  const dispatch = useAppDispatch();
  const { itemsLoaded, items } = useAppSelector((state) => state.inventory);
  const { cooldowns, recipes, benchName, currentCraft } = useAppSelector(
    (state) => state.crafting
  );

  const [filtered, setFiltered] = useState(recipes);
  const [search] = useState('');

  useEffect(() => {
    setFiltered(
      recipes.filter((recipe) =>
        items[recipe.result.name]?.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, recipes, items]);

  const setCurrentCraft = (number: number) => {
    dispatch(craftingActions.setCurrentCraft(number));
  };

  if (!itemsLoaded || Object.keys(items).length === 0) {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: 'fit-content',
          height: 'fit-content',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={36} sx={{ margin: 'auto' }} />
        <Typography component="span" sx={{ display: 'block' }}>
          Loading Inventory Items
        </Typography>
        <Alert variant="outlined" severity="info" sx={{ marginTop: '20px' }}>
          If you see this for a long period of time, there may be an issue. Try restarting your
          FiveM.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          background: colors.inventory.background,
          borderRadius: '5px',
          border: `1px solid ${colors.primary.alpha(0.3)}`,
          padding: '1.5vw',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5vh',
          width: '85%',
          height: '75%',
          maxWidth: '1400px',
        }}
      >
        {/* Header with Icon and Bench Name */}
        <Box sx={{ display: 'flex', gap: '.5208vw', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            width: '2.0833vw',
            height: '3.7037vh',
            borderRadius: '.2083vw',
            background: colors.primary.alpha(0.7),
            boxShadow: `0px 0px 10px 1px ${colors.primary.alpha(0.49)}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <CraftingIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1.0417vw', fontWeight: 700, fontFamily: 'Rubik, sans-serif', textShadow }}>
              {benchName !== 'none' ? benchName : 'Crafting'}
            </Typography>
            <Typography sx={{ color: colors.text.secondary, fontSize: '.625vw', fontWeight: 400, fontFamily: 'Rubik, sans-serif' }}>
              Select a blueprint to craft
            </Typography>
          </Box>
        </Box>

        {/* Main Content Container */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: '2vh',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Left Container - Recipe Grid */}
          <Box
            sx={{
              flex: 1,
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {Boolean(filtered) && filtered.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(7.29vw, 1fr))',
                  gap: '1vh',
                  overflowY: 'auto',
                  paddingRight: '0.42vw',
                  '&::-webkit-scrollbar': {
                    width: '0.21vw',
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
                }}
              >
                {filtered.map((recipe, index) => {
                  const craftItemData = items[recipe.result.name];
                  if (!craftItemData) return null;
                  const isSelected = currentCraft === index;

                  return (
                    <Button
                      key={`${recipe.id}-${index}`}
                      onClick={() => setCurrentCraft(index)}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '9.72vh',
                        background: isSelected
                          ? `radial-gradient(50% 50% at 50% 50%, ${colors.primary.alpha(0.15)} 0%, ${colors.primary.alpha(0.25)} 100%)`
                          : `radial-gradient(50% 50% at 50% 50%, ${colors.grey.alpha(0.05)} 0%, rgba(182, 182, 182, 0.08) 100%)`,
                        border: isSelected
                          ? `1px solid ${colors.primary.alpha(0.6)}`
                          : `1px solid ${colors.primary.alpha(0.2)}`,
                        borderRadius: '0.63vw',
                        boxShadow: isSelected
                          ? `0 0.56vh 1.67vh ${colors.primary.alpha(0.3)}`
                          : '0 0.28vh 0.83vh rgba(0, 0, 0, 0.3)',
                        padding: '0.56vh 0.42vw',
                        flexDirection: 'column',
                        gap: '0.56vh',
                        overflow: 'hidden',
                        color: colors.text.primary,
                        textTransform: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: `radial-gradient(50% 50% at 50% 50%, ${colors.primary.alpha(0.1)} 0%, ${colors.primary.alpha(0.22)} 100%)`,
                          borderColor: colors.primary.alpha(0.5),
                          transform: 'scale(1.01)',
                          boxShadow: `0 8px 24px ${colors.primary.alpha(0.25)}`,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={getItemImage(recipe.result.name)}
                        sx={{
                          height: '5.56vh',
                          width: '4.17vw',
                          objectFit: 'contain',
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: '0.75vw',
                          fontWeight: 600,
                          fontFamily: 'Rubik, sans-serif',
                          textShadow,
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {craftItemData.label}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.2vw',
                    fontFamily: 'Rubik, sans-serif',
                    textAlign: 'center',
                    color: colors.text.disabled,
                  }}
                >
                  No Crafting Blueprints Available
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right Container - Recipe Details */}
          {Boolean(filtered) && filtered.length > 0 && currentCraft !== null && (
            <Box sx={{ flex: '0 0 45%', height: '100%' }}>
              {filtered[currentCraft] && (
                <Recipe
                  key={`${filtered[currentCraft].id}-${currentCraft}`}
                  index={currentCraft}
                  recipe={filtered[currentCraft]}
                  cooldown={cooldowns[filtered[currentCraft].id]}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
