import { v4 as uuid } from 'uuid';
import type { ProductId } from './products';
import { format } from 'date-fns';
import { appendOrderRow } from './googlesheets';



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
  customerAddress?: string;
  notes?: string;
  totalAmount: number;
  items: OrderItem[];
  deliveryDate: Date; // ✅ תאריך בצורת yyyy-MM-dd
  deliveryMethod: 'pickup' | 'delivery'; // ✅ כדי להציג גם בשיט
  paymentMethod?: 'cash' | 'credit'; // ✅ לשלב מאוחר יותר
};


export const DAILY_LIMITS: Record<ProductId, number> = {
  buckwheat: 10,
  sourdough: 15,
  cinnamon: 12,
  cracker: 1000,
  brownie: 6
};


// orders.ts

export function getExistingOrdersMap(): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};

  const orders = getAllOrders();
  for (const order of orders) {
    if (!order.deliveryDate) continue;

    const deliveryDate =
      order.deliveryDate instanceof Date
        ? order.deliveryDate
        : new Date(order.deliveryDate);

    const dateKey = deliveryDate.toISOString().split('T')[0];

    if (!result[dateKey]) result[dateKey] = {};

    for (const item of order.items) {
      result[dateKey][item.productId] =
        (result[dateKey][item.productId] || 0) + item.quantity;
    }
  }

  return result;
}



export function updateExistingOrders(order: OrderData): void {
  const existing = getExistingOrdersMap();
  const dateKey = format(order.deliveryDate, 'yyyy-MM-dd');

  if (!existing[dateKey]) {
    existing[dateKey] = {};
  }

  for (const item of order.items) {
    existing[dateKey][item.productId] =
      (existing[dateKey][item.productId] || 0) + item.quantity;
  }

  localStorage.setItem('existing_orders', JSON.stringify(existing));
}


// ✅ רשימת הזמנות בריצה הנוכחית (לא זמינות!)
export const SESSION_ORDERS: OrderData[] = [];


export async function createOrder(data: OrderData): Promise<OrderData> {
  console.log('[✅ createOrder called]', data);

  const id = Math.random().toString(36).substring(2, 10);
  const order = { ...data, id };

  // שמירה בלוקאל סטורג'
  const existing = JSON.parse(localStorage.getItem("orders") || "[]");
  localStorage.setItem("orders", JSON.stringify([...existing, order]));
  localStorage.setItem("lastOrder", JSON.stringify(order));

try {
  await appendOrderRow([
    new Date().toISOString(),
    order.customerName,
    order.customerEmail,
    order.customerPhone || '',
    order.customerAddress || '',
    format(order.deliveryDate, 'yyyy-MM-dd'),
    order.deliveryMethod,
    order.paymentMethod || '',
    order.notes || '',
    order.totalAmount,
    JSON.stringify(order.items)
  ]);
} catch (err) {
  console.error('[❌ Failed to write to Google Sheets]', err);
}

  



  return order;
}




export function getAllOrders(): OrderData[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem('orders');
    const orders = raw ? JSON.parse(raw) : [];

    // ✨ המר תאריכים
    return orders.map((order: any) => ({
      ...order,
      deliveryDate: new Date(order.deliveryDate),
    }));
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
