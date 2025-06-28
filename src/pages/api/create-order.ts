// src/pages/api/create-order.ts
import type { APIRoute } from 'astro';
import type { OrderData } from '../../lib/orders';

export const prerender = false;

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8KegmHjmbNPj5BxcVhf5aq4K9-3-OzklDJMdaRUbfumEG0F5db6BRBWrqbMvdSBT1/exec';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: OrderData = await request.json();
    console.log('[📦 Sending order to Apps Script]', data);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('[📤 Apps Script response]', result);

    if (!response.ok || result.error) {
      throw new Error(result.error || 'Apps Script returned error');
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('[API ERROR]', err.message, err.stack);
    return new Response(JSON.stringify({ error: 'Failed to write to sheet' }), { status: 500 });
  }
};
