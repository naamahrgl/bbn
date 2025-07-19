
import type { APIRoute } from 'astro';
import { generateNextReceiptId } from '../../lib/receiptSerial';
import type { OrderData } from '../../lib/orders';
import { sendOrderEmail } from '../../lib/email';
import { renderReceiptFromOrder } from '../../lib/renderReceipt';



const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const order: OrderData = await request.json();

    // 1️⃣ Generate serial receipt id
    const receiptSerial = await generateNextReceiptId();

    // 2️⃣ Save order to DB (Google Sheets)
    order.receiptSerial = receiptSerial;
    //order.id = receiptSerial.toString(); 

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed saving order');
    }

    // 3️⃣ Generate receipt HTML
 const baseUrl = new URL(request.url).origin;


const receiptHtml = await renderReceiptFromOrder({
  order: order, // יש לך את ההזמנה כבר
  serial: receiptSerial,
});


    // 4️⃣ Send email
    await sendOrderEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderSummary: order,
      receiptHtml,
      receiptSerial
    });

    return new Response(JSON.stringify({ success: true, receiptId: receiptSerial }), { status: 200 });

  } catch (err: any) {
console.error('[FINALIZE ORDER ERROR]', {
  message: err.message,
  stack: err.stack,
  errorObject: err
});
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
