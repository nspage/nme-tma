import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import { Buffer } from 'buffer'

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
      },
    },
    define: {
      global: 'globalThis',
      'process.env': process.env,
      Buffer: ['buffer', 'Buffer'],
    },
    optimizeDeps: {
      include: ['buffer'],
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})
