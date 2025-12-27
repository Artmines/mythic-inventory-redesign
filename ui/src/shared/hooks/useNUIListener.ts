import { useEffect } from 'react';
import { nui } from '../../services/nui';
import type { NUIMessage } from '../types';

export function useNUIListener<T = unknown>(
  eventType: string,
  handler: (data: T) => void
): void {
  useEffect(() => {
    const handleMessage = (message: NUIMessage<T>) => {
      if (message.type === eventType && message.data !== undefined) {
        handler(message.data);
      }
    };

    return nui.onMessage(handleMessage);
  }, [eventType, handler]);
}
