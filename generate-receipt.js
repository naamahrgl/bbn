// generate-receipt.js
import fs from 'fs/promises';
import { renderReceiptFromOrder } from './src/lib/renderReceipt.ts'; // Adjust path if needed

const MANUAL_SERIAL = 1139; // <--- CHANGE THIS TO YOUR DESIRED ID

const sampleOrder = {
  customerName: "irregular",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",
  deliveryDate: "2026-05-31",
  deliveryFee: 245,
  couponAmount: 140,
  paymentMethod: "cash",
  items: [
    { name: "לחם קלאסי", quantity: 7, price: 35 },
        { name: "קרקר", quantity: 4, price: 30 },
                { name: "בראוני", quantity: 1, price: 20 },
        { name: "אלפחורס", quantity: 1, price: 30 },


 //  { name: "בראוני אישי", quantity: 2, price: 20 }
  ],
  amountToPay: 520 // (35*3 - 15)
};

async function run() {
  try {
    console.log(`Generating receipt #${MANUAL_SERIAL}...`);
    const html = await renderReceiptFromOrder({ 
      order: sampleOrder, 
      serial: MANUAL_SERIAL 
    });

    await fs.writeFile('manual_receipt.html', html);
    console.log('✅ Success! File saved as: manual_receipt.html');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

run();