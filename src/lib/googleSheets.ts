import {type  OrderData, type OrderItem } from "./orders";
import { PRODUCTS } from './products';
const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';

export async function getExistingOrdersMap(): Promise<Record<string, Record<string, number>>> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getInventoryAndLimits`);
  const data = await response.json();
  return data.ordersMap || {};
}

export async function getPerDateLimits(): Promise<Record<string, Record<string, number>>> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getInventoryAndLimits`);
  const data = await response.json();
  return data.perDateLimits || {};
}

export async function getAllOrders(): Promise<OrderData[]> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getAllOrders`);
  const data = await response.json();

  return data.map((order: any) => ({
    ...order,
    deliveryDate: new Date(order.deliveryDate), // Convert to Date
  }));
}

export async function getOrderById(id: string): Promise<OrderData> {
  const orders = await getAllOrders();
  const found = orders.find(order => order.id === id);

  if (!found) {
    throw new Error('Order not found');
  }

  // 🛠️ טיפול בפריסה של items
  if (typeof found.items === 'string') {
    const rawItems: string[] = (found.items as string).split(',');
const parsedItems: OrderItem[] = rawItems.map((itemStr: string) => {
  const [name, quantityStr] = itemStr.split(':');
  const cleanName = name.trim();
  const quantity = parseInt(quantityStr.trim(), 10);

  const matchedProduct = PRODUCTS.find(prod =>
    prod.name.he === cleanName || prod.name.en === cleanName
  );

  if (!matchedProduct) {
    console.warn(`[getOrderById] Unknown product: "${cleanName}"`);
    throw new Error(`Product "${cleanName}" not found in PRODUCTS`);
  }

  return {
    productId: matchedProduct.id, // מובטח חוקי כי matchedProduct נמצא
    name: cleanName,
    quantity,
    price: matchedProduct.price
  };
});

    (found as any).items = parsedItems;
  }

  return found as OrderData;
}



export async function updateOrderInSheet(orderId: string, updates: Record<string, any>): Promise<void> {
  const response = await fetch(APPS_SCRIPT_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'updateOrder',
      orderId,
      updates
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to update order in Google Sheets');
  }
}

