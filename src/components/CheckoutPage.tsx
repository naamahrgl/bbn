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
    checkout_message: 'אנא בחר את תאריך המשלוח או האיסוף המועדף עליך למטה, ולאחר מכן המשך לתשלום.'
  },
  en: {
    empty_cart: 'Your cart is empty.',
        checkout_message: 'Please select your preferred delivery or pickup date below, then proceed to payment.'

  }
};

type DayColor = {
  status: 'green' | 'orange' | 'red' | 'gray';
  soldOutProducts?: string[];
  partialAvailability?: Record<string, number>;
};

type DayColorsMap = Record<string, DayColor>;


export default function CheckoutPage({ lang }: CheckoutPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [deliveryMethod, setDeliveryMethod] = useState<
    'pickup' | 'delivery_near' | 'delivery_far' | 'delivery_sharon' | undefined
  >();
  const [dayColors, setDayColors] = useState<DayColorsMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ NEW state for coupon and totals
  const [coupon, setCoupon] = useState<{ code: string; amount: number } | null>(null);
  const [totals, setTotals] = useState<{ finalTotal: number; deliveryFee: number }>({
    finalTotal: 0,
    deliveryFee: 0
  });

  const t = (key: keyof typeof translations['he']) => translations[lang][key];
  const cartItems = getCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--brand-text-dark)] border-text-[var(--brand-text-dark)]">{t('empty_cart')}</h1>
      </div>
    );
  }

  return (
    <div className="checkout-container space-y-6 max-w-3xl mx-auto px-4">
      <p></p>
       <h1 className="text-l sm:text-l font-bold mb-6 text-[var(--brand-text-dark)]">{t('checkout_message')}</h1>
      <p></p>

      {/* Order Summary */}
      <OrderSummary
        lang={lang}
        deliveryMethod={deliveryMethod}
        onCouponChange={setCoupon}
        onTotalsChange={setTotals}
      />

      {/* Date + Method Selection */}
      <div className="space-y-4">
<div className="card-basic">
            <DeliveryMethodSelector
            lang={lang}
            selectedMethod={deliveryMethod}
            onSelect={setDeliveryMethod}
          />
        </div>

<div className="card-basic">
  
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
        coupon={coupon}
        deliveryFee={totals.deliveryFee}
        finalTotal={totals.finalTotal}
      />
            <p></p>

    </div>
  );
}
