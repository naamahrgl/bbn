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

type DayColor = {
  status: 'green' | 'orange' | 'red';
  soldOutProducts?: string[];
  partialAvailability?: Record<string, number>;
};

type DayColorsMap = Record<string, DayColor>;


export default function CheckoutPage({ lang }: CheckoutPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [deliveryMethod, setDeliveryMethod] = useState<
    'pickup' | 'delivery_near' | 'delivery_far' | undefined
  >();
const [dayColors, setDayColors] = useState<DayColorsMap>({});
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
<div className="checkout-container space-y-6 max-w-3xl mx-auto px-4">
  {/* Order Summary */}
  <OrderSummary lang={lang} deliveryMethod={deliveryMethod} />

  {/* Date + Method Selection Centered + Wrapped */}
  <div className="space-y-4">
<div className="shadow rounded-md p-4 bg-white flex justify-center items-center text-center ">
      <DeliveryMethodSelector
        lang={lang}
        selectedMethod={deliveryMethod}
        onSelect={setDeliveryMethod}
      />
    </div>

<div className="shadow rounded-md p-4 bg-white flex justify-center items-center text-center ">
      <DeliveryDateSelector
        lang={lang}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dayColors={dayColors}
        setDayColors={setDayColors}
      />
    </div>
  </div>

  {/* Checkout Form */}
  <CheckoutForm
    lang={lang}
    selectedDate={selectedDate}
    deliveryMethod={deliveryMethod}
    dayColors={dayColors}
  />
</div>

  );
}
