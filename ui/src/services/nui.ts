import type { NUIMessage } from '../shared/types';

declare global {
  interface Window {
    invokeNative?: unknown;
  }
}

class NUIService {
  private resourceName: string;

  constructor() {
    this.resourceName = 'mythic-inventory';
  }

  async send<T = unknown>(event: string, data?: unknown): Promise<T> {
    const response = await fetch(`https://${this.resourceName}/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    // Check if response has content before trying to parse JSON
    const text = await response.text();
    if (!text || text.trim() === '') {
      return {} as T;
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.warn(`Failed to parse JSON response from ${event}:`, text);
      return {} as T;
    }
  }

  onMessage<T = unknown>(callback: (message: NUIMessage<T>) => void): () => void {
    const handler = (event: MessageEvent<NUIMessage<T>>) => {
      callback(event.data);
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }

  isEnvBrowser(): boolean {
    return !window.invokeNative;
  }
}

export const nui = new NUIService();

export const nuiActions = {
  close: () => nui.send('Close'),
  frontEndSound: (sound: string) => nui.send('FrontEndSound', { sound }),
  updateSettings: (settings: { muted: boolean; useBank: boolean }) =>
    nui.send('UpdateSettings', settings),
  submitAction: (action: string) => nui.send('SubmitAction', { action }),
  mergeSlot: (data: unknown) => nui.send('MergeSlot', data),
  swapSlot: (data: unknown) => nui.send('SwapSlot', data),
  moveSlot: (data: unknown) => nui.send('MoveSlot', data),
  useItem: (data: unknown) => nui.send('UseItem', data),
  giveItem: (data: unknown) => nui.send('GiveItem', data),
  getNearbyPlayers: () => nui.send('GetNearbyPlayers'),
  checkNearbyPlayers: () => nui.send('GetNearbyPlayers'),
  sendNotify: (message: string) => nui.send('SendNotify', { message }),
  craftItem: (data: { bench: string; qty: number; result: string }) => nui.send('Crafting:Craft', data),
  craftCancel: () => nui.send('Crafting:Cancel'),
  craftEnd: (recipe: string) => nui.send('Crafting:End', recipe),
  purchaseCart: (data: {
    shopOwner: string | number;
    shopInvType: number;
    items: Array<{ itemName: string; quantity: number; unitPrice: number; slot: number }>;
    paymentMethod: 'bank' | 'cash';
    totalPrice: number;
  }) => nui.send('PurchaseCart', data),
};
