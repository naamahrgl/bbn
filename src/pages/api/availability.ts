// src/pages/api/availability.ts
import type { APIRoute } from 'astro';
import { addDays } from 'date-fns';
import { DAILY_LIMITS, getExistingOrdersMap } from '../../lib/orders';
import type { ProductId } from '../../lib/products';

export const prerender = false;

interface CartItem {
  id: ProductId;
  quantity: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('📦 Received body in API:', body);

    if (!body || !Array.isArray(body.cart)) {
      console.warn('⚠️ Invalid cart structure:', body);
      return new Response(JSON.stringify({ error: 'Invalid cart' }), { status: 400 });
    }

    const cart: CartItem[] = body.cart;
    const result: Record<string, 'green' | 'orange' | 'red'> = {};

    // ✅ קריאה לנתוני הזמנות
    //const existingOrders = getExistingOrders();

    for (let i = 0; i < 14; i++) {
      const date = addDays(new Date(), i);
      const key = date.toISOString().split('T')[0];
const allOrders = getExistingOrdersMap();
const orders = allOrders[key] || {};

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
  } catch (err) {
    console.error('❌ Failed to process availability request:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 400 });
  }
};
