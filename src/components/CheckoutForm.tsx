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
import OrderSummary from './OrderSummary';
import { createOrder } from '../lib/orders';
import { isOrderLegal } from '../lib/isOrderLegal';

type CheckoutFormProps = {
  lang: 'he' | 'en';
  selectedDate: Date | undefined;
  deliveryMethod: 'pickup' | 'delivery' | undefined;
  dayColors: Record<string, 'green' | 'orange' | 'red'>;
};


const translations = {
  he: {
    contact_info: 'פרטי קשר',
    fullName: 'שם מלא',
    email: 'אימייל',
    phone_optional: 'טלפון (לא חובה)',
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
    phone_optional: 'Phone (optional)',
    address_optional: 'Address (optional)',
    order_notes_optional: 'Order notes (optional)',
    place_order: 'Place Order',
    placing_order: 'Placing Order...',
    order_failed: 'Order failed. Try again.',
    order_success: 'Order placed!'
  }
};

export default function CheckoutForm({ lang, selectedDate, deliveryMethod, dayColors }: CheckoutFormProps) {
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

  setError('');
  setIsSubmitting(true);

  const items = getCart().map(item => {
    const product = getProductById(item.id);
    return {
      productId: item.id,
      name: product.name[lang],
      quantity: item.quantity,
      price: product.price,
    };
  });

if (!deliveryMethod) {
  alert(lang === 'he' ? 'יש לבחור שיטת משלוח' : 'Please choose a delivery method');
  setIsSubmitting(false);
  return;
}

if (!selectedDate) {
  alert(lang === 'he' ? 'יש לבחור תאריך' : 'Please choose a delivery date');
  setIsSubmitting(false);
  return;
}

  const order: OrderData = {
    customerName: formData.name,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    customerAddress:formData.address,
    totalAmount: cartTotal(),
    deliveryDate: selectedDate,
     deliveryMethod: deliveryMethod,
    items,
    notes: formData.notes,
  };

  const orderError = isOrderLegal({
    selectedDate,
    deliveryMethod,
    dayColors,
  });

  if (orderError) {
    alert(orderError);
      setIsSubmitting(false);

    return;
  }

  try {
    console.log('[order being created]', order);
    const created = await createOrder(order);
    clearCart();
          window.location.href = `/${lang}/orderconfirmation?id=${created.id}&date=${selectedDate?.toISOString()}&method=${deliveryMethod}`;
  } catch (e) {
    console.error(e);
    setError(t('order_failed'));
  } finally {
    setIsSubmitting(false);
  }
};

  

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-md shadow-md">
      <h2 className="text-lg sm:text-xl font-semibold">{t('contact_info')}</h2>
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
        <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
      </div>
            <div>
        <Label htmlFor="address">{t('address_optional')}</Label>
        <Input id="address" type="address" value={formData.address} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="notes">{t('order_notes_optional')}</Label>
        <Textarea id="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('placing_order') : t('place_order')}
      </Button>
    </form>
    
  );

}
