import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'TON Event Badge Platform',
          short_name: 'TON Badges',
          description: 'Web3 event badge management platform',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      port: 5173,
      strictPort: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        buffer: 'buffer',
      },
    },
    define: {
      global: 'globalThis',
      'process.env.VITE_PROPOSAL_CONTRACT_CODE': JSON.stringify(env.VITE_PROPOSAL_CONTRACT_CODE),
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      }
    },
    build: {
      sourcemap: !isProd,
      minify: isProd ? 'esbuild' : false,
      target: 'esnext',
      rollupOptions: {
        plugins: [],
        output: {
          manualChunks: {
            'ton-core': ['ton-core'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@tonconnect/ui-react', '@radix-ui/react-icons', 'sonner'],
          },
        },
      },
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1024,
      cssCodeSplit: true,
      reportCompressedSize: true,
    },
    preview: {
      port: 4173,
      strictPort: true,
    }
  }
})
