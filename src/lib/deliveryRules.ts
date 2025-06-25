// lib/deliveryRules.ts
import { isSameDay, addDays } from 'date-fns';
import { DAILY_LIMITS, getExistingOrdersMap } from '../lib/orders';
import type { ProductId } from './products';

type CartItem = { id: ProductId; quantity: number };

export function getAvailability(cart: CartItem[], date: Date): 'green' | 'orange' | 'red' {
  const dateStr = date.toISOString().split('T')[0];
  const existingOrders = getExistingOrdersMap();
  const orders = existingOrders[dateStr] || {};

  let hasSoldOut = false;
  let needsAdjustment = false;

  for (const item of cart) {
    const limit = DAILY_LIMITS[item.id];
    const alreadyOrdered = orders[item.id] || 0;
    const remaining = limit - alreadyOrdered;

    if (remaining <= 0) {
      hasSoldOut = true;
    } else if (item.quantity > remaining) {
      needsAdjustment = true;
    }
  }

  if (hasSoldOut) return 'red';
  if (needsAdjustment) return 'orange';
  return 'green';
}

export function getDayColors(cart: CartItem[]) {
  const result: { [key: string]: 'green' | 'orange' | 'red' } = {};

  for (let i = 0; i < 14; i++) {
    const day = addDays(new Date(), i);
    const key = day.toISOString().split('T')[0];
    result[key] = getAvailability(cart, day);
  }

  return result;
}
