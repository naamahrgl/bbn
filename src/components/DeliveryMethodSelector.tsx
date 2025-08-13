import React, { useState, useEffect } from 'react';

type DeliveryMethod = 'pickup' | 'delivery_near' | 'delivery_far';

interface Props {
  lang: 'he' | 'en';
  onSelect?: (method: DeliveryMethod) => void; // אפשרות לחיווי למעלה
}

const translations = {
  he: {
    title: 'שיטת משלוח',
    pickup: 'איסוף עצמי מגן החשמל, ת״א',
    delivery_near: 'משלוח למרכז/דרום ת״א',
    delivery_far: ' משלוח בצפון ת״א/רמת גן/גבעתיים',
    delivery_sharon: 'משלוח בשרון - רמת השרון/הוד השרוןֿֿ/הרצליה/רעננה/כפר סבא'
  },
  en: {
    title: 'Delivery Method',
    pickup: 'Pickup from Gan HaHashmal, Tel Aviv',
    delivery_near: 'Delivery in Tel Aviv (center/south)',
    delivery_far: 'Delivery in Ramat Gan/Givataim/Tel Aviv (north)',
    delivery_sharon: 'Delivery in Ramat HaSharon/Hod Hasharon/Herzeliya/Kefar Saba/Raanana'

  },
};

export default function DeliveryMethodSelector({
  lang,
  selectedMethod,
  onSelect,
}: {
  lang: 'he' | 'en';
  selectedMethod: 'pickup' | 'delivery_near' | 'delivery_far' | 'delivery_sharon' | undefined;
  onSelect: (method: 'pickup' | 'delivery_near' | 'delivery_far' | 'delivery_sharon') => void;
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
                              <span className='text-stone-400'>{lang == 'he' ? "בתיאום מראש בלבד, בין השעות 10-20": 'by prior arrangement, between 10am-8pm'}</span>

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
                              <span className='text-stone-400'>{lang == 'he' ? "35 ש״ח": '35 NIS'}</span>

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
                    <span className='text-stone-400'>{lang == 'he' ? "40 ש״ח": '40 NIS'}</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="deliveryMethod"
            value="delivery_sharon"
            checked={selectedMethod === 'delivery_sharon'}
            onChange={() => onSelect('delivery_sharon')}
          />
          <span>{t.delivery_sharon}</span>
                    <span className='text-stone-400'>{lang == 'he' ? "ימי שלישי אחת לשבועיים, 50 ש״ח": 'Every other Tuesday, 50 NIS'}</span>

        </label>
      </div>
    </div>
  );
}

