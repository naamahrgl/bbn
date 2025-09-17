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
  const totalItems = orderSummary.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const finalTotal = totalItems + orderSummary.deliveryFee
const expectedAmountToPay = totalItems + orderSummary.deliveryFee - orderSummary.couponAmount;
  const amountToPay = orderSummary.amountToPay ?? expectedAmountToPay;
  const textBody = `
היי ${customerName},

תודה על ההזמנה!

<p style="margin-top:10px; font-weight: bold;">
${orderSummary.deliveryMethod === 'pickup' 
  ? `המזנתך תהיה מוכנה לאיסוף מרחוב החשמל 8, תל אביב ביום ${orderSummary.deliveryDate}. נשלח הודעה כאשר הזמנתך זמינה לאיסוף!`
  : `הזמנתך תגיע עד אליך במשלוח ביום ${orderSummary.deliveryDate}. נשלח הודעה כאשר הזמנתך בדרך אליך!`}
</p>


📦 סיכום הזמנה:

${orderItems}

🗓️ משלוח: ${orderSummary.deliveryMethod === 'pickup' 
  ? `איסוף עצמי - ${orderSummary.deliveryDate} - ₪0`
  : `${orderSummary.customerAddress}, ${orderSummary.deliveryDate} - ₪${orderSummary.deliveryFee}`}

${orderSummary.couponAmount ? `🎟️ קופון: -₪${orderSummary.couponAmount}` : ''}

💳 סה״כ לתשלום: ₪${amountToPay}

---

Bread by Naama

`;

const date = new Date(orderSummary.deliveryDate);

const formatted = new Intl.DateTimeFormat('he-IL', { 
  day: 'numeric', 
  month: 'numeric', 
  year: 'numeric',
  timeZone: 'Asia/Jerusalem'
}).format(date);


const combinedHtml = `
<div style="direction: rtl; font-family: Arial, sans-serif; text-align: center;">

<p><strong>${orderSummary.customerName}</strong></p>
<p>היי! תודה על ההזמנה.</p>

<p style="margin-top:10px; font-weight: bold;">
${orderSummary.deliveryMethod === 'pickup' 
  ? `הזמנתך תהיה מוכנה לאיסוף מרחוב החשמל 8, תל אביב ביום ${formatted}. 
  תקבלו הודעה כאשר הזמנתך זמינה לאיסוף!`
  : `הזמנתך תגיע עד אליך במשלוח ביום ${formatted}. 
  תקבלו הודעה כאשר הזמנתך בדרך אליך!`}
</p>


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

<tr>
<td colspan="2">משלוח</td>
<td>₪${orderSummary.deliveryMethod === 'pickup' ? 0 : orderSummary.deliveryFee}</td>
</tr>

${orderSummary.couponAmount ? `
<tr>
<td colspan="2">הנחת קופון</td>
<td>-₪${orderSummary.couponAmount}</td>
</tr>` : ''}

<tr>
<td colspan="2"><strong>סה״כ לתשלום</strong></td>
<td><strong>₪${amountToPay}</strong></td>
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
