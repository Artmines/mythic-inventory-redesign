import { useState, useMemo, memo, useCallback } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../inventorySlice';
import { getItemImage } from '../../../shared/utils/inventory';
import { lua2json } from '../../../shared/utils/lua';
import { formatThousands } from '../../../shared/utils/formatters';
import { rarityColors, getRGBFromHex, colors, textShadow } from '../../../styles/theme';
import { Tooltip } from './Tooltip';
import { SplitDialog } from './SplitDialog';
import { nuiActions } from '../../../services/nui';
import type { InventoryItem, ItemMetadata, InventoryType } from '../../../shared/types';

interface SlotProps {
  slot: number;
  item: InventoryItem | null;
  invType: InventoryType;
  owner: string | number;
  disabled?: boolean;
}

const SlotComponent = ({ slot, item, invType, owner, disabled = false }: SlotProps) => {
  const dispatch = useAppDispatch();
  const { itemData, hover, hoverOrigin, player, secondary, items } = useAppSelector((state) => ({
    itemData: item ? state.inventory.items[item.Name] : null,
    hover: state.inventory.hover,
    hoverOrigin: state.inventory.hoverOrigin,
    player: state.inventory.player,
    secondary: state.inventory.secondary,
    items: state.inventory.items,
  }), shallowEqual);
  const [tooltipAnchor, setTooltipAnchor] = useState<HTMLElement | null>(null);
  const [showSplit, setShowSplit] = useState(false);
  const [splitPosition, setSplitPosition] = useState({ x: 0, y: 0 });

  // Memoize metadata parsing to avoid recalculating on every render
  const metadata: ItemMetadata = useMemo(() => {
    if (!item?.MetaData) return {};
    return typeof item.MetaData === 'string' ? lua2json(item.MetaData) : item.MetaData;
  }, [item?.MetaData]);

  const isEmpty = !item || !itemData;

  // Memoize durability calculation
  const durability = useMemo((): number | null => {
    if (!item?.CreateDate || !itemData?.durability) return null;
    return Math.ceil(
      100 -
        ((Math.floor(Date.now() / 1000) - (item as any).CreateDate) /
          itemData.durability) *
          100
    );
  }, [item?.CreateDate, itemData?.durability]);

  const isBroken = durability !== null && durability <= 0;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!item || isEmpty) return;

    // Middle mouse button - Use Item
    if (e.button === 1) {
      const isPlayerInventory = invType === player.invType;
      if (isPlayerInventory && itemData?.isUsable && !isBroken) {
        nuiActions.frontEndSound('SELECT');
        nuiActions.useItem({
          owner: player.owner,
          slot,
          invType,
        });
        // Disable the slot optimistically while item is being used
        dispatch(
          inventoryActions.setPlayerSlotDisabled({
            slot,
            disabled: true,
          })
        );
      } else {
        nuiActions.frontEndSound('DISABLED');
      }
      return;
    }

    // Left mouse button only for dragging
    if (e.button !== 0) return;

    // Shift+Left-Click - Quick transfer to other inventory
    if (e.shiftKey && secondary.owner) {
      const isPlayerInventory = invType === player.invType;
      const targetInventory = isPlayerInventory ? secondary : player;

      // Block selling to shop
      if (isPlayerInventory && secondary.shop) {
        nuiActions.frontEndSound('DISABLED');
        return;
      }

      let destSlot: number | null = null;
      let shouldMerge = false;

      // Try to find existing stackable item first
      if (itemData?.isStackable) {
        for (const targetItem of targetInventory.inventory) {
          if (
            targetItem &&
            targetItem.Name === item.Name &&
            (itemData.isStackable === true ||
              (typeof itemData.isStackable === 'number' &&
                targetItem.Count + item.Count <= itemData.isStackable))
          ) {
            destSlot = targetItem.Slot;
            shouldMerge = true;
            break;
          }
        }
      }

      // If no stackable slot, find first empty slot
      if (!destSlot) {
        const occupiedSlots = new Set(
          targetInventory.inventory.map((item) => item?.Slot).filter(Boolean)
        );
        for (let i = 1; i <= targetInventory.size; i++) {
          if (!occupiedSlots.has(i)) {
            destSlot = i;
            break;
          }
        }
      }

      if (destSlot) {
        nuiActions.frontEndSound('drag');

        if (shouldMerge) {
          nuiActions.mergeSlot({
            ownerFrom: isPlayerInventory ? player.owner : secondary.owner,
            ownerTo: isPlayerInventory ? secondary.owner : player.owner,
            slotFrom: slot,
            slotTo: destSlot,
            name: item.Name,
            countFrom: item.Count,
            countTo: item.Count,
            invTypeFrom: invType,
            invTypeTo: targetInventory.invType,
          });

          // Optimistic update
          if (isPlayerInventory) {
            dispatch(
              inventoryActions.mergeItemPlayerToSecondary({
                originSlot: slot,
                destSlot,
                origin: item,
              })
            );
          } else {
            dispatch(
              inventoryActions.mergeItemSecondaryToPlayer({
                originSlot: slot,
                destSlot,
                origin: item,
              })
            );
          }
        } else {
          nuiActions.moveSlot({
            ownerFrom: isPlayerInventory ? player.owner : secondary.owner,
            ownerTo: isPlayerInventory ? secondary.owner : player.owner,
            slotFrom: slot,
            slotTo: destSlot,
            name: item.Name,
            countFrom: item.Count,
            countTo: item.Count,
            invTypeFrom: invType,
            invTypeTo: targetInventory.invType,
            isSplit: false,
          });

          // Optimistic update
          if (isPlayerInventory) {
            dispatch(
              inventoryActions.moveItemPlayerToSecondary({
                originSlot: slot,
                destSlot,
                origin: item,
              })
            );
          } else {
            dispatch(
              inventoryActions.moveItemSecondaryToPlayer({
                originSlot: slot,
                destSlot,
                origin: item,
              })
            );
          }
        }
      } else {
        nuiActions.frontEndSound('DISABLED');
      }
      return;
    }

    // Regular drag - Ctrl for half stack
    const count = e.ctrlKey ? Math.ceil(item.Count / 2) : item.Count;

    dispatch(
      inventoryActions.setHover({
        ...item,
        Count: count,
        owner,
        invType,
      })
    );

    dispatch(
      inventoryActions.setHoverOrigin({
        ...item,
        slot,
        owner,
        invType,
      })
    );
  }, [disabled, item, isEmpty, itemData, isBroken, invType, player, secondary, dispatch, owner, slot]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!hover || !hoverOrigin) return;
    if (e.button !== 0) return;

    // If dropping on same slot, just cancel
    if (hoverOrigin.Slot === slot && hoverOrigin.invType === invType) {
      dispatch(inventoryActions.clearHover());
      return;
    }

    // Determine origin and destination inventory
    const isOriginPlayer = hoverOrigin.invType === player.invType;
    const isDestPlayer = invType === player.invType;

    // Get hover item data
    const hoverItemData = items[hover.Name];
    if (!hoverItemData) {
      dispatch(inventoryActions.clearHover());
      return;
    }

    // Play drag sound
    nuiActions.frontEndSound('drag');

    // Check if we can merge items (same item, stackable, has room)
    const canMerge =
      item &&
      item.Name === hover.Name &&
      hoverItemData.isStackable &&
      (hoverItemData.isStackable === true ||
        (typeof hoverItemData.isStackable === 'number' &&
          item.Count + hover.Count <= hoverItemData.isStackable));

    // Determine if this is a split operation
    const isSplit = hoverOrigin.Count !== hover.Count;

    if (canMerge) {
      // MERGE operation
      nuiActions.mergeSlot({
        ownerFrom: isOriginPlayer ? player.owner : secondary.owner,
        ownerTo: isDestPlayer ? player.owner : secondary.owner,
        slotFrom: hoverOrigin.Slot,
        slotTo: slot,
        name: hover.Name,
        countFrom: hoverOrigin.Count,
        countTo: hover.Count,
        invTypeFrom: hoverOrigin.invType,
        invTypeTo: invType,
      });

      // Update local state optimistically
      if (isOriginPlayer && isDestPlayer) {
        dispatch(
          inventoryActions.mergeItemPlayerSame({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      } else if (isOriginPlayer && !isDestPlayer) {
        dispatch(
          inventoryActions.mergeItemPlayerToSecondary({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      } else if (!isOriginPlayer && isDestPlayer) {
        dispatch(
          inventoryActions.mergeItemSecondaryToPlayer({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      }
    } else if (item) {
      // SWAP operation (destination has item)
      nuiActions.swapSlot({
        ownerFrom: isOriginPlayer ? player.owner : secondary.owner,
        ownerTo: isDestPlayer ? player.owner : secondary.owner,
        slotFrom: hoverOrigin.Slot,
        slotTo: slot,
        name: hover.Name,
        countFrom: hoverOrigin.Count,
        countTo: hover.Count,
        invTypeFrom: hoverOrigin.invType,
        invTypeTo: invType,
      });

      // Update local state optimistically
      if (isOriginPlayer && isDestPlayer) {
        dispatch(
          inventoryActions.swapItemPlayerSame({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      } else if (isOriginPlayer && !isDestPlayer) {
        dispatch(
          inventoryActions.swapItemPlayerToSecondary({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      } else if (!isOriginPlayer && isDestPlayer) {
        dispatch(
          inventoryActions.swapItemSecondaryToPlayer({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      }
    } else {
      // MOVE operation (destination is empty)
      nuiActions.moveSlot({
        ownerFrom: isOriginPlayer ? player.owner : secondary.owner,
        ownerTo: isDestPlayer ? player.owner : secondary.owner,
        slotFrom: hoverOrigin.Slot,
        slotTo: slot,
        name: hover.Name,
        countFrom: hoverOrigin.Count,
        countTo: hover.Count,
        invTypeFrom: hoverOrigin.invType,
        invTypeTo: invType,
        isSplit,
      });

      // Update local state optimistically
      if (isOriginPlayer && isDestPlayer) {
        dispatch(
          inventoryActions.moveItemPlayerSame({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      } else if (isOriginPlayer && !isDestPlayer) {
        dispatch(
          inventoryActions.moveItemPlayerToSecondary({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      } else if (!isOriginPlayer && isDestPlayer) {
        dispatch(
          inventoryActions.moveItemSecondaryToPlayer({
            originSlot: hoverOrigin.Slot,
            destSlot: slot,
            origin: hover,
          })
        );
      }
    }

    dispatch(inventoryActions.clearHover());
  }, [hover, hoverOrigin, slot, item, invType, player, secondary, items, dispatch]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!item || isEmpty || hoverOrigin) return;

    // Shift+Right-Click - Open split dialog
    if (e.shiftKey && itemData?.isStackable && item.Count > 1) {
      setSplitPosition({ x: e.clientX, y: e.clientY });
      setShowSplit(true);
      return;
    }

    // Ctrl+Right-Click - Start dragging single item
    if (e.ctrlKey) {
      dispatch(
        inventoryActions.setHover({
          ...item,
          Count: 1,
          owner,
          invType,
        })
      );
      dispatch(
        inventoryActions.setHoverOrigin({
          ...item,
          owner,
          invType,
        })
      );
      return;
    }

    // Regular Right-Click - Start dragging half stack
    const count = item.Count > 1 ? Math.ceil(item.Count / 2) : item.Count;
    dispatch(
      inventoryActions.setHover({
        ...item,
        Count: count,
        owner,
        invType,
      })
    );
    dispatch(
      inventoryActions.setHoverOrigin({
        ...item,
        slot,
        owner,
        invType,
      })
    );
  }, [item, slot, disabled, isEmpty, hoverOrigin, itemData, dispatch, owner, invType, setSplitPosition, setShowSplit]);

  const handleSplitDrag = useCallback((amount: number) => {
    if (!item) return;

    dispatch(
      inventoryActions.setHover({
        ...item,
        Count: amount,
        owner,
        invType,
      })
    );
    dispatch(
      inventoryActions.setHoverOrigin({
        ...item,
        slot,
        owner,
        invType,
      })
    );
    setShowSplit(false);
  }, [item, slot, owner, invType, dispatch]);

  // Memoize durability color calculation
  const durabilityColor = useMemo(() => {
    if (!durability) return '#9f5cd6';
    if (durability >= 75) return '#52984a';
    if (durability >= 50) return '#f09348';
    return '#6e1616';
  }, [durability]);

  const isBeingDragged = hover && hoverOrigin?.Slot === slot && hoverOrigin?.invType === invType;

  // Memoize RGB color conversion (expensive operation)
  const rarityRGB = useMemo(() =>
    itemData ? getRGBFromHex(rarityColors[itemData.rarity]) : null,
    [itemData?.rarity]
  );

  return (
    <>
      <Box
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onMouseEnter={(e) => !isEmpty && setTooltipAnchor(e.currentTarget)}
        onMouseLeave={() => setTooltipAnchor(null)}
        sx={{
        width: '100%',
        height: '8.68vh',
        background: isBroken
          ? 'linear-gradient(135deg, rgba(110, 22, 22, 0.9), rgba(110, 22, 22, 0.6))'
          : 'linear-gradient(135deg, rgba(26, 26, 26, 0.85) 0%, rgba(15, 15, 15, 0.85) 50%, rgba(10, 10, 10, 0.85) 100%)',
        border: `2px solid ${
          rarityRGB ? `rgba(${rarityRGB}, 0.4)` : colors.primary.alpha(0.3)
        }`,
        borderRadius: '0.63vw',
        position: 'relative',
        opacity: isBeingDragged ? 0.35 : 1,
        boxShadow: rarityRGB
          ? `0 4px 16px rgba(${rarityRGB}, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
          : `0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: !isEmpty ? 'pointer' : 'default',
        willChange: isBeingDragged ? 'opacity' : 'auto',
        overflow: 'hidden',
        '&::before': !isEmpty ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${rarityRGB ? `rgba(${rarityRGB}, 0.6)` : 'rgba(159, 92, 214, 0.6)'}, transparent)`,
          animation: 'borderShine 3s ease-in-out infinite',
          zIndex: 10,
        } : undefined,
        '&:hover': {
          background: !isEmpty && !isBroken
            ? `linear-gradient(135deg, rgba(159, 92, 214, 0.2) 0%, rgba(122, 59, 179, 0.2) 50%, rgba(159, 92, 214, 0.2) 100%)`
            : isBroken
            ? 'linear-gradient(135deg, rgba(110, 22, 22, 1), rgba(110, 22, 22, 0.7))'
            : undefined,
          transform: !isEmpty ? 'scale(1.05)' : 'none',
          boxShadow: rarityRGB
            ? `0 8px 28px rgba(${rarityRGB}, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : `0 8px 28px rgba(159, 92, 214, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          borderColor: rarityRGB ? `rgba(${rarityRGB}, 0.8)` : colors.primary.alpha(0.8),
        },
      }}
    >
      {!isEmpty && itemData && (
        <>
          <Box
            sx={{
              height: '8.68vh',
              width: '100%',
              backgroundImage: `url(${getItemImage(
                metadata.CustomItemImage || item.Name
              )})`,
              backgroundSize: '55%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            }}
          />

          <Typography
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '0 0.26vw',
              fontSize: '0.97vh',
              fontWeight: 'bold',
              fontFamily: 'Rubik, sans-serif',
              textShadow,
              zIndex: 4,
            }}
          >
            {item.Count > 1 ? item.Count : ''}
          </Typography>

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
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              opacity: 0.8,
              textShadow,
              background: colors.secondary.dark,
              borderTop: `1px solid ${colors.primary.alpha(0.2)}`,
              borderBottomLeftRadius: '0.63vw',
              borderBottomRightRadius: '0.63vw',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              zIndex: 4,
            }}
          >
            {metadata.CustomItemLabel || itemData.label}
          </Typography>

          {durability !== null && durability > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '1.74vh',
                left: 0,
                width: '100%',
                height: '0.28vh',
                zIndex: 4,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={durability}
                sx={{
                  height: '100%',
                  backgroundColor: 'transparent',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: durabilityColor,
                    transition: 'none',
                  },
                }}
              />
            </Box>
          )}

          {isBroken && (
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.11vh',
                fontWeight: 'bold',
                fontFamily: 'Rubik, sans-serif',
                color: '#fff',
                textShadow: '0 0 10px rgba(0,0,0,0.8)',
                zIndex: 5,
              }}
            >
              BROKEN
            </Typography>
          )}

          {slot <= 5 && !secondary.shop && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '0.4vh 0.5vw',
                minWidth: '1.3vw',
                fontSize: '1vh',
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 800,
                textAlign: 'center',
                textShadow: `0 0 12px ${colors.primary.alpha(1)}, 0 2px 4px rgba(0, 0, 0, 0.8)`,
                color: '#ffffff',
                background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
                border: `2px solid ${colors.primary.light}`,
                borderRight: `3px solid ${colors.primary.alpha(0.8)}`,
                borderBottom: `3px solid ${colors.primary.alpha(0.8)}`,
                borderTopLeftRadius: '12px',
                borderBottomRightRadius: '8px',
                boxShadow: `0 0 16px ${colors.primary.alpha(0.6)}, 0 4px 8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset -1px 0 0 rgba(255, 255, 255, 0.1)`,
                backdropFilter: 'blur(4px)',
                zIndex: 4,
              }}
            >
              {slot}
            </Typography>
          )}

          {secondary.shop && owner === secondary.owner && invType === secondary.invType && (
            <>
              {item.Price === 0 ? (
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: '0 0.26vw',
                    fontSize: '0.83vh',
                    color: 'success.main',
                    zIndex: 4,
                  }}
                >
                  FREE
                </Typography>
              ) : (
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: '0 0.26vw',
                    fontSize: '0.83vh',
                    color: 'success.main',
                    zIndex: 4,
                    '&::before': {
                      content: '"$"',
                      marginRight: '0.1vw',
                      color: 'text.primary',
                    },
                  }}
                >
                  {formatThousands((item.Price ?? itemData?.price ?? 0) * item.Count)}
                  {item.Count > 1 && (
                    <Typography
                      component="span"
                      sx={{
                        marginLeft: '0.26vw',
                        fontSize: '0.69vh',
                        color: 'text.secondary',
                        '&::before': {
                          content: '"($"',
                        },
                        '&::after': {
                          content: '")"',
                        },
                      }}
                    >
                      {formatThousands(item.Price ?? itemData?.price ?? 0)}
                    </Typography>
                  )}
                </Typography>
              )}
            </>
          )}
        </>
      )}
    </Box>

    <Tooltip
      item={item}
      anchorEl={tooltipAnchor}
      onClose={() => setTooltipAnchor(null)}
      isShop={secondary?.shop === true && owner === secondary?.owner}
    />

    <SplitDialog
      open={showSplit}
      item={item}
      anchorPosition={splitPosition}
      onClose={() => setShowSplit(false)}
      onSplit={handleSplitDrag}
    />
    </>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export const Slot = memo(SlotComponent);
