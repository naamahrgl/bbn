// @ts-check
import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://breadbynaama.com',

  integrations: [react(), sitemap()],
   output: "server",
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()]
  }
});