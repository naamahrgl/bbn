import type { APIRoute } from 'astro';

const UPDATE_ORDER_URL = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';
interface AllpayCallback {
  status?: string;
  order_id?: string;
  add_field_1?: string;
  [key: string]: any; // allows other dynamic keys
}

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: AllpayCallback = {};
    const contentType = request.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        body = await request.json();
      } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      } else {
        const raw = await request.text();
        console.warn('⚠️ Unexpected Content-Type:', contentType, 'Raw body:', raw);
        // Still return 200 to prevent provider retrying endlessly
        return new Response(
          JSON.stringify({ warning: `Unsupported Content-Type: ${contentType}. Request accepted.` }),
          { status: 200 }
        );
      }
    } catch (err) {
      console.error('❌ Failed to parse request body:', err);
      // Accept it, log it, and analyze later if needed
      return new Response(
        JSON.stringify({ warning: 'Failed to parse request body. Accepted anyway.' }),
        { status: 200 }
      );
    }

    console.log('[CALLBACK] Received Allpay callback');
    for (const key in body) {
      console.log(`${key}: ${body[key]}`);
    }

    const status = body.status;
    const orderId = body.order_id;
    const origin = body.add_field_1;

    if (!orderId || !origin) {
      throw new Error('Missing orderId or origin');
    }

    // Immediately respond with 200 OK to prevent retries
    const response = new Response(JSON.stringify({ ok: true }), { status: 200 });
    
    // Defer the payment processing to run asynchronously
    setImmediate(async () => {
      try {
        if (status === '1') {
          console.log(`✅ Payment success for order ${orderId}`);

          // Asynchronously handle the payment (not blocking the response)
          await fetch(`${origin}/api/complete-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });

        } else {
          console.error(`❌ Payment failed for order ${orderId}`);
        }
      } catch (error) {
        console.error('Error during asynchronous payment processing:', error);
      }
    });

    // Return the quick 200 OK response
    return response;

  } catch (err: any) {
    console.error('[PAYMENT CALLBACK ERROR]', {
      message: err.message,
      stack: err.stack
    });

    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
