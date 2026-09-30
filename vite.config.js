import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

// Inlines generated wavy SVG paths into index.html ({{BLOB_*}} tokens).
const blobs = () => ({
  name: 'inline-blobs',
  transformIndexHtml: (html) =>
    html
      .replaceAll('{{BLOB_HERO}}', readFileSync('src/assets/blob-hero.txt', 'utf8').trim())
      .replaceAll('{{BLOB_FRAME}}', readFileSync('src/assets/blob-frame.txt', 'utf8').trim()),
});

export default defineConfig({
  plugins: [blobs()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
