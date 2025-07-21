import type { APIRoute } from 'astro';

const UPDATE_ORDER_URL = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';
interface AllpayCallback {
  status?: string;
  order_id?: string;
  add_field_1?: string;
  [key: string]: any; // allows other dynamic keys
}

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
console.log('[CALLBACK] Raw Body:', rawBody);

    // Set CORS headers to allow requests from your Astro site
const headers = {
  'Access-Control-Allow-Origin': 'https://www.breadbynaama.com', // This allows any origin to make requests; in production, replace it with your actual frontend domain.
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow Authorization if necessary
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

if (request.method === 'OPTIONS') {
  return new Response('', { 
    status: 204,   
    headers
  });
}

  try {
    let body: Record<string, any> = {};
const contentType = request.headers.get('content-type') || '';
const ct = contentType.split(';')[0].trim().toLowerCase();

if (ct === 'application/json') {
  body = JSON.parse(rawBody);
} else if (ct === 'application/x-www-form-urlencoded' || ct === 'multipart/form-data') {
  const formData = new URLSearchParams(rawBody);
  body = Object.fromEntries(formData.entries());
} else {
  try {
    body = JSON.parse(rawBody);
  } catch {
    body = Object.fromEntries(new URLSearchParams(rawBody).entries());
  }
}

    // let body: Record<string, any> = {};
    // const contentType = request.headers.get('content-type') || '';

    // // // Normalize content type
    // // const ct = contentType.split(';')[0].trim().toLowerCase();

    // // if (ct === 'application/json') {
    // //   body = await request.json();
    // // } else if (ct === 'application/x-www-form-urlencoded' || ct === 'multipart/form-data') {
    // //   const formData = await request.formData();
    // //   body = Object.fromEntries(formData.entries());
    // // } else {
    // //   // Try fallback parsing if content-type is missing or wrong
    // //   const raw = await request.text();

    // //   try {
    // //     // Try parsing as JSON anyway
    // //     body = JSON.parse(raw);
    // //   } catch {
    // //     // Fallback: parse as URLSearchParams
    // //     body = Object.fromEntries(new URLSearchParams(raw).entries());
    // //   }
    // // }
    console.log('Received Body:', body); // Add logging to inspect the body


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

    
    console.log('Starting async payment processing for orderId:', orderId);

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
const responseBody = JSON.stringify({ ok: true });
return new Response(responseBody, {
  status: 200,
  headers: {
    ...headers,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(responseBody).toString()
  }
});


  } catch (err: any) {
    console.error('[PAYMENT CALLBACK ERROR]', {
      message: err.message,
      stack: err.stack
    });

const errorBody = JSON.stringify({ error: err.message });
return new Response(errorBody, {
  status: 500,
  headers: {
    ...headers,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(errorBody).toString()
  }
});

  }
};
