import { SendTransactionRequest, useTonConnectUI } from '@tonconnect/ui-react'
import { useState, useCallback } from 'react'

export interface TransactionState {
  isLoading: boolean
  error: Error | null
  sendTransaction: (transaction: Omit<SendTransactionRequest, 'validUntil'>) => Promise<void>
}

export function useWalletTransaction(): TransactionState {
  const [tonConnectUI] = useTonConnectUI()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendTransaction = useCallback(async (transaction: Omit<SendTransactionRequest, 'validUntil'>) => {
    try {
      setIsLoading(true)
      setError(null)

      // Add validUntil - 24 hours from now
      const validUntil = Math.floor(Date.now() / 1000) + 24 * 60 * 60
      const fullTransaction = {
        ...transaction,
        validUntil
      }

      // Send transaction
      const result = await tonConnectUI.sendTransaction(fullTransaction)
      
      // Wait for confirmation
      await tonConnectUI.awaitTransaction(result.boc)
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Transaction failed'))
      console.error('Transaction failed:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [tonConnectUI])

  return {
    isLoading,
    error,
    sendTransaction
  }
}
