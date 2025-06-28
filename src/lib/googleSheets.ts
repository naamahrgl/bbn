// src/lib/googleSheets.ts







const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbz8KegmHjmbNPj5BxcVhf5aq4K9-3-OzklDJMdaRUbfumEG0F5db6BRBWrqbMvdSBT1/exec';

export async function getExistingOrdersMap(): Promise<Record<string, Record<string, number>>> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getInventoryAndLimits`);
  const data = await response.json();
  return data.ordersMap || {};
}

export async function getDailyLimits(): Promise<Record<string, number>> {
  const response = await fetch(`${APPS_SCRIPT_BASE}?action=getInventoryAndLimits`);
  const data = await response.json();
  return data.limits || {};
}
