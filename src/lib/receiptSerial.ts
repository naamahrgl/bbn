import { getAllOrders } from './googleSheets'; // פונקציה קיימת אצלך?

export async function generateNextReceiptId(): Promise<number> {
  const orders = await getAllOrders();

  const serials = orders
    .map(order => order.receiptSerial)
  .filter((s): s is number => typeof s === 'number' && !isNaN(s));

  const maxSerial = serials.length > 0 ? Math.max(...serials) : 1000; // מתחילים מ־1001 אם אין

  return maxSerial + 1;
}
