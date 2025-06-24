// src/components/OrderConfirmation.tsx

import React, { useEffect, useState } from 'react';
import { getOrderById, type OrderData } from '../lib/orders';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert } from './ui/alert';

type Props = {
  lang: 'he' | 'en';
};

const translations = {
  he: {
    loading: 'טוען...',
    thank_you: 'תודה על ההזמנה!',
    confirmation_message: 'שלחנו אישור לכתובת',
    order_id: 'מספר הזמנה:',
    order_summary: 'סיכום הזמנה',
    total: 'לתשלום',
    continue_shopping: 'להמשך קנייה',
    not_found: 'ההזמנה לא נמצאה'
  },
  en: {
    loading: 'Loading...',
    thank_you: 'Thank you for your order!',
    confirmation_message: 'We sent a confirmation to',
    order_id: 'Order ID:',
    order_summary: 'Order Summary',
    total: 'Total',
    continue_shopping: 'Continue Shopping',
    not_found: 'Order not found'
  }
};

export default function OrderConfirmation({ lang }: Props) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');
  const t = (key: keyof typeof translations['he']) => translations[lang][key];

  useEffect(() => {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('id');
    if (orderId) {
      getOrderById(orderId)
        .then(data => setOrder(data))
        .catch(() => setError(t('not_found')));
    } else {
      setError(t('not_found'));
    }
  }, []);

  if (error) {
    return (
      <div className="px-4 py-12">
        <Alert title="Error" description={error} />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center py-20">{t('loading')}</p>;
  }

  return (
    <div className="bg-brand-background px-4 py-12">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="text-xl sm:text-2xl font-bold mt-4">{t('thank_you')}</h1>
        <p className="mt-2 text-brand-dark">
          {t('confirmation_message')} <strong>{order.customerEmail}</strong>
        </p>
        <p className="text-sm text-brand-light mt-1">{t('order_id')} {order.id}</p>

        <div className="mt-6 border-t pt-6 text-start">
          <h2 className="font-semibold mb-3">{t('order_summary')}</h2>
          <div className="space-y-2 text-sm">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>₪{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="font-bold mt-4 flex justify-between border-t pt-4 text-lg">
            <span>{t('total')}</span>
            <span>₪{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <a href={`/${lang}/products`}>
            <Button className="w-full sm:w-auto">{t('continue_shopping')}</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
