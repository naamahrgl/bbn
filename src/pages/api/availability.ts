// src/pages/api/availability.ts
import type { APIRoute } from 'astro';
import { addDays, format } from 'date-fns';
import { getExistingOrdersMap, getPerDateLimits } from '../../lib/googleSheets';
import type { ProductId } from '../../lib/products';

export const prerender = false;

interface CartItem {
  id: ProductId;
  quantity: number;
}

type AvailabilityResponse = {
  [date: string]: {
    status: 'green' | 'orange' | 'red' | 'gray';
    soldOutProducts?: string[];
    partialAvailability?: { [productId: string]: number };
  };
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const cart: CartItem[] = body.cart || [];

    const [ordersMap, perDateLimits] = await Promise.all([
      getExistingOrdersMap(),
      getPerDateLimits()
    ]);

    const result: AvailabilityResponse = {};

    for (let i = 0; i < 21; i++) {
      const date = addDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayLimit = perDateLimits[dateKey];

      if (!dayLimit) {
        result[dateKey] = { status: 'gray' };
        continue;
      }

      const orders = ordersMap[dateKey] || {};
      let hasSoldOut = false;
      let needsAdjustment = false;
      const partialAvailability: Record<string, number> = {};
      const soldOutProducts: string[] = [];

      for (const item of cart) {
        const limit = dayLimit[item.id] ?? 0;
        const ordered = orders[item.id] ?? 0;
        const remaining = limit - ordered;

        if (remaining <= 0) {
          hasSoldOut = true;
          soldOutProducts.push(item.id);
        } else if (item.quantity > remaining) {
          needsAdjustment = true;
          partialAvailability[item.id] = remaining;
        }
      }

      if (hasSoldOut) {
        result[dateKey] = { status: 'red', soldOutProducts };
      } else if (needsAdjustment) {
        result[dateKey] = { status: 'orange', partialAvailability };
      } else {
        result[dateKey] = { status: 'green' };
      }
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.error('❌ availability error', err.message, err.stack);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
