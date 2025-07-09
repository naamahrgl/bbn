// src/pages/api/coupon.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code')?.trim().toUpperCase();
  if (!code) {
    return new Response(JSON.stringify({ valid: false, error: 'Missing code' }), { status: 400 });
  }

  // URL של סקריפט האפליקציה שלך (תעדכני לפי שלך)
const scriptUrl = `https://script.google.com/macros/s/AKfycbzKiSNgDjH6O0MYhMW8EyuMELxaKy3MOwxjdDLCn9BIuYhKgoplV6-n6Y61f_qTOwj9/exec?action=getCoupon&code=${encodeURIComponent(code)}`;

  try {
    const res = await fetch(scriptUrl);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ valid: false, error: 'Server error' }), { status: 500 });
  }
};
