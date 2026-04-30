import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.web.jsx', '.tsx', '.ts', '.js', '.jsx'],
  },
  define: {
    global: 'window',
  },
  server: {
    port: 3000,
  }
});
