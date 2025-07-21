import type { APIRoute } from 'astro';
import { logToSheet } from '../../lib/debugLog';

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

  // Parse body safely
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

  // Debug log raw input
  await logToSheet({
    step: 'callback-start',
    rawBody,
    parsedBody: body
  });

  const orderId = body.order_id || body.orderId;
  const origin = body.add_field_1 || body.origin;

  if (!orderId || !origin) {
    await logToSheet({
      step: 'missing-orderid-or-origin',
      rawBody,
      parsedBody: body
    });

    return new Response(JSON.stringify({ error: 'Missing orderId or origin' }), { status: 200, headers });
  }

  // Main logic: Handle complete-payment immediately
  try {
    if (body.status == 1 || body.status === '1') {
      const completePaymentResponse = await fetch(`${origin}/api/complete-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const result = await completePaymentResponse.json();

      await logToSheet({
        step: 'complete-payment-sent',
        orderId,
        response: result
      });

    } else {
      await logToSheet({
        step: 'payment-failed',
        orderId,
        status: body.status
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });

  } catch (err: any) {
    await logToSheet({
      step: 'callback-error',
      orderId,
      error: err.message
    });

    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
