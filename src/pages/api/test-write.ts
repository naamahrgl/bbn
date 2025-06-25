// src/pages/api/test-write.ts
import type { APIRoute } from 'astro';
import { appendOrderRow } from '../../lib/googlesheets';

export const GET: APIRoute = async () => {
  try {
    await appendOrderRow([
      new Date().toISOString(),
      'Test Name',
      'email@example.com',
      '052-0000000',
      'somewhere',
      '2025-06-28',
      'pickup',
      'credit',
      'notes here',
      100,
      '[{"productId":"buckwheat","quantity":1}]'
    ]);

    return new Response('✅ Success!');
  } catch (err) {
    console.error(err);
    return new Response('❌ Failed: ' + (err as Error).message, { status: 500 });
  }
};
