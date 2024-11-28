import { Button, ButtonProps } from "@/components/ui/button"
import { useWalletTransaction } from "@/lib/hooks/use-wallet-transaction"
import { SendTransactionRequest } from "@tonconnect/ui-react"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TransactionButtonProps extends Omit<ButtonProps, "onClick"> {
  transaction: Omit<SendTransactionRequest, "validUntil">
  onSuccess?: () => void
  onError?: (error: Error) => void
  children: React.ReactNode
}

export function TransactionButton({
  transaction,
  onSuccess,
  onError,
  children,
  disabled,
  ...props
}: TransactionButtonProps) {
  const { sendTransaction, isLoading } = useWalletTransaction()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClick = async () => {
    try {
      setIsProcessing(true)
      await sendTransaction(transaction)
      toast.success("Transaction successful")
      onSuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Transaction failed")
      toast.error(err.message)
      onError?.(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading || isProcessing}
      {...props}
    >
      {(isLoading || isProcessing) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Button>
  )
}
