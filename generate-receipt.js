// generate-receipt.js
import fs from 'fs/promises';
import { renderReceiptFromOrder } from './src/lib/renderReceipt.ts'; // Adjust path if needed

const MANUAL_SERIAL = 1152; // <--- CHANGE THIS TO YOUR DESIRED ID

const sampleOrder = {
  customerName: "Riskified",
  customerPhone: "",
  customerEmail: "",
  customerAddress: "",
  deliveryDate: "2026-06-17",
  deliveryFee: 35,
  couponAmount: 20,
  paymentMethod: "bank_transfer",
  items: [
    { name: "לחם קלאסי", quantity: 2, price: 35 },
       // { name: "קרקר", quantity: 4, price: 30 },
         //       { name: "בראוני", quantity: 1, price: 20 },
        //{ name: "אלפחורס", quantity: 1, price: 30 },


 //  { name: "בראוני אישי", quantity: 2, price: 20 }
  ],
  amountToPay: 85 // (2000*1)
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