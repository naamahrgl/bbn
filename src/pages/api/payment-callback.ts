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
    const debugOrder0 = {
      id: 'debug_' + Math.random().toString(36).substring(2, 10),
      customerName: 'CALLBACK LOG',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      notes: rawBody, // כל ה-raw
      totalAmount: 0,
      deliveryDate: JSON.stringify(rawBody), // אחרי הפרסינג
      deliveryMethod: 'callback start',
      items: [{
        productId: 'debug',
        name: 'Debug Item',
        quantity: 1,
        price: 0,
      }],
      couponCode: '',
      couponAmount: '',
      amountToPay: 0,
      deliveryFee: 0,
      status: "callback-log"
    }; 
    await fetch('https://www.breadbynaama.com/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debugOrder0),
    });
  try {
    // ✅ סלחני לפרסינג:
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

    // ✅ לוג ראשוני ישירות ל־Sheets דרך create-order:
    const debugOrder = {
      id: 'debug_' + Math.random().toString(36).substring(2, 10),
      customerName: 'CALLBACK LOG',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      notes: rawBody, // כל ה-raw
      totalAmount: 0,
      deliveryDate: JSON.stringify(body), // אחרי הפרסינג
      deliveryMethod: 'callback start',
      items: [{
        productId: 'debug',
        name: 'Debug Item',
        quantity: 1,
        price: 0,
      }],
      couponCode: '',
      couponAmount: '',
      amountToPay: 0,
      deliveryFee: 0,
      status: "callback-log"
    };

    await fetch('https://www.breadbynaama.com/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debugOrder),
    });

    const orderId = body.order_id || body.orderId;
    const origin = body.add_field_1 || body.origin;

    if (!orderId || !origin) {
      const debugOrder2 = { ...debugOrder, 
        id: 'debug_' + Math.random().toString(36).substring(2, 10),
        deliveryMethod: 'missing-orderid-or-origin'
      };

      await fetch('https://www.breadbynaama.com/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debugOrder2),
      });

      return new Response(JSON.stringify({ error: 'Missing orderId or origin' }), { status: 200, headers });
    }

    // ✅ המשך הטיפול - בצורה אסינכרונית
    setImmediate(async () => {
      try {
        const coorigin = origin + '/api/create-order';

        const debugOrder3 = { ...debugOrder, 
          id: 'debug_' + Math.random().toString(36).substring(2, 10),
          deliveryMethod: 'inside setImmediate',
          notes: 'Going to complete-payment'
        };

        await fetch(coorigin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(debugOrder3),
        });

        if (body.status === '1') {
          await fetch(`${origin}/api/complete-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          });

          const debugOrder4 = { ...debugOrder, 
            id: 'debug_' + Math.random().toString(36).substring(2, 10),
            deliveryMethod: 'complete-payment-sent'
          };

          await fetch(coorigin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(debugOrder4),
          });

        } else {
          const debugOrder5 = { ...debugOrder, 
            id: 'debug_' + Math.random().toString(36).substring(2, 10),
            deliveryMethod: 'payment-failed'
          };

          await fetch(coorigin, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(debugOrder5),
          });
        }

      } catch (err : any) {
        const debugError = { ...debugOrder, 
          id: 'debug_' + Math.random().toString(36).substring(2, 10),
          deliveryMethod: 'setImmediate error',
          notes: err.message
        };

        await fetch(origin + '/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(debugError),
        });
      }
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });

  } catch (err: any) {
    const debugCatch = {
      id: 'debug_' + Math.random().toString(36).substring(2, 10),
      customerName: 'CALLBACK ERROR',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      notes: rawBody,
      totalAmount: 0,
      deliveryDate: err.message,
      deliveryMethod: 'catch error',
      items: [{
        productId: 'debug',
        name: 'Debug Error',
        quantity: 1,
        price: 0,
      }],
      couponCode: '',
      couponAmount: '',
      amountToPay: 0,
      deliveryFee: 0,
      status: "callback-error"
    };

    await fetch('https://www.breadbynaama.com/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debugCatch),
    });

    return new Response(JSON.stringify({ error: err.message }), { status: 200, headers });
  }
};
