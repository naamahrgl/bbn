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
console.log('[COMPLETE PAYMENT] triggered for orderId:', orderId);

    // 1. מחולל מספר קבלה
    const receiptSerial = await generateNextReceiptId();

    // 2. מעדכן את השורה בגוגל שיטס
    await updateOrderInSheet(orderId, {
      receiptSerial,
      status: 'submitted'
    });

    // 3. שולף את ההזמנה המלאה (כולל קבלה)
    const fullOrderData: OrderData = await getOrderById(orderId);

    if (!fullOrderData) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
console.log('[COMPLETE PAYMENT] fullOrderData:', JSON.stringify(fullOrderData, null, 2));

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
