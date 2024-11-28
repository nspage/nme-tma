import { useTonConnectUI } from '@tonconnect/ui-react'
import { useCallback, useEffect } from 'react'

export interface WalletState {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

export function useWallet(): WalletState {
  const [tonConnectUI] = useTonConnectUI()

  // Get current wallet state
  const isConnected = tonConnectUI.connected
  const address = tonConnectUI.account?.address || null

  // Handle connection
  const connect = useCallback(async () => {
    try {
      await tonConnectUI.connectWallet()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }, [tonConnectUI])

  // Handle disconnection
  const disconnect = useCallback(() => {
    try {
      tonConnectUI.disconnect()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }, [tonConnectUI])

  // Restore connection on page load
  useEffect(() => {
    tonConnectUI.connectionRestored.then((restored) => {
      console.log("Wallet connection restored:", restored)
    })
  }, [tonConnectUI])

  return {
    isConnected,
    address,
    connect,
    disconnect,
  }
}
