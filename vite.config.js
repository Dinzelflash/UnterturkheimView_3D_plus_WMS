import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  define: {
    CESIUM_BASE_URL: JSON.stringify('cesiumStatic'),
  },
});