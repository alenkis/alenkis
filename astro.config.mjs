import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://alenkis.com',
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      themeCssSelector: (theme) => {
        if (theme.name === 'github-dark') {
          return '.dark';
        }
        return ':root:not(.dark)';
      },
      styleOverrides: {
        codeFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        uiFontFamily: 'system-ui, -apple-system, sans-serif',
      },
    }),
    sitemap(),
  ],
});
