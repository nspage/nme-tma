import { createContext, useContext, useState, useCallback, type PropsWithChildren } from 'react'
import { WalletInfo, walletService } from '@/lib/wallet'
import WebApp from '@twa-dev/sdk'

interface WalletContextType {
  isConnected: boolean
  walletInfo: WalletInfo | null
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: PropsWithChildren) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      const info = await walletService.connect()
      setWalletInfo(info)
      setIsConnected(true)
      WebApp.showAlert('Wallet connected successfully!')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      WebApp.showAlert('Failed to connect wallet. Please try again.')
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await walletService.disconnect()
      setWalletInfo(null)
      setIsConnected(false)
      WebApp.showAlert('Wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      WebApp.showAlert('Failed to disconnect wallet')
      throw error
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletInfo,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
