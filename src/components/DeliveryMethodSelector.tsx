import React, { useState, useEffect } from 'react';

type DeliveryMethod = 'pickup' | 'delivery';

interface Props {
  lang: 'he' | 'en';
  onSelect?: (method: DeliveryMethod) => void; // אפשרות לחיווי למעלה
}

const translations = {
  he: {
    title: 'שיטת משלוח',
    pickup: 'איסוף עצמי',
    delivery: 'משלוח',
  },
  en: {
    title: 'Delivery Method',
    pickup: 'Pickup',
    delivery: 'Delivery',
  },
};

export default function DeliveryMethodSelector({
  lang,
  selectedMethod,
  onSelect,
}: {
  lang: 'he' | 'en';
  selectedMethod: 'pickup' | 'delivery' | undefined;
  onSelect: (method: 'pickup' | 'delivery') => void;
}) {
  const t = translations[lang];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{t.title}</h2>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="deliveryMethod"
            value="pickup"
            checked={selectedMethod === 'pickup'}
            onChange={() => onSelect('pickup')}
          />
          <span>{t.pickup}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="deliveryMethod"
            value="delivery"
            checked={selectedMethod === 'delivery'}
            onChange={() => onSelect('delivery')}
          />
          <span>{t.delivery}</span>
        </label>
      </div>
    </div>
  );
}

