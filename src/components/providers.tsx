import { type PropsWithChildren } from "react"
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { tonConnectOptions } from '@/lib/ton-connect'

export function Providers({ children }: PropsWithChildren) {
  return (
    <TonConnectUIProvider manifestUrl={tonConnectOptions.manifestUrl}>
      <div className="min-h-screen bg-background font-sans antialiased">
        {children}
      </div>
    </TonConnectUIProvider>
  )
}
