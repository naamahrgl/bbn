import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { getCart } from '../lib/cart';
import { getAvailability } from '../lib/deliveryRules';
import type { ProductId } from '../lib/orders';
import type { CartItem } from '../lib/cart';


export type DeliveryDateSelectorProps = {
  lang: 'he' | 'en';
  onDateSelect: (date: Date) => void;
};

const translations = {
  he: { selectDate: 'בחרי תאריך משלוח או איסוף' },
  en: { selectDate: 'Select a delivery or pickup date' },
};

export default function DeliveryMethodSelector({ lang, onDateSelect }: DeliveryDateSelectorProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [disabledDays, setDisabledDays] = useState<Date[]>([]);
  const cart = getCart();
  const t = translations[lang];

  useEffect(() => {
    const today = new Date();
    const next14 = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date;
    });

    const result = next14.filter(
      (day) => getAvailability(cart, day) === 'red'
    );

    setDisabledDays(result);
  }, [JSON.stringify(cart)]); // לצורך עדכון כשעגלה משתנה

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
        disabled={disabledDays}
      />
    </div>
  );
}
