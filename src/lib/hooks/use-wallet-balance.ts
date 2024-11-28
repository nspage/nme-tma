import { useTonConnectUI } from '@tonconnect/ui-react'
import { useEffect, useState } from 'react'
import { Address, fromNano } from 'ton-core'
import { useTonClient } from './use-ton-client'

export interface WalletBalance {
  balance: string
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useWalletBalance(address: string | null): WalletBalance {
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const client = useTonClient()

  const fetchBalance = async () => {
    if (!address || !client) {
      setBalance('0')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const walletAddress = Address.parse(address)
      const balance = await client.getBalance(walletAddress)
      setBalance(fromNano(balance))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch balance'))
      console.error('Failed to fetch balance:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
    // Set up polling for balance updates
    const interval = setInterval(fetchBalance, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [address, client])

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance
  }
}
