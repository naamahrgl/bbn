// src/pages/api/complete-payment.ts

import type { APIRoute } from 'astro';
import { generateNextReceiptId } from '../../lib/receiptSerial';
import { getOrderById, updateOrderInSheet } from '../../lib/googleSheets';
import { sendOrderEmail } from '../../lib/email';
import { renderReceiptFromOrder } from '../../lib/renderReceipt';
import type { OrderData } from '../../lib/orders';

export const POST: APIRoute = async ({ request }) => {
    await fetch('https://www.breadbynaama.com/api/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'debug_' + Math.random().toString(36).substring(2, 10),
    customerName: 'arrived into completepayment',
    notes: '',
    items: [],
    totalAmount: 0,
    deliveryDate: '',
    deliveryMethod: 'complete-payment',
    status: 'complete-payment'
  })
});

  try {
    const { orderId } = await request.json();

    if (!orderId) throw new Error('Missing orderId');
console.log('[COMPLETE PAYMENT] triggered for orderId:', orderId);
 console.log(`Triggering complete-payment for ${orderId} /complete-payment`);

// 3. שולף את ההזמנה המלאה (כולל קבלה)
    const fullOrderData: OrderData = await getOrderById(orderId);

    if (!fullOrderData) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
            const coorigin = 'https://www.breadbynaama.com/api/create-order';
const orderData: any = {
  id: 'debug_' + Math.random().toString(36).substring(2, 10),
  customerName: 'DEBUG LOG4',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  notes: orderId, // כאן תוכן הלוג
  totalAmount: 0,
  deliveryDate: fullOrderData,
  deliveryMethod: '',
  items: [ {
          productId: 'classic',
          name: 'Classic Bread',
          quantity: 1,
          price: 35,
        }],
  couponCode: '',
  couponAmount: '',
  amountToPay: 0,
  deliveryFee: 0,
  status: "log" // או "checkout" אם חייב
};
await fetch(coorigin, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData),
});
    
console.log('[COMPLETE PAYMENT] fullOrderData:', JSON.stringify(fullOrderData, null, 2));

if (fullOrderData.status == 'checkout') {
    // 1. מחולל מספר קבלה
    const receiptSerial = await generateNextReceiptId();

    // 2. מעדכן את השורה בגוגל שיטס
    await updateOrderInSheet(orderId, {
      receiptSerial,
      status: 'submitted'
    });

const orderData: any = {
  id: 'debug_' + Math.random().toString(36).substring(2, 10),
  customerName: 'DEBUG LOG5',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  notes: orderId, // כאן תוכן הלוג
  totalAmount: 0,
  deliveryDate: fullOrderData,
  deliveryMethod: receiptSerial,
  items: [ {
          productId: 'classic',
          name: 'Classic Bread',
          quantity: 1,
          price: 35,
        }],
  couponCode: '',
  couponAmount: '',
  amountToPay: 0,
  deliveryFee: 0,
  status: "log" // או "checkout" אם חייב
};
await fetch(coorigin, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData),
});

    // 4. מייצר HTML קבלה
    const receiptHtml = await renderReceiptFromOrder({
      order: fullOrderData,
      serial: receiptSerial
    });

    // 5. שולח מייל
    await sendOrderEmail({
      to: fullOrderData.customerEmail,
      customerName: fullOrderData.customerName,
      orderSummary: fullOrderData,
      receiptHtml,
      receiptSerial
    });
} else {
    await fetch('https://www.breadbynaama.com/api/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'debug_' + Math.random().toString(36).substring(2, 10),
    customerName: 'COMPLETE PAYMENT alreadyprocesed',
    notes: '',
    items: [],
    totalAmount: 0,
    deliveryDate: '',
    deliveryMethod: 'already-processed',
    status: 'already-processed'
  })
});

  console.log(`[COMPLETE PAYMENT] Order ${orderId} already processed with status ${fullOrderData.status}. Skipping.`);
  return new Response(JSON.stringify({ skipped: true }), { status: 200 });


}

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    await fetch('https://www.breadbynaama.com/api/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'debug_' + Math.random().toString(36).substring(2, 10),
    customerName: 'COMPLETE PAYMENT ERROR',
    notes: err.message,
    items: [],
    totalAmount: 0,
    deliveryDate: '',
    deliveryMethod: 'complete-payment-error',
    status: 'callback-error'
  })
});

    console.error('[COMPLETE PAYMENT ERROR]', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
