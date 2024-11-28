import { useTonConnectUI } from '@tonconnect/ui-react'
import { useCallback, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface TonAuthState {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  isLoading: boolean
}

export function useTonAuth(): TonAuthState {
  const [tonConnectUI, setOptions] = useTonConnectUI()
  const { toast } = useToast()

  // Get current wallet state
  const isConnected = tonConnectUI.connected
  const address = tonConnectUI.account?.address || null
  const isLoading = tonConnectUI.loading

  // Handle connection
  const connect = useCallback(async () => {
    try {
      await tonConnectUI.connectWallet()
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your TON wallet.",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your TON wallet. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to connect wallet:", error)
    }
  }, [tonConnectUI, toast])

  // Handle disconnection
  const disconnect = useCallback(() => {
    try {
      tonConnectUI.disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from your TON wallet.",
      })
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect from your TON wallet. Please try again.",
        variant: "destructive",
      })
      console.error("Failed to disconnect wallet:", error)
    }
  }, [tonConnectUI, toast])

  // Initialize TON Connect
  useEffect(() => {
    setOptions({
      manifestUrl: import.meta.env.VITE_TON_CONNECT_MANIFEST_URL,
      walletsListSource: import.meta.env.VITE_TON_CONNECT_WALLETS_LIST_URL,
      retryLoadingCount: 3,
    })
  }, [setOptions])

  return {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
  }
}
