import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import type { ProductId } from '../lib/orders';


type CartItem = {
  id: ProductId;
  quantity: number;
};

type Props = {
  cart: CartItem[];
  lang: 'he' | 'en';
};

const translations = {
  he: {
    title: 'בחרי תאריך',
    selected: (date: Date) => `תאריך נבחר: ${format(date, 'dd/MM/yyyy')}`,
    red: 'אחד מהפריטים אזל במלאי ליום זה',
    orange: 'לא כל הכמות זמינה - יש להתאים',
  },
  en: {
    title: 'Choose a Date',
    selected: (date: Date) => `Selected date: ${format(date, 'dd/MM/yyyy')}`,
    red: 'One or more items are sold out on this date',
    orange: 'Not all items are available in full quantity',
  },
};

export default function DeliveryDateSelector({ cart, lang }: Props) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [dayColors, setDayColors] = useState<Record<string, 'green' | 'orange' | 'red'>>({});

  useEffect(() => {
    fetch('/api/availability', {
      method: 'POST',
      body: JSON.stringify({ cart }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(setDayColors)
      .catch(console.error);
  }, [JSON.stringify(cart)]); // כדי להגיב לשינויים בעגלה

  const t = translations[lang];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">{t.title}</h2>
            <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            modifiers={{
                red: (day) => dayColors[format(day, 'yyyy-MM-dd')] === 'red',
                orange: (day) => dayColors[format(day, 'yyyy-MM-dd')] === 'orange',
            }}
            modifiersClassNames={{
                red: 'bg-red-200 text-red-800',
                orange: 'bg-yellow-200 text-yellow-800',
            }}
            modifiersStyles={{
                red: { cursor: 'not-allowed' },
                orange: { cursor: 'pointer' },
            }}
            />

      {selected && (
        <p className="mt-2 text-sm">{t.selected(selected)}</p>
      )}
    </div>
  );
}
