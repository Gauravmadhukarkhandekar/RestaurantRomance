import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-worklets': path.resolve(__dirname, 'src/utils/worklets-shim'), 
      'react-native-worklets/package.json': path.resolve(__dirname, 'src/utils/worklets-shim/package.json'), 
      'react-native/Libraries/Renderer/shims/ReactNative': 'react-native-web/dist/exports/render',
      'react-native/Libraries/Renderer/shims/ReactFabric': path.resolve(__dirname, 'src/utils/shim.js'),
      'react-native/Libraries/ReactNative/AppContainer': path.resolve(__dirname, 'src/utils/shim.js'),
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, 'src/utils/shim.js'),
      'react-native/Libraries/Pressability/PressabilityDebug': path.resolve(__dirname, 'src/utils/shim.js'),
      'react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry': path.resolve(__dirname, 'src/utils/shim.js'),
      'styled-components/native': 'styled-components',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.web.jsx', '.tsx', '.ts', '.js', '.jsx'],
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.web.js', '.js', '.ts', '.jsx', '.tsx'],
      loader: {
        '.js': 'jsx',
      },
    },
    include: [
      'react',
      'react-dom',
      'react-native-web',
      'react-native-reanimated',
      'react-native-gesture-handler',
    ],
  },
  build: {
    commonjsOptions: {
      include: [/react-native-reanimated/, /node_modules/],
    },
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(true),
  },
  server: {
    port: 3000,
  }
});
