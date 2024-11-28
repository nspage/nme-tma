import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProposalForm } from "@/components/features/governance/proposal-form"
import { ProposalVoting } from "@/components/features/governance/proposal-voting"
import { useTonConnect } from "@/lib/hooks/use-ton-connect"
import { useState } from "react"
import { TonConnectButton } from "@tonconnect/ui-react"

export default function TestProposalPage() {
  const { isConnected, wallet } = useTonConnect()
  const [contractAddress, setContractAddress] = useState<string>("")

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Test Proposal System</h1>
        <p className="text-muted-foreground">
          Follow these steps to test the proposal system:
        </p>
      </div>

      <div className="grid gap-6">
        {/* Step 1: Connect Wallet */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Connect Wallet</h2>
          {isConnected ? (
            <div className="space-y-2">
              <p className="text-green-600">✓ Wallet Connected</p>
              <p className="text-sm text-muted-foreground">
                Address: {wallet?.address.slice(0, 8)}...{wallet?.address.slice(-6)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p>First, connect your TON wallet:</p>
              <TonConnectButton />
            </div>
          )}
        </Card>

        {/* Step 2: Create Proposal */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Create Proposal</h2>
          {!isConnected ? (
            <p className="text-muted-foreground">
              Please connect your wallet first
            </p>
          ) : !contractAddress ? (
            <div className="space-y-4">
              <p>Create a test proposal:</p>
              <ProposalForm
                onSuccess={(result) => {
                  setContractAddress(result.contractAddress)
                }}
              />
            </div>
          ) : (
            <p className="text-green-600">✓ Proposal Created</p>
          )}
        </Card>

        {/* Step 3: Vote on Proposal */}
        {contractAddress && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Vote on Proposal</h2>
            <div className="space-y-4">
              <p>Now you can vote on your proposal:</p>
              <ProposalVoting contractAddress={contractAddress} />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
