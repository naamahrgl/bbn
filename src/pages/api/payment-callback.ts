// src/pages/api/payment-callback.ts

import type { APIRoute } from 'astro';

const UPDATE_ORDER_URL = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.formData();

    const status = body.get('Status');
    const orderId = body.get('Order');
    const origin = body.get('CustomField1'); // 👈 אל תשכחי לשלוח את זה ב־allpay-start

    if (!orderId || !origin) {
      throw new Error('Missing orderId or origin');
    }

    if (status === '0') {
      console.log(`✅ Payment success for order ${orderId}`);



await fetch(`${origin}/api/finalize-order`, {
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
