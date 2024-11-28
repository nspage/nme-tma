import { getHttpEndpoint } from "@orbs-network/ton-access"
import { TonClient } from "ton"
import { useEffect, useState } from "react"

export function useTonClient() {
  const [client, setClient] = useState<TonClient | null>(null)

  useEffect(() => {
    async function init() {
      try {
        // Get endpoint for testnet
        const endpoint = await getHttpEndpoint({
          network: "testnet",
        })

        // Create client
        const client = new TonClient({
          endpoint,
        })

        setClient(client)
      } catch (error) {
        console.error("Failed to create TON client:", error)
      }
    }

    init()
  }, [])

  return client
}
