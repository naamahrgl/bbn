import fs from 'fs/promises';
import path from 'path';
import type { OrderData } from './orders';

export async function renderReceiptFromOrder({ order, serial }: { order: OrderData, serial: number }) {
  // טוען תבנית HTML
  const templatePath = path.resolve('src/templates/receiptTemplate.html');
  const template = await fs.readFile(templatePath, 'utf-8');

  // תאריך נוכחי
  const date = new Date().toLocaleDateString('he-IL');

  // תאריך משלוח עם תיקון ל-Zone
  const deliveryDate = new Date(order.deliveryDate);
  if (isNaN(deliveryDate.getTime())) {
    throw new Error('Invalid delivery date in order');
  }
  deliveryDate.setHours(deliveryDate.getHours() + 3);
  const deliveryDateFormatted = deliveryDate.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // פריטי הזמנה
  const items = order.items || [];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order has no items');
  }

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px;">${item.name}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">₪${item.price}</td>
      <td style="padding: 8px;">₪${item.price * item.quantity}</td>
    </tr>
  `).join('');

  // שורת משלוח
  const deliveryFee = Number(order.deliveryFee);
  const deliveryTitle = deliveryFee > 0 ? 'משלוח | delivery' : 'איסוף | pickup';

  const deliveryHtml = `
    <tr>
      <td style="padding: 8px;">${deliveryTitle} | ${deliveryDateFormatted}</td>
      <td style="padding: 8px;">1</td>
      <td style="padding: 8px;">₪${deliveryFee}</td>
      <td style="padding: 8px;">₪${deliveryFee}</td>
    </tr>
  `;

  const allItemsHtml = itemsHtml + deliveryHtml;

  // סכומים ותשלומים
  const couponAmount = Number(order.couponAmount) || 0;
  const totalItems = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const finalTotal = totalItems + deliveryFee;
  const expectedAmountToPay = totalItems + deliveryFee - couponAmount;
  const amountToPay = order.amountToPay ?? expectedAmountToPay;

  // תשלומים
  const paymentsRows: string[] = [];

  if (couponAmount > 0) {
    paymentsRows.push(`
      <tr>
        <td style="padding: 8px;">Coupon</td>
        <td style="padding: 8px;">${order.couponCode}</td>
        <td style="padding: 8px;">${date}</td>
        <td style="padding: 8px;">₪${couponAmount}-</td>
      </tr>
    `);
  }

  if (amountToPay > 0) {
    paymentsRows.push(`
      <tr>
        <td style="padding: 8px;">Allpay</td>
        <td style="padding: 8px;">${order.paymentMethod}</td>
        <td style="padding: 8px;">${date}</td>
        <td style="padding: 8px;">₪${amountToPay}</td>
      </tr>
    `);
  }

  const paymentsHtml = paymentsRows.join('');

  // יצירת הקבלה
  return template
    .replace(/{{customer.name}}/g, order.customerName)
    .replace(/{{customer.phone}}/g, order.customerPhone)
    .replace(/{{customer.email}}/g, order.customerEmail)
    .replace(/{{customer.address}}/g, order.customerAddress || '')
    .replace(/{{serial}}/g, serial.toString())
    .replace(/{{date}}/g, date)
    .replace(/{{items}}/g, allItemsHtml)
    .replace(/{{payments}}/g, paymentsHtml)
    .replace(/{{totalItems}}/g, finalTotal.toString())
    .replace(/{{totalPayments}}/g, amountToPay.toString());
}
