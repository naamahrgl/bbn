// src/components/CheckoutPage.tsx

import React, { useState } from 'react';
import { getCart } from '../lib/cart';
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import DeliveryDateSelector from './DeliveryDateSelector';
import DeliveryMethodSelector from './DeliveryMethodSelector';
import { Button } from './ui/button';

export type CheckoutPageProps = {
  lang: 'he' | 'en';
};

const translations = {
  he: {
    empty_cart: 'העגלה ריקה.',
  },
  en: {
    empty_cart: 'Your cart is empty.',
  }
};

export default function CheckoutPage({ lang }: CheckoutPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [deliveryMethod, setDeliveryMethod] = useState<
    'pickup' | 'delivery_near' | 'delivery_far' | undefined
  >();
  const [dayColors, setDayColors] = useState<Record<string, 'green' | 'orange' | 'red'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const cartItems = getCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t('empty_cart')}</h1>
      </div>
    );
  }

  return (
    <div className="checkout-container space-y-6">
      <OrderSummary lang={lang} deliveryMethod={deliveryMethod} />

      <DeliveryMethodSelector
        lang={lang}
        selectedMethod={deliveryMethod}
        onSelect={setDeliveryMethod}
      />

      <DeliveryDateSelector
        lang={lang}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dayColors={dayColors}
        setDayColors={setDayColors}
      />

      <CheckoutForm
        lang={lang}
        selectedDate={selectedDate}
        deliveryMethod={deliveryMethod}
        dayColors={dayColors}
      />
    </div>
  );
}
