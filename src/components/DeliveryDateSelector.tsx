// DeliveryDateSelector.tsx

import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { getCart } from '../lib/cart';
import type { ProductId } from '../lib/products';
import { he, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';


type CartItem = { id: ProductId; quantity: number };

type DayColor = {
  status: 'green' | 'orange' | 'red' | 'gray';
  soldOutProducts?: string[];
  partialAvailability?: Record<string, number>;
};

type DeliveryDateSelectorProps = {
  lang: 'he' | 'en';
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  dayColors: Record<string, DayColor>;
  setDayColors: React.Dispatch<React.SetStateAction<Record<string, DayColor>>>;
};



const translations = {
  he: {
    title: 'בחרו תאריך',
    selected: (date: Date) => `תאריך נבחר: ${format(date, 'dd/MM/yyyy')}`,
    red: 'חלק מהפריטים אזלו במלאי',
    orange: 'זמין חלקית במלאי',
    gray: 'סליחה, אנחנו סגורים ביום זה',
    green: 'זמין במלאי',
  },
  en: {
    title: 'Choose a Date',
    selected: (date: Date) => `Selected date: ${format(date, 'dd/MM/yyyy')}`,
    red: 'Some items are sold out',
    orange: 'Partial stock available',
    gray: 'Sorry, we are closed',
    green: 'Available in stock',
  },
};

export default function DeliveryDateSelector({
  lang,
  selectedDate,
  setSelectedDate,
  dayColors,
  setDayColors,
}: DeliveryDateSelectorProps) {
  const [cart] = useState(getCart()); // ✅ לא משתנה יותר בכל רינדור
  const t = translations[lang];

  useEffect(() => {
    const fetchDayColors = async () => {
      try {
        const res = await fetch('/api/availability', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cart }),
});

const data: Record<string, DayColor> = await res.json();
setDayColors(data);
console.log('🎨 setDayColors', data);

      } catch (err) {
        console.error('🛑 Error fetching availability', err);
      }
    };

    if (cart.length > 0) fetchDayColors();
  }, [cart, setDayColors]);


  return (
    <div className="p-4">

      <h2 className="text-lg font-bold mb-2">{t.title}</h2>



<DayPicker
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  locale={lang === 'he' ? he : enUS}
  dir={lang === 'he' ? 'rtl' : 'ltr'}
  className="rdp"
  modifiers={{
    red: (day) => dayColors[format(day, 'yyyy-MM-dd')]?.status === 'red',
    orange: (day) => dayColors[format(day, 'yyyy-MM-dd')]?.status === 'orange',
    gray: (day) => dayColors[format(day, 'yyyy-MM-dd')]?.status === 'gray',
        green: (day) => dayColors[format(day, 'yyyy-MM-dd')]?.status === 'green'

  }}
  modifiersClassNames={{
    red: 'bg-red-200 text-red-800',
    orange: 'bg-yellow-200 text-yellow-800',
    gray: 'bg-gray-200 text-gray-600 line-through',
    green: 'bg-green-200 text-green-800'
  }}
  modifiersStyles={{
    red: { cursor: 'not-allowed' },
    orange: { cursor: 'pointer' },
    gray: { cursor: 'not-allowed' },
        green: { cursor: 'pointer' }
  }}
/>

    {/* 🔑 Color Legend */}
<div className="mb-4 flex flex-col items-center">
  <ul className="flex flex-col gap-2 text-sm">
    <li className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-green-200 border border-green-800"></span>
      <span>{t.green}</span>
    </li>
    <li className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-yellow-200 border border-yellow-800"></span>
      <span>{t.orange}</span>
    </li>
    <li className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-red-200 border border-red-800"></span>
      <span>{t.red}</span>
    </li>
    <li className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-gray-200 border border-gray-600"></span>
      <span>{t.gray}</span>
    </li>
  </ul>
</div>





      {selectedDate && <p className="mt-2 text-sm">{t.selected(selectedDate)}</p>}
    </div>
  );
}
