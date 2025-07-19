
import fs from 'fs/promises';
import path from 'path';
import type { OrderData } from './orders';

export async function renderReceiptFromOrder({ order, serial }: { order: OrderData, serial: number }) {
    
  const templatePath = path.resolve('src/templates/receiptTemplate.html');
  const template = await fs.readFile(templatePath, 'utf-8');

  const date = new Date().toLocaleDateString('he-IL');

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px;">${item.name}</td>
      <td style="padding: 8px;">${item.quantity}</td>
      <td style="padding: 8px;">₪${item.price}</td>
      <td style="padding: 8px;">₪${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const paymentsHtml = `
    <tr>
      <td style="padding: 8px;">Allpay</td>
      <td style="padding: 8px;">${order.deliveryMethod}</td>
      <td style="padding: 8px;">${date}</td>
      <td style="padding: 8px;">₪${order.amountToPay}</td>
    </tr>
  `;

  const totalItems = order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalPayments = order.amountToPay;

  return template
    .replace(/{{customer.name}}/g, order.customerName)
    .replace(/{{customer.phone}}/g, order.customerPhone || '')
    .replace(/{{customer.email}}/g, order.customerEmail)
    .replace(/{{customer.address}}/g, order.customerAddress || '')
    .replace(/{{serial}}/g, serial.toString())
    .replace(/{{date}}/g, date)
    .replace(/{{items}}/g, itemsHtml)
    .replace(/{{payments}}/g, paymentsHtml)
    .replace(/{{totalItems}}/g, totalItems.toString())
    .replace(/{{totalPayments}}/g, totalPayments.toString());
}






