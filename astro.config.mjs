import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import {buildSearchIndex} from './scripts/build-search-index.mjs';

const githubPages = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  site: githubPages ? 'https://alexor0906.github.io' : undefined,
  base: githubPages ? '/ulibkarad/' : '/',
  devToolbar: { enabled: false },
  integrations:[{name:'orthofamily-search',hooks:{'astro:build:done':async({dir})=>buildSearchIndex(dir,githubPages?'/ulibkarad/':'/')}}],
  vite: {
    plugins: [tailwindcss()],
  },
});
