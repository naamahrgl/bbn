// src/pages/api/complete-payment.ts

import type { APIRoute } from 'astro';
import { generateNextReceiptId } from '../../lib/receiptSerial';
import { getOrderById, updateOrderInSheet } from '../../lib/googleSheets';
import { sendOrderEmail } from '../../lib/email';
import { renderReceiptFromOrder } from '../../lib/renderReceipt';
import type { OrderData } from '../../lib/orders';

export const POST: APIRoute = async ({ request }) => {


  try {
    const { orderId } = await request.json();
    if (!orderId) throw new Error('Missing orderId');

    console.log('[COMPLETE PAYMENT] Triggered for orderId:', orderId);


    const fullOrderData: OrderData = await getOrderById(orderId);
    if (!fullOrderData) throw new Error(`Order with ID ${orderId} not found`);



    if (fullOrderData.status !== 'checkout') {


      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    // 1. מחולל מספר קבלה
    const receiptSerial = await generateNextReceiptId();

    // 2. מעדכן שורה בגוגל שיטס
    await updateOrderInSheet(orderId, {
      receiptSerial,
      status: 'submitted'
    });



    // 3. מייצר HTML קבלה
    let receiptHtml = '';
    try {
      receiptHtml = await renderReceiptFromOrder({
        order: fullOrderData,
        serial: receiptSerial
      });
    } catch (err: any) {

      throw new Error('Failed to render receipt: ' + err.message);
    }

    // 4. שולח מייל
    try {
      await sendOrderEmail({
        to: fullOrderData.customerEmail,
        customerName: fullOrderData.customerName,
        orderSummary: fullOrderData,
        receiptHtml,
        receiptSerial
      });


    } catch (err: any) {

      throw new Error('Failed to send email: ' + err.message);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('[COMPLETE PAYMENT ERROR]', err);



    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
