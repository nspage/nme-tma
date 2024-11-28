import { CHAIN } from '@tonconnect/protocol'

// Use local manifest in development, production URL otherwise
export const manifestUrl = import.meta.env.DEV 
  ? 'http://localhost:5173/tonconnect-manifest.json'
  : 'https://nme-event-badge-tma.vercel.app/tonconnect-manifest.json'

export const tonConnectOptions = {
  manifestUrl,
  buttonRootId: 'ton-connect-button',
  walletsListConfiguration: {
    includeWallets: [
      'Tonkeeper',
      'OpenMask',
      'MyTonWallet',
      'TonHub'
    ]
  },
  actionsConfiguration: {
    twaReturnUrl: import.meta.env.DEV ? 'http://localhost:5173' : 'https://nme-event-badge-tma.vercel.app',
    skipRedirectToWallet: true, // Handle wallet interactions in TWA
  },
  uiPreferences: {
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT',
    colorsSet: {
      accent: '#2563eb', // Tailwind blue-600
      background: {
        primary: '#ffffff',
        secondary: '#f3f4f6', // Tailwind gray-100
        segment: {
          active: '#2563eb',
          inactive: '#9ca3af', // Tailwind gray-400
        }
      }
    }
  }
}
