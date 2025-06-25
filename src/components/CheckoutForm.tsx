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

type CheckoutFormProps = {
  lang: 'he' | 'en';
};

const translations = {
  he: {
    contact_info: 'פרטי קשר',
    fullName: 'שם מלא',
    email: 'אימייל',
    phone_optional: 'טלפון (לא חובה)',
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
    order_notes_optional: 'Order notes (optional)',
    place_order: 'Place Order',
    placing_order: 'Placing Order...',
    order_failed: 'Order failed. Try again.',
    order_success: 'Order placed!'
  }
};

export default function CheckoutForm({ lang }: CheckoutFormProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
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

    const order: OrderData = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      totalAmount: cartTotal(),
      items,
      notes: formData.notes,
    };

    try {
      const created = await createOrder(order);
      clearCart();
      window.location.href = `/${lang}/orderconfirmation?id=${created.id}`;
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
        <Label htmlFor="notes">{t('order_notes_optional')}</Label>
        <Textarea id="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('placing_order') : t('place_order')}
      </Button>
    </form>
  );
}
