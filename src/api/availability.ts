// src/pages/api/availability.ts
import type { APIRoute } from 'astro';
import { addDays } from 'date-fns';
import { DAILY_LIMITS, EXISTING_ORDERS } from '../lib/orders';




export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const cart: { id: string; quantity: number }[] = body.cart;
  const result: Record<string, 'green' | 'orange' | 'red'> = {};

  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    const key = date.toISOString().split('T')[0];
    const orders = EXISTING_ORDERS[key] || {};

    let hasSoldOut = false;
    let needsAdjustment = false;

    for (const item of cart) {
      const limit = DAILY_LIMITS[item.id];
      const ordered = orders[item.id] || 0;
      const remaining = limit - ordered;

      if (remaining <= 0) hasSoldOut = true;
      else if (item.quantity > remaining) needsAdjustment = true;
    }

    result[key] = hasSoldOut ? 'red' : needsAdjustment ? 'orange' : 'green';
  }

  return new Response(JSON.stringify(result), { status: 200 });
};
