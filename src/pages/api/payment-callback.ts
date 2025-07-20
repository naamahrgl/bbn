// src/pages/api/payment-callback.ts

import type { APIRoute } from 'astro';

const UPDATE_ORDER_URL = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';

export const POST: APIRoute = async ({ request }) => {
  try {
let body: any;
const contentType = request.headers.get('content-type') || '';

if (contentType.includes('application/json')) {
    body = await request.json();
} else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    body = Object.fromEntries(formData.entries());
} else {
    return new Response(JSON.stringify({
        error: 'Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded" or "application/json".'
    }), { status: 400 });
}

console.log('[CALLBACK] Received Allpay callback');
for (const key in body) {
  console.log(`${key}: ${body[key]}`);
}

    const status = body.status;
    const orderId = body.order_id;
    const origin = body.add_field_1; // 👈 אל תשכחי לשלוח את זה ב־allpay-start

    if (!orderId || !origin) {
      throw new Error('Missing orderId or origin');
    }

    if (status === '1') {
      console.log(`✅ Payment success for order ${orderId}`);



await fetch(`${origin}/api/complete-payment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId }),
});


      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } else {
      console.error(`❌ Payment failed for order ${orderId}`);

      // Optional: עדכון ל־failed אם תרצי
      return new Response(JSON.stringify({ ok: false, error: 'Payment failed' }), { status: 400 });
    }

  } catch (err: any) {
    console.error('[PAYMENT CALLBACK ERROR]', {
      message: err.message,
      stack: err.stack
    });

    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
