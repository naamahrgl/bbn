import React, { useState, useEffect } from 'react';

type DeliveryMethod = 'pickup_hashmal' | 'pickup_kingdom' | 'delivery_near' | 'delivery_far';

interface Props {
  lang: 'he' | 'en';
  onSelect?: (method: DeliveryMethod) => void; // אפשרות לחיווי למעלה
}

const translations = {
  he: {
    title: 'שיטת משלוח',
    pickup_hashmal: 'איסוף עצמי מקפה החשמל - החשמל 12, ת״א',
    pickup_kingdom: 'איסוף עצמי מממלכה ללא גלוטן - מסריק 16, ת״א',
    delivery_near: 'משלוח למרכז/דרום ת״א',
    delivery_far: ' משלוח בצפון ת״א / רמת גן / גבעתיים',
    delivery_sharon: 'איסוף עצמי ממידטאון - ימי שני ורביעי'
  },
  en: {
    title: 'Delivery Method',
    pickup_hashmal: 'Pickup from Cafe HaHashmal - HaHashmal St 12, Tel Aviv',
        pickup_kingdom: 'Pickup from Gluten Free Kingdom - Masarik St 16, Tel Aviv',
    delivery_near: 'Delivery in Tel Aviv (center/south)',
    delivery_far: 'Delivery in Ramat Gan/Givataim/Tel Aviv (north)',
    delivery_sharon: 'Pickup from Midtown - Mondays and Wednesdays'

  },
};

export default function DeliveryMethodSelector({
  lang,
  selectedMethod,
  onSelect,
}: {
  lang: 'he' | 'en';
  selectedMethod: 'pickup_hashmal' | 'pickup_kingdom' | 'delivery_near' | 'delivery_far' | 'delivery_sharon' | undefined;
  onSelect: (method: 'pickup_hashmal' | 'pickup_kingdom'  | 'delivery_near' | 'delivery_far' | 'delivery_sharon') => void;
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
            value="pickup_hashmal"
            checked={selectedMethod === 'pickup_hashmal'}
            onChange={() => onSelect('pickup_hashmal')}
          />
          <span>{t.pickup_hashmal}</span>
                              <span className='text-stone-400'>{lang == 'he' ? "תקבלו הודעה כאשר ההזמנה זמינה לאיסוף": 'You will be informed once your order is available for pickup'}</span>

        </label>
                <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="deliveryMethod"
            value="pickup_kingdom"
            checked={selectedMethod === 'pickup_kingdom'}
            onChange={() => onSelect('pickup_kingdom')}
          />
          <span>{t.pickup_kingdom}</span>
                              <span className='text-stone-400'>{lang == 'he' ? "תקבלו הודעה כאשר ההזמנה זמינה לאיסוף": 'You will be informed once your order is available for pickup'}</span>

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
                              <span className='text-stone-400'>{lang == 'he' ? "הוסיפו כתובת  משרד שבה ניתן להניח את ההזמנה שלכם, ותקבלו הודעה כאשר ההזמנה זמינה לאיסוף": 'Add your office address where you can receive the order, and you will be informed when it is available for pickup'}</span>

        </label>
      </div>
    </div>
  );
}

