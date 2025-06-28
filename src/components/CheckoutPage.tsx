// src/components/CheckoutPage.tsx
import React, { useState } from 'react';

import { getCart, cartTotal } from '../lib/cart';
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
    checkout: 'לתשלום',
    empty_cart: 'העגלה ריקה.',
    go_shopping: 'לכל המוצרים',
        place_order: 'בצע הזמנה',
    placing_order: 'שולח הזמנה...',
  },
  en: {
    checkout: 'Checkout',
    empty_cart: 'Your cart is empty.',
    go_shopping: 'Go Shopping',
        place_order: 'Place Order',
    placing_order: 'Placing Order...',
  }
};

export default function CheckoutPage({ lang }: CheckoutPageProps) {
   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | undefined>();
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
            <OrderSummary lang={lang} />

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
