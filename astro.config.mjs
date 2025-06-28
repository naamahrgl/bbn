// @ts-check
import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
   output: "server",
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()]
  }
});