import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { getCart } from '../lib/cart';
import { isDateAvailableForCart, getDisabledDaysForCart } from '../lib/deliveryRules';

export type DeliveryDateSelectorProps = {
  lang: 'he' | 'en';
  onDateSelect: (date: Date) => void;
};

const translations = {
  he: { selectDate: 'בחרי תאריך משלוח או איסוף' },
  en: { selectDate: 'Select a delivery or pickup date' }
};

export default function DeliveryDateSelector({ lang, onDateSelect }: DeliveryDateSelectorProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const cart = getCart();

  const t = translations[lang];

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    setSelected(day);
    onDateSelect(day);
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm border text-start">
      <h2 className="text-sm font-semibold mb-2">{t.selectDate}</h2>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleDaySelect}
        disabled={getDisabledDaysForCart(cart)}
      />
    </div>
  );
}