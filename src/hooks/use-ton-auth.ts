import { useTonConnectUI } from '@tonconnect/ui-react'
import { useCallback, useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

export function useTonAuth() {
  const [tonConnectUI] = useTonConnectUI()
  const [isTwa, setIsTwa] = useState(false)

  useEffect(() => {
    // Check if running in Telegram Web App
    const initTwa = () => {
      try {
        WebApp.ready()
        setIsTwa(true)
      } catch (error) {
        console.warn('Not running in Telegram Web App')
        setIsTwa(false)
      }
    }
    initTwa()
  }, [])

  const isConnected = tonConnectUI.connected
  const wallet = tonConnectUI.account

  const showNotification = (message: string, isError = false) => {
    if (isTwa) {
      WebApp.showPopup({
        title: isError ? 'Error' : 'Success',
        message,
        buttons: [{ type: 'close' }]
      })
    } else {
      console.log(message)
    }
  }
  
  const connect = useCallback(async () => {
    try {
      await tonConnectUI.connectWallet()
      showNotification('Wallet connected successfully!')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      showNotification('Failed to connect wallet. Please try again.', true)
    }
  }, [tonConnectUI])

  const disconnect = useCallback(async () => {
    try {
      await tonConnectUI.disconnect()
      showNotification('Wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      showNotification('Failed to disconnect wallet', true)
    }
  }, [tonConnectUI])

  const requestTransaction = useCallback(async (params: any) => {
    try {
      if (!isConnected) {
        throw new Error('Wallet not connected')
      }

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        ...params,
      })

      showNotification('Transaction sent successfully!')
      return result
    } catch (error) {
      console.error('Transaction failed:', error)
      showNotification('Transaction failed. Please try again.', true)
      throw error
    }
  }, [tonConnectUI, isConnected])

  return {
    isConnected,
    wallet,
    isTwa,
    connect,
    disconnect,
    requestTransaction,
    showNotification,
  }
}
