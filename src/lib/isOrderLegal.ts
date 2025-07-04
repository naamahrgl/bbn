// lib/isOrderLegal.ts
import { format, isSameDay, differenceInCalendarDays } from 'date-fns';
import { getProductById } from './products';

type DayColorEntry = {
  status: 'green' | 'orange' | 'red' | 'gray';
  soldOutProducts?: string[];
  partialAvailability?: Record<string, number>;
};

interface OrderContext {
  selectedDate: Date | undefined;
  deliveryMethod: 'pickup' | 'delivery_near' | 'delivery_far';
  dayColors: Record<string, DayColorEntry>;
  lang: 'he' | 'en';
}

const messages = {
  he: {
    selectDate: 'יש לבחור תאריך משלוח.',
    tooFar: 'תאריך לא חוקי. נא ליצור קשר עם נעמה להזמנות עתידיות.',
    closed: 'סליחה, אנחנו סגורים בתאריך זה! נסי לבחור תאריך אחר.',
    saturday: 'אין משלוחים בשבת.',
    cutoff: 'לא ניתן להזמין משלוח ליום זה לאחר השעה 17:00.',
    soldOut: (names: string) =>
      `המוצרים הבאים אזלו בתאריך שנבחר: ${names}. נא לשנות את ההזמנה או לבחור יום אחר.`,
    partial: (details: string) =>
      `המלאי מוגבל עבור חלק מהמוצרים: ${details}. נא להתאים את ההזמנה.`
  },
  en: {
    selectDate: 'Please select a delivery date.',
    tooFar: 'Date is too far ahead. Please contact Naama for special orders.',
    closed: 'Sorry, we’re closed on this day. Please choose another.',
    saturday: 'We do not deliver on Saturdays.',
    cutoff: 'Same-day delivery cutoff is 17:00.',
    soldOut: (names: string) =>
      `The following products are sold out: ${names}. Please choose a different date or adjust your order.`,
    partial: (details: string) =>
      `Some items have limited availability: ${details}. Please adjust your order.`
  }
};

export function isOrderLegal({
  selectedDate,
  deliveryMethod,
  dayColors,
  lang
}: OrderContext): string | null {
  const t = messages[lang];

  if (!selectedDate) return t.selectDate;

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const colorEntry = dayColors[dateKey];

  if (differenceInCalendarDays(selectedDate, new Date()) > 21) {
    return t.tooFar;
  }

  if (!colorEntry || colorEntry.status === 'gray') {
    return t.closed;
  }

  if (colorEntry.status === 'red' && colorEntry.soldOutProducts?.length) {
    const names = colorEntry.soldOutProducts
      .map(pid => getProductById(pid).name[lang])
      .join(', ');
    return t.soldOut(names);
  }

  if (colorEntry.status === 'orange' && colorEntry.partialAvailability) {
    const details = Object.entries(colorEntry.partialAvailability)
      .map(([pid, qty]) => `${qty} ${getProductById(pid).name[lang]}`)
      .join(', ');
    return t.partial(details);
  }

  if (selectedDate.getDay() === 6) {
    return t.saturday;
  }

  const now = new Date();
  if (
    (deliveryMethod === 'delivery_near' || deliveryMethod === 'delivery_far') &&
    isSameDay(now, selectedDate) &&
    now.getHours() >= 17
  ) {
    return t.cutoff;
  }

  return null;
}
