// src/pages/api/payment-callback.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();

  const headers = {
    'Access-Control-Allow-Origin': 'https://www.breadbynaama.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };

  if (request.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  let body: Record<string, any> = {};
  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      body = JSON.parse(rawBody);
    } else {
      body = Object.fromEntries(new URLSearchParams(rawBody).entries());
    }
  } catch (err) {
    body = Object.fromEntries(new URLSearchParams(rawBody).entries());
  }

  const orderId = body.order_id || body.orderId;
  const origin = body.add_field_1 || body.origin;

  if (!orderId || !origin) {
    return new Response(JSON.stringify({ error: 'Missing orderId or origin' }), { status: 200, headers });
  }

  try {
    if (body.status == 1 || body.status === '1') {
      // תשלום הצליח
      const completePaymentResponse = await fetch(`${origin}/api/complete-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const result = await completePaymentResponse.json();

      return new Response(JSON.stringify({ ok: true, result }), { status: 200, headers });

    } else {
      // תשלום נכשל
      console.error(`[PAYMENT CALLBACK] Payment failed for order ${orderId}, status: ${body.status}`);

      // אפשר כאן להוסיף לוג גם לשיט, אם תרצי

      return new Response(JSON.stringify({
        ok: true,
        message: `Payment failed for order ${orderId}`,
        status: body.status
      }), { status: 200, headers }); // מחזירים 200 כדי לא לקבל retries מיותרים
    }

  } catch (err: any) {
    console.error('[PAYMENT CALLBACK ERROR]', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
