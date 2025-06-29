import { isBefore, isSameDay, format } from 'date-fns';

type DayColor = 'green' | 'orange' | 'red';

interface OrderContext {
  selectedDate: Date | undefined;
  deliveryMethod: 'pickup' | 'delivery_near' | 'delivery_far';
  dayColors: Record<string, DayColor>;
}

export function isOrderLegal({
  selectedDate,
  deliveryMethod,
  dayColors,
}: OrderContext): string | null {
  if (!selectedDate) return 'Please select a delivery date.';

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // ✅ Condition 1: Date must be green
  if (dayColors[dateKey] !== 'green') {
    return 'Selected date is not available for all items.';
  }

  // ✅ Condition 2: Must be a working day (e.g. Sunday to Friday)
  const weekday = selectedDate.getDay(); // Sunday=0, Saturday=6
  if (weekday === 6) {
    return 'We don’t deliver on Saturdays.';
  }

  // ✅ Condition 3: Same-day delivery cutoff at 17:00
  const now = new Date();
  if (
    (deliveryMethod === 'delivery_near' || deliveryMethod === 'delivery_far') &&
    isSameDay(now, selectedDate) &&
    now.getHours() >= 17
  ) {
    return 'Same-day delivery is no longer available after 17:00.';
  }

  return null; // ✅ All good!
}
