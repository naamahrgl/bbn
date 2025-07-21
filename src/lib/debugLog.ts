// src/lib/debugLog.ts

export async function logToSheet(data: any) {
  await fetch('https://www.breadbynaama.com/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'debug_' + Math.random().toString(36).substring(2, 10),
      customerName: data.step,
      notes: JSON.stringify(data),
      items: [],
      totalAmount: 0,
      deliveryDate: '',
      deliveryMethod: data.step,
      status: 'callback-log'
    })
  });
}
