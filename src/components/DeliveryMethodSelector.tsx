import React, { useState, useEffect } from 'react';

type DeliveryMethod = 'pickup' | 'delivery_near' | 'delivery_far';

interface Props {
  lang: 'he' | 'en';
  onSelect?: (method: DeliveryMethod) => void; // אפשרות לחיווי למעלה
}

const translations = {
  he: {
    title: 'שיטת משלוח',
    pickup: 'איסוף עצמי',
    delivery_near: 'משלוחתל אביב',
        delivery_far: ' רג גבעתיים משלוח'
  },
  en: {
    title: 'Delivery Method',
    pickup: 'Pickup',
    delivery_near: 'Delivery in Tel Aviv',
            delivery_far: 'Delivery IN RamatGan/Givataim'

  },
};

export default function DeliveryMethodSelector({
  lang,
  selectedMethod,
  onSelect,
}: {
  lang: 'he' | 'en';
  selectedMethod: 'pickup' | 'delivery_near' | 'delivery_far' | undefined;
  onSelect: (method: 'pickup' | 'delivery_near' | 'delivery_far') => void;
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
            value="delivery_near"
            checked={selectedMethod === 'delivery_near'}
            onChange={() => onSelect('delivery_near')}
          />
          <span>{t.delivery_near}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="deliveryMethod"
            value="delivery_far"
            checked={selectedMethod === 'delivery_far'}
            onChange={() => onSelect('delivery_far')}
          />
          <span>{t.delivery_far}</span>
        </label>
      </div>
    </div>
  );
}

