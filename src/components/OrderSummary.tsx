// src/components/OrderSummary.tsx

import React from 'react';
import { getCart, cartTotal } from '../lib/cart';
import { getProductById } from '../lib/products';

export type OrderSummaryProps = {
  lang: 'he' | 'en';
};

const translations = {
  he: {
    your_order: 'ההזמנה שלך',
    qty: 'כמות',
    total: 'סה״כ'
  },
  en: {
    your_order: 'Your Order',
    qty: 'Qty',
    total: 'Total'
  }
};

export default function OrderSummary({ lang }: OrderSummaryProps) {
  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const cart = getCart();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border text-start">
      <h2 className="text-lg font-semibold mb-4 text-brand-dark">{t('your_order')}</h2>
      <div className="space-y-3">
        {cart.map(item => {
          const product = getProductById(item.id);
          return (
            <div key={item.id} className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 overflow-hidden rounded border">
                  <img
                    src={product.imageUrl}
                    alt={product.name[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{product.name[lang]}</p>
                  <p className="text-xs text-gray-500">{t('qty')}: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">₪{(product.price * item.quantity).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
      <div className="border-t mt-4 pt-4 flex justify-between text-sm font-bold">
        <span>{t('total')}</span>
        <span>₪{cartTotal().toFixed(2)}</span>
      </div>
    </div>
  );
}
