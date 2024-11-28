import { useTonConnectUI } from '@tonconnect/ui-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI()
  const [isInitialized, setIsInitialized] = useState(false)

  const wallet = tonConnectUI.account
  const isConnected = tonConnectUI.connected
  const isLoading = tonConnectUI.loading

  const connect = useCallback(async () => {
    try {
      await tonConnectUI.connectWallet()
      toast.success('Wallet connected successfully!')
    } catch (error) {
      toast.error('Failed to connect wallet: ' + (error instanceof Error ? error.message : 'Unknown error'))
      throw error
    }
  }, [tonConnectUI])

  const disconnect = useCallback(() => {
    try {
      tonConnectUI.disconnect()
      toast.success('Wallet disconnected')
    } catch (error) {
      toast.error('Failed to disconnect wallet: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }, [tonConnectUI])

  // Restore connection on page load
  useEffect(() => {
    let isMounted = true

    const initConnection = async () => {
      try {
        const restored = await tonConnectUI.connectionRestored
        if (isMounted) {
          setIsInitialized(true)
          if (restored) {
            toast.success('Wallet connection restored')
          }
        }
      } catch (error) {
        console.error('Failed to restore connection:', error)
        if (isMounted) {
          setIsInitialized(true)
        }
      }
    }

    initConnection()

    return () => {
      isMounted = false
    }
  }, [tonConnectUI])

  // Add debug logging
  useEffect(() => {
    console.log('TON Connect state:', {
      wallet,
      isConnected,
      isLoading,
      isInitialized
    })
  }, [wallet, isConnected, isLoading, isInitialized])

  return {
    wallet,
    isConnected: isInitialized && isConnected && !!wallet?.address,
    isLoading: !isInitialized || isLoading,
    connect,
    disconnect,
  }
}
