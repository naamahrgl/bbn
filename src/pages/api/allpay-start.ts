import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const api_login = 'pp1010885';
const api_key = import.meta.env.ALLPAY_API_KEY;
  const api_url = 'https://allpay.to/app/?show=getpayment&mode=api8';

  console.log('ALLPAY_API_KEY:', api_key);


  const MIN_PRICE = 0.01; // אסור 0
const origin = process.env.NODE_ENV === 'production'
  ? 'https://www.breadbynaama.com'
  : body.origin;
  console.log('Origin URL:', origin);
  console.log(`[ALLPAY START] Created order ${body.id} | Env: ${process.env.NODE_ENV}`);



  const productItems = body.items;

  const productsTotal = productItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const deliveryFee = body.deliveryFee;
  const couponAmount = body.couponAmount;

  let remainingDiscount = couponAmount;

  // מוצרים
  const discountedProducts = productItems.map((item: any) => {
    const totalItemPrice = item.price * item.quantity;

    // החלק של המוצר בהנחה
    const discountOnItem = Math.min(totalItemPrice - (MIN_PRICE * item.quantity), remainingDiscount);
    const discountedTotal = totalItemPrice - discountOnItem;

    const pricePerItem = discountedTotal / item.quantity;
    const roundedPrice = Math.max(Math.round(pricePerItem * 100) / 100, MIN_PRICE); // לא פחות מ־0.01

    remainingDiscount -= discountOnItem;

    return {
      name: discountOnItem > 0 
      ? (body.lang == 'he' ? `${item.name} (אחרי הנחה)` : `${item.name} (After Discount)`)
      : item.name,
      price: roundedPrice,
      qty: item.quantity,
      vat: 1
    };
  });

  // משלוח
  const maxDeliveryDiscount = Math.max(deliveryFee - MIN_PRICE, 0);
  const deliveryDiscount = Math.min(remainingDiscount, maxDeliveryDiscount);
  const finalDeliveryFee = deliveryFee - deliveryDiscount;

  const deliveryItem = deliveryFee > 0 ? [{
    name: deliveryDiscount > 0
      ? (body.lang === 'he' ? 'משלוח (אחרי הנחה)' : 'Delivery (After Discount)')
      : (body.lang === 'he' ? 'משלוח' : 'Delivery'),
    price: Math.max(Math.round(finalDeliveryFee * 100) / 100, MIN_PRICE),
    qty: 1,
    vat: 1
  }] : [];

  const items = [...discountedProducts, ...deliveryItem];

  const itemsTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
  const roundedItemsTotal = Math.round(itemsTotal * 100) / 100;

  const payload: Record<string, any> = {
    login: api_login,
    //key: api_key,
    order_id: body.id,
    amount: roundedItemsTotal,
    currency: 'ILS',
    lang: body.lang,
    notifications_url: `${origin}/api/payment-callback`,
    success_url: `${origin}/${body.lang}/orderconfirmation?id=${body.id}`,
    client_name: body.customerName,
    client_email: body.customerEmail,
    client_phone: body.customerPhone,
    items,
    expire: Math.floor(Date.now() / 1000) + 3600,
    add_field_1: origin
  };
  console.log(`Callback URL: ${payload.notifications_url}`);
console.log('items:', JSON.stringify(items, null, 2));

  console.log(`Success URL: ${payload.success_url}`);
console.log(`Total: ${roundedItemsTotal}`);

  console.log('[ALLPAY START] Sending to Allpay:', JSON.stringify(payload, null, 2));



  const sign = createAllpaySignature(payload, api_key);
  payload.sign = sign;

  const res = await fetch(api_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
console.log('[ALLPAY RESPONSE]', res.status, data);
if (!data.payment_url) {
  console.error('[ALLPAY ERROR]', data);
  throw new Error(data.error_msg || 'Unknown error from Allpay');
}

  return new Response(JSON.stringify({
    paymentUrl: data.payment_url,
    orderId: body.id
  }), { status: 200 });
};

function createAllpaySignature(params: Record<string, any>, apiKey: string): string {
  const keys = Object.keys(params).sort();
  const chunks: string[] = [];

  keys.forEach(key => {
    const value = params[key];

    if (Array.isArray(value)) {
      // ⚡️ שדה items - סדר קבוע: name > price > qty > vat
      value.forEach(item => {
        ['name', 'price', 'qty', 'vat'].forEach(subKey => {
          const val = item[subKey];
          if (val !== undefined && val !== null && String(val).trim() !== '') {
            chunks.push(String(val).trim());
          }
        });
      });
    } else {
      if (value !== undefined && value !== null && String(value).trim() !== '' && key !== 'sign') {
        chunks.push(String(value).trim());
      }
    }
  });

  const baseString = chunks.join(':') + ':' + apiKey;

  return crypto.createHash('sha256').update(baseString).digest('hex');
}

