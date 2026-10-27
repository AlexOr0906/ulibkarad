import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const githubPages = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  site: githubPages ? 'https://alexor0906.github.io' : undefined,
  base: githubPages ? '/ulibkarad/' : '/',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
