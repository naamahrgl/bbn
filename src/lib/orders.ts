import { v4 as uuid } from 'uuid';
import type { ProductId } from './products';


export type OrderItem = {
  productId: ProductId;
  name: string;
  quantity: number;
  price: number;
};

export type OrderData = {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  totalAmount: number;
  items: OrderItem[];
};

export function createOrder(data: OrderData): OrderData {
  const id = Math.random().toString(36).substring(2, 10);
  const order = { ...data, id };
  const existing = JSON.parse(localStorage.getItem("orders") || "[]");
  localStorage.setItem("orders", JSON.stringify([...existing, order]));
  localStorage.setItem("lastOrder", JSON.stringify(order));
  return order;
}


export function getAllOrders(): OrderData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): Promise<OrderData> {
  const orders = getAllOrders();
  const found = orders.find(order => order.id === id);
  if (!found) {
    return Promise.reject(new Error('Order not found'));
  }
  return Promise.resolve(found);
}



export const DAILY_LIMITS: Record<ProductId, number> = {
  buckwheat: 10,
  sourdough: 15,
  cinnamon: 12,
  cracker: 1000,
  brownie: 6
};

export const EXISTING_ORDERS: Record<string, Record<string, number>> = {
  '2025-06-27': { buckwheat: 9 },
  '2025-06-28': { buckwheat: 10, sourdough: 5 },
  '2025-06-29': { sourdough: 15 },
};

