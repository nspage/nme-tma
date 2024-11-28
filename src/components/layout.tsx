import { ReactNode } from "react"
import { Navigation } from "./navigation"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 pt-4">{children}</main>
    </div>
  )
}
