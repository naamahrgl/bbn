// src/components/CheckoutForm.tsx

import React, { useState } from 'react';
import { getCart, cartTotal, clearCart } from '../lib/cart';
import { getProductById } from '../lib/products';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert } from './ui/alert';
import type { OrderData } from '../lib/orders';
import { isOrderLegal } from '../lib/isOrderLegal';


type DayColor = {
  status: 'green' | 'orange' | 'red' | 'gray';
  soldOutProducts?: string[];
  partialAvailability?: Record<string, number>;
};

type CheckoutFormProps = {
  lang: 'he' | 'en';
  selectedDate: Date | undefined;
  deliveryMethod: 'pickup' | 'delivery_near' | 'delivery_far' | 'delivery_sharon' | undefined;
  dayColors: Record<string, DayColor>;
  coupon: { code: string; amount: number } | null;
  deliveryFee: number;
  finalTotal: number;
};




const translations = {
  he: {
    contact_info: 'פרטי קשר',
    fullName: 'שם מלא',
    email: 'אימייל',
    phone_optional: 'טלפון',
    address_optional: 'כתובת (לא חובה)',
    order_notes_optional: 'הערות להזמנה (לא חובה)',
    place_order: 'בצע הזמנה',
    placing_order: 'שולח הזמנה...',
    order_failed: 'ההזמנה נכשלה. נסי שוב.',
    order_success: 'ההזמנה בוצעה!'
  },
  en: {
    contact_info: 'Contact Information',
    fullName: 'Full Name',
    email: 'Email',
    phone_optional: 'Phone',
    address_optional: 'Address (optional)',
    order_notes_optional: 'Order notes (optional)',
    place_order: 'Place Order',
    placing_order: 'Placing Order...',
    order_failed: 'Order failed. Try again.',
    order_success: 'Order placed!'
  }
};

export default function CheckoutForm({ lang, selectedDate, deliveryMethod, dayColors, coupon, deliveryFee, finalTotal }: CheckoutFormProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '', address: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name || !formData.email) {
    setError(t('fullName') + ' & ' + t('email'));
    return;
  }

  if (!deliveryMethod) {
    alert(lang === 'he' ? 'יש לבחור שיטת משלוח' : 'Please choose a delivery method');
    return;
  }

  if (!selectedDate) {
    alert(lang === 'he' ? 'יש לבחור תאריך' : 'Please choose a delivery date');
    return;
  }

  const orderData: any = {
      id: Math.random().toString(36).substring(2, 10), // ✅ ג׳יבריש
    customerName: formData.name,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    customerAddress: formData.address,
    notes: formData.notes,
    totalAmount: cartTotal(),
    deliveryDate: selectedDate,
    deliveryMethod: deliveryMethod,
    items: getCart().map(item => {
      const product = getProductById(item.id);
      return {
        productId: item.id,
        name: product.name[lang],
        quantity: item.quantity,
        price: item.price ?? product.price,
        size: item.size,
        multiplier: item.multiplier,
      };
    }),
    couponCode: coupon?.code || undefined,
    couponAmount: coupon?.amount || 0,
    amountToPay: finalTotal,
    deliveryFee,
    status: "checkout",
  };

  const orderError = isOrderLegal({
    selectedDate,
    deliveryMethod,
    dayColors, lang
  });

  if (orderError) {
    alert(orderError);
    return;
  }

  setIsSubmitting(true);

  try {
    if (finalTotal === 0) {
      orderData.status = 'submitted';
      // 🚀 FREE ORDER - Call finalize-order directly
      const response = await fetch('/api/finalize-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      //const { receiptId } = await response.json();

      clearCart();
      window.location.href = `/${lang}/orderconfirmation?id=${orderData.id}`;

    } else {
      //write checkout order in sheet
      const response0 = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      // 💳 PAID ORDER - Create order ID & prepare for payment
      const response = await fetch('/api/allpay-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...orderData,
    origin: window.location.origin, // בשביל notifications_url
    lang // תוודאי שזה מגיע נכון
  }),
      });

const { paymentUrl } = await response.json();

window.location.href = `/${lang}/payment?payment_url=${encodeURIComponent(paymentUrl)}`;


    }

  } catch (err) {
    console.error(err);
    setError(t('order_failed'));
    setIsSubmitting(false);
  }
};





  

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl mx-auto bg-[var(--brand-lighter)] p-4 sm:p-6 rounded-md shadow-md text-[var(--brand-text-dark)] border border-[var(--small-buttons)]">
      <h2 className="text-lg sm:text-xl font-semibold text-[var(--brand-text-dark)]">{t('contact_info')}</h2>
      {error && <Alert title="Error" description={error} />}
      <div>
        <Label htmlFor="name">{t('fullName')}</Label>
        <Input id="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="phone">{t('phone_optional')}</Label>
        <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
      </div>
            <div>
        <Label htmlFor="address">{t('address_optional')}</Label>
        <Input id="address" type="address" value={formData.address} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="notes">{t('order_notes_optional')}</Label>
        <Textarea id="notes" value={formData.notes} onChange={handleChange} />
      </div>      
      <Button type="submit" disabled={isSubmitting}className="bg-[var(--big-buttons)] hover:bg-[var(--big-buttons-hover)] text-white shadow-lg">
        {isSubmitting ? t('placing_order') : t('place_order')}
      </Button>
    </form>
    
  );

}
