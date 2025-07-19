// src/pages/api/complete-payment.ts

import type { APIRoute } from 'astro';
import { generateNextReceiptId } from '../../lib/receiptSerial';
import { getOrderById } from '../../lib/googleSheets';
import { updateOrderInSheet } from '../../lib/orders'; // נניח שיש לך את זה
import { sendOrderEmail } from '../../lib/email';
import { renderReceiptFromOrder } from '../../lib/renderReceipt';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { orderId } = await request.json();

    // 1️⃣ מחולל מספר קבלה
    const receiptSerial = await generateNextReceiptId();

    // 2️⃣ מעדכן את ההזמנה בגוגל שיטס: קבלה + סטטוס
    await updateOrderInSheet(orderId, {
      receiptSerial,
      status: 'submitted'
    });

    // 3️⃣ טוען את כל נתוני ההזמנה (כדי להכין קבלה ולשלוח מייל)
    const fullOrderData = await getOrderById(orderId);

    if (!fullOrderData) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // 4️⃣ מייצר HTML של קבלה
    const receiptHtml = await renderReceiptFromOrder({
      order: fullOrderData,
      serial: receiptSerial
    });

    // 5️⃣ שולח מייל עם קבלה
    await sendOrderEmail({
      to: fullOrderData.customerEmail,
      customerName: fullOrderData.customerName,
      orderSummary: fullOrderData,
      receiptHtml,
      receiptSerial
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: any) {
    console.error('[COMPLETE PAYMENT ERROR]', {
      message: err.message,
      stack: err.stack,
      errorObject: err
    });
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
