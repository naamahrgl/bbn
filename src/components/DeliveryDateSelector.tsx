import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import type { ProductId } from '../lib/products';
import { getCart } from '../lib/cart';


type CartItem = {
  id: ProductId;
  quantity: number;
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

export default function DeliveryDateSelector({ lang }: { lang: 'he' | 'en' })  {
      const cart = getCart();

  const [selected, setSelected] = useState<Date | undefined>();
  const [dayColors, setDayColors] = useState<Record<string, 'green' | 'orange' | 'red'>>({});

useEffect(() => {
    console.log('🛒 Sending cart to availability API:', cart);

  fetch('/api/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart }), // נוודא שזה לא undefined
  })
    .then((res) => res.json())
    .then(setDayColors)
    .catch(console.error);
}, [JSON.stringify(cart)]);

  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-md shadow-md">
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
