// src/pages/api/complete-payment.ts

import type { APIRoute } from 'astro';
import { generateNextReceiptId } from '../../lib/receiptSerial';
import { getOrderById, updateOrderInSheet } from '../../lib/googleSheets';
import { sendOrderEmail } from '../../lib/email';
import { renderReceiptFromOrder } from '../../lib/renderReceipt';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { orderId } = await request.json();

    if (!orderId) throw new Error('Missing orderId');

    // 1. מחולל מספר קבלה
    const receiptSerial = await generateNextReceiptId();

    // 2. מעדכן את השורה בגוגל שיטס
    await updateOrderInSheet(orderId, {
      receiptSerial,
      status: 'submitted'
    });

    // 3. שולף את ההזמנה המלאה (כולל קבלה)
    const fullOrderData = await getOrderById(orderId);

    if (!fullOrderData) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

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

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('[COMPLETE PAYMENT ERROR]', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
