import React, { useState, useEffect } from 'react';

type DeliveryMethod = 'pickup' | 'delivery';

interface Props {
  lang: 'he' | 'en';
  onSelect?: (method: DeliveryMethod) => void; // אפשרות לחיווי למעלה
}

const labels = {
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

export default function DeliveryMethodSelector({ lang, onSelect }: Props) {
  const [method, setMethod] = useState<DeliveryMethod>('pickup');
  const t = labels[lang];

  useEffect(() => {
    if (onSelect) onSelect(method);
  }, [method]);

  return (
    
    <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-md shadow-md">
              <h2 className="text-lg font-bold mb-2">{t.title}</h2>
      {(['pickup', 'delivery'] as DeliveryMethod[]).map(option => (
        <label key={option} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="deliveryMethod"
            value={option}
            checked={method === option}
            onChange={() => setMethod(option)}
          />
          <span>{t[option]}</span>
        </label>
      ))}
    </div>
  );
}
