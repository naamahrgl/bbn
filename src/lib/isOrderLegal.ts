import { format, isSameDay } from 'date-fns';
import { getProductById } from './products'; // ⚠️ used to translate product ID to name

type DayColorEntry = {
  status: 'green' | 'orange' | 'red';
  soldOutProducts?: string[];
  partialAvailability?: Record<string, number>;
};

interface OrderContext {
  selectedDate: Date | undefined;
  deliveryMethod: 'pickup' | 'delivery_near' | 'delivery_far';
  dayColors: Record<string, DayColorEntry>;
  lang: 'he' | 'en';
}

export function isOrderLegal({
  selectedDate,
  deliveryMethod,
  dayColors,
  lang
}: OrderContext): string | null {
  if (!selectedDate) return lang === 'he' ? 'יש לבחור תאריך משלוח.' : 'Please select a delivery date.';

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const colorEntry = dayColors[dateKey];

  if (!colorEntry) return lang === 'he' ? 'תאריך לא חוקי.' : 'Invalid date selected.';

  // 🟥 Sold out products
  if (colorEntry.status === 'red' && colorEntry.soldOutProducts?.length) {
    const names = colorEntry.soldOutProducts.map(pid => getProductById(pid).name[lang]).join(', ');
    return lang === 'he'
      ? `המוצרים הבאים אזלו בתאריך שנבחר: ${names}. 
נא לשנות את ההזמנה או לבחור יום אחר.`
      : `Sorry, the following products are sold out for the selected day: ${names}. 
Please adjust your order or choose another day.`;
  }

  // 🟧 Partial availability
  if (colorEntry.status === 'orange' && colorEntry.partialAvailability) {
    const details = Object.entries(colorEntry.partialAvailability)
      .map(([pid, qty]) => `${qty} ${getProductById(pid).name[lang]}`)
      .join(', ');

    return lang === 'he'
      ? `המלאי מוגבל עבור מוצרים מסוימים. המלאי שנותר: ${details}. 
נא להתאים את ההזמנה או לבחור יום אחר.`
      : `Some items are partially available. Remaining items: ${details}. 
Please adjust your order or choose another day.`;
  }

  // ✅ Weekend block (Saturday)
  const weekday = selectedDate.getDay();
  if (weekday === 6) {
    return lang === 'he'
      ? 'אין משלוחים בשבת.'
      : 'We don’t deliver on Saturdays.';
  }

  // ✅ Same-day delivery cutoff
  const now = new Date();
  if (
    (deliveryMethod === 'delivery_near' || deliveryMethod === 'delivery_far') &&
    isSameDay(now, selectedDate) &&
    now.getHours() >= 17
  ) {
    return lang === 'he'
      ? 'לא ניתן להזמין משלוח ליום זה לאחר השעה 17:00.'
      : 'Same-day delivery is no longer available after 17:00.';
  }

  return null;
}
