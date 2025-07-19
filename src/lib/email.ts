import Brevo from '@getbrevo/brevo';
import { type OrderData } from './orders';

const apiKey = import.meta.env.BREVO_API_KEY!;
const senderEmail = import.meta.env.BREVO_SENDER!;


const brevoClient = new Brevo.TransactionalEmailsApi();

brevoClient.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

type EmailParams = {
  to: string;
  customerName: string;
  orderSummary: OrderData;
  receiptHtml: string;
  receiptSerial: number;
};

export async function sendOrderEmail({ to, customerName, orderSummary, receiptHtml, receiptSerial }: EmailParams) {
  const subject = `קבלה מספר ${receiptSerial} - לחם נעמה`;

  const orderItems = orderSummary.items.map(item => `- ${item.name} x ${item.quantity} - ₪${item.price * item.quantity}`).join('\n');

  const textBody = `
היי ${customerName},

תודה על ההזמנה!

📦 סיכום הזמנה:

${orderItems}

🗓️ משלוח: ${orderSummary.deliveryMethod === 'pickup' 
  ? `איסוף עצמי - ${orderSummary.deliveryDate} - ₪0`
  : `${orderSummary.customerAddress}, ${orderSummary.deliveryDate} - ₪${orderSummary.deliveryFee}`}

${orderSummary.couponAmount ? `🎟️ קופון: -₪${orderSummary.couponAmount}` : ''}

💳 סה״כ לתשלום: ₪${orderSummary.amountToPay}

---

Bread by Naama

`;

const combinedHtml = `
<div style="direction: rtl; font-family: Arial, sans-serif; text-align: center;">

<p><strong>${orderSummary.customerName}</strong></p>
<p>היי! תודה על ההזמנה.</p>

<table style="margin: 0 auto; text-align: right;">
<thead>
<tr><th>פריט</th><th>כמות</th><th>סכום</th></tr>
</thead>
<tbody>
${orderSummary.items.map(item => `
<tr>
<td>${item.name}</td>
<td>${item.quantity}</td>
<td>₪${item.price * item.quantity}</td>
</tr>`).join('')}
</tbody>
<tfoot>
${orderSummary.couponAmount ? `
<tr>
<td colspan="2">הנחת קופון</td>
<td>-₪${orderSummary.couponAmount}</td>
</tr>` : ''}

<tr>
<td colspan="2">משלוח</td>
<td>₪${orderSummary.deliveryMethod === 'pickup' ? 0 : orderSummary.deliveryFee}</td>
</tr>

<tr>
<td colspan="2"><strong>סה״כ לתשלום</strong></td>
<td><strong>₪${orderSummary.amountToPay}</strong></td>
</tr>
</tfoot>
</table>

<p style="margin-top:20px;">לחם נעמה</p>
</div>

${receiptHtml}
`;

  await brevoClient.sendTransacEmail({
    sender: { email: senderEmail, name: 'לחם נעמה' },
    to: [{ email: to, name: customerName }],
      bcc: [{ email: 'naama.hargil@gmail.com', name: 'Naama Archive' }], // <-- 👈 add yourself here
    subject,
    textContent: textBody,
    htmlContent: combinedHtml
  });
}
