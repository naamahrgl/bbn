import {type  OrderData } from "./orders";
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
  return found;
}

