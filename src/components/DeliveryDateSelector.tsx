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
    gray: (day) => dayColors[format(day, 'yyyy-MM-dd')]?.status === 'gray'
  }}
  modifiersClassNames={{
    red: 'bg-red-200 text-red-800',
    orange: 'bg-yellow-200 text-yellow-800',
    gray: 'bg-gray-200 text-gray-600 line-through'
  }}
  modifiersStyles={{
    red: { cursor: 'not-allowed' },
    orange: { cursor: 'pointer' },
    gray: { cursor: 'not-allowed' }
  }}
/>




      {selectedDate && <p className="mt-2 text-sm">{t.selected(selectedDate)}</p>}
    </div>
  );
}
