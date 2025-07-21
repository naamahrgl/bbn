// src/pages/api/complete-payment.ts

import type { APIRoute } from 'astro';
import { generateNextReceiptId } from '../../lib/receiptSerial';
import { getOrderById, updateOrderInSheet } from '../../lib/googleSheets';
import { sendOrderEmail } from '../../lib/email';
import { renderReceiptFromOrder } from '../../lib/renderReceipt';
import { logToSheet } from '../../lib/debugLog';
import type { OrderData } from '../../lib/orders';

export const POST: APIRoute = async ({ request }) => {

  const coorigin = 'https://www.breadbynaama.com/api/create-order';

  try {
    const { orderId } = await request.json();
    if (!orderId) throw new Error('Missing orderId');

    console.log('[COMPLETE PAYMENT] Triggered for orderId:', orderId);
    await logToSheet({
      step: 'complete-payment-start',
      orderId,
      notes: 'Started complete-payment for this order'
    });

    const fullOrderData: OrderData = await getOrderById(orderId);
    if (!fullOrderData) throw new Error(`Order with ID ${orderId} not found`);

    await logToSheet({
      step: 'complete-payment-loaded-order',
      orderId,
      notes: JSON.stringify(fullOrderData, null, 2)
    });

    if (fullOrderData.status !== 'checkout') {
      await logToSheet({
        step: 'complete-payment-already-processed',
        orderId,
        notes: `Order already processed with status ${fullOrderData.status}`
      });

      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    // 1. מחולל מספר קבלה
    const receiptSerial = await generateNextReceiptId();

    // 2. מעדכן שורה בגוגל שיטס
    await updateOrderInSheet(orderId, {
      receiptSerial,
      status: 'submitted'
    });

    await logToSheet({
      step: 'complete-payment-updated-sheet',
      orderId,
      notes: `Updated sheet with receiptSerial ${receiptSerial}`
    });

    // 3. מייצר HTML קבלה
    let receiptHtml = '';
    try {
      receiptHtml = await renderReceiptFromOrder({
        order: fullOrderData,
        serial: receiptSerial
      });
    } catch (err: any) {
      await logToSheet({
        step: 'complete-payment-receipt-error',
        orderId,
        notes: 'Receipt render error: ' + err.message
      });
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

      await logToSheet({
        step: 'complete-payment-email-sent',
        orderId,
        notes: `Email sent to ${fullOrderData.customerEmail}`
      });
    } catch (err: any) {
      await logToSheet({
        step: 'complete-payment-email-error',
        orderId,
        notes: 'Email send error: ' + err.message
      });
      throw new Error('Failed to send email: ' + err.message);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('[COMPLETE PAYMENT ERROR]', err);

    await logToSheet({
      step: 'complete-payment-catch',
      notes: err.message
    });

    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
