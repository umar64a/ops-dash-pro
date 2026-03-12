import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
function hashFile(filePath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}
const videos = [
  'day.mp4',
  'day-clouds.mp4',
  'day-rain.mp4',
  'night.mp4',
  'night-clouds.mp4',
  'night-rain.mp4',
  'day-snow.mp4',
  'night-snow.mp4',
  'thunderstorm.mp4',
  'day-smoke.mp4',
  'night-smoke.mp4',
];
const videoManifestEntries = videos.map((file) => {
  const filePath = path.resolve(__dirname, 'public/videos', file);
  return { url: `/videos/${file}`, revision: hashFile(filePath) };
});
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      devOptions: { enabled: true },
      manifest: {
        id: '/login',
        name: 'OpsDash Pro',
        short_name: 'OpsDash',
        start_url: '/login',
        display: 'standalone',
        background_color: '#1e293b',
        theme_color: '#1e293b',
        lang: 'en',
        scope: '/',
        screenshots: [
          {
            src: '/screenshots/dashboard.png',
            sizes: '1353x597',
            type: 'image/png',
            label: 'Dashboard',
          },
          {
            src: '/screenshots/tasks.png',
            sizes: '1366x608',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
        icons: [
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        additionalManifestEntries: videoManifestEntries,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 15 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'reverse-geocode-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/fakestoreapi\.com\/img\/.*\.(png|jpg|jpeg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'product-images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^\/videos\/.*\.mp4$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'weather-videos-cache',
              matchOptions: { ignoreSearch: true },
              expiration: { maxEntries: 20, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'static-assets-cache', expiration: { maxEntries: 50 } },
          },
        ],
      },
    }),
  ],
});
