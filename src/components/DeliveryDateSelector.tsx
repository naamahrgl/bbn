// components/DeliveryDateSelector.tsx

import React, { useState , useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { getDayColors } from '../lib/deliveryRules';
import { format } from 'date-fns';
import { getCart } from '../lib/cart';

const [dayColors, setDayColors] = useState<Record<string, 'green' | 'orange' | 'red'>>({});
const cart = getCart(); // אם יש לך cart בלוקאל או ב-context

useEffect(() => {
  fetch('/api/availability', {
    method: 'POST',
    body: JSON.stringify({ cart }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(setDayColors)
    .catch(console.error);
}, [cart]);


type CartItem = {
  id: string;
  quantity: number;
};

export default function DeliveryDateSelector({ cart }: { cart: CartItem[] }) {
  const [selected, setSelected] = useState<Date | undefined>();
  const dayColors = getDayColors(cart);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">בחרי תאריך</h2>
        <DayPicker
        modifiers={{
            red: day => dayColors[format(day, 'yyyy-MM-dd')] === 'red',
            orange: day => dayColors[format(day, 'yyyy-MM-dd')] === 'orange',
        }}
        modifiersClassNames={{
            red: 'bg-red-200 text-red-800',
            orange: 'bg-yellow-200 text-yellow-800',
        }}
        modifiersStyles={{
            red: { cursor: 'not-allowed' },
            orange: { cursor: 'pointer' }
        }}
        components={{
            DayContent: ({ date, activeModifiers }) => {
            const label = format(date, 'd');
            const key = format(date, 'yyyy-MM-dd');
            const status = dayColors[key];

            const tooltip = status === 'red'
                ? 'אחד מהפריטים אזל במלאי ליום זה'
                : status === 'orange'
                ? 'לא כל הכמות זמינה - יש להתאים'
                : '';

            return <div title={tooltip}>{label}</div>;
            }
        }}
        />
      {selected && (
        <p className="mt-2 text-sm">
          תאריך נבחר: {format(selected, 'dd/MM/yyyy')}
        </p>
      )}
    </div>
  );
}
