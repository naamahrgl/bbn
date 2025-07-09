const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec';

export async function getExistingOrdersMap(): Promise<Record<string, Record<string, number>>> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getInventoryAndLimits`);
  const data = await response.json();
  return data.ordersMap || {};
}

export async function getPerDateLimits(): Promise<Record<string, Record<string, number>>> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getInventoryAndLimits`);
  const data = await response.json();
  return data.perDateLimits || {};
}
