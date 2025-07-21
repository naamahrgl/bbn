import { v4 as uuid } from 'uuid';
import type { ProductId } from './products';
import { format } from 'date-fns';



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
  couponCode?: string;
  couponAmount: number;
  deliveryDate: Date; // ✅ תאריך בצורת yyyy-MM-dd
  deliveryMethod: 'pickup' | 'delivery_near' | 'delivery_far'; // ✅ כדי להציג גם בשיט
  paymentMethod?: 'cash' | 'credit'; // ✅ לשלב מאוחר יותר
  amountToPay: number;
deliveryFee: number;
  receiptSerial?: number; // ✅ New field,
  status?: string;

};



// orders.ts



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

const response = await fetch('/api/create-order', {
  method: 'POST',
  body: JSON.stringify(order),
  headers: { 'Content-Type': 'application/json' },
});

const result = await response.json();
console.log('[📤 create-order response]', result);

if (!response.ok) {
  throw new Error('Failed to write to Google Sheet');
}


  



  return order;
}





