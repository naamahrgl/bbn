
import fs from 'fs/promises';
import path from 'path';
import type { OrderData } from './orders';

import { readFileSync } from 'fs';




export async function renderReceiptFromOrder({ order, serial }: { order: OrderData, serial: number }) {
    
  const templatePath = path.resolve('src/templates/receiptTemplate.html');
  const template = await fs.readFile(templatePath, 'utf-8');
const paymentsRows: string[] = [];

  const date = new Date().toLocaleDateString('he-IL');
const deliveryDate = new Date(order.deliveryDate);
deliveryDate.setHours(deliveryDate.getHours() + 3);

const deliveryDateFormatted = deliveryDate.toLocaleDateString('he-IL', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px;">${item.name}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">₪${item.price}</td>
      <td style="padding: 8px;">₪${item.price * item.quantity}</td>
    </tr>
  `).join('');

    const deliveryHtml = `
    <tr>
      <td style="padding: 8px;">${order.deliveryMethod} | ${deliveryDateFormatted} </td>
      <td style="padding: 8px;">1</td>
      <td style="padding: 8px;">₪${order.deliveryFee}</td>
      <td style="padding: 8px;">₪${order.deliveryFee}</td>
    </tr>
  `;
  const newitemsHtml = itemsHtml + deliveryHtml

if (order.couponAmount > 0) {
  paymentsRows.push(`
    <tr>
      <td style="padding: 8px;">Coupon</td>
      <td style="padding: 8px;">${order.couponCode}</td>
      <td style="padding: 8px;">${date}</td>
      <td style="padding: 8px;">₪${order.couponAmount}-</td>
    </tr>
  `);
}

// תשלום רגיל
if (order.amountToPay > 0) {
  paymentsRows.push(`
    <tr>
      <td style="padding: 8px;">Allpay</td>
      <td style="padding: 8px;">${order.paymentMethod || ''}</td>
      <td style="padding: 8px;">${date}</td>
      <td style="padding: 8px;">₪${order.amountToPay}</td>
    </tr>
  `);
}

const paymentsHtml = paymentsRows.join('');

  const totalItems = order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const finalTotal = totalItems + order.deliveryFee
  const totalPayments = order.amountToPay;

  return template
    .replace(/{{customer.name}}/g, order.customerName)
    .replace(/{{customer.phone}}/g, order.customerPhone || '')
    .replace(/{{customer.email}}/g, order.customerEmail)
    .replace(/{{customer.address}}/g, order.customerAddress || '')
    .replace(/{{serial}}/g, serial.toString())
    .replace(/{{date}}/g, date)
    .replace(/{{items}}/g, newitemsHtml )
    .replace(/{{payments}}/g, paymentsHtml)
    .replace(/{{totalItems}}/g, finalTotal.toString())
    .replace(/{{totalPayments}}/g, totalPayments.toString());
}






