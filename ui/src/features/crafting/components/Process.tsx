import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../shared/hooks';
import { useInterval } from '../../../shared/hooks';
import { craftingActions } from '../craftingSlice';
import { nuiActions } from '../../../services/nui';
import type { CraftingProgress } from '../../../shared/types';

interface ProcessProps {
  crafting: CraftingProgress | null;
}

export const Process = ({ crafting }: ProcessProps) => {
  const dispatch = useAppDispatch();
  const [ending, setEnding] = useState(false);

  useInterval(() => {
    if (Boolean(crafting) && !ending) {
      const dif = Date.now() - (crafting as any).start;
      if (dif <= (crafting as any).time + 100) {
        dispatch(
          craftingActions.setCraftProgress(
            ((Date.now() - (crafting as any).start) / (crafting as any).time) * 100
          )
        );
      } else {
        setEnding(true);
        craftEnd();
      }
    }
  }, 250);

  useEffect(() => {
    if (!Boolean(crafting)) setEnding(false);
  }, [crafting]);

  const craftEnd = async () => {
    if (!Boolean(crafting)) return;
    setEnding(true);
    await nuiActions.craftEnd((crafting as any).recipe);

    // Client will send END_CRAFTING and SET_BENCH with fresh myCounts
    // No need to dispatch anything here
  };

  return null;
};
