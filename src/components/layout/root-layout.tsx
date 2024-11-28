import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { Footer } from "./footer"

console.log("RootLayout imported");

export function RootLayout() {
  console.log("RootLayout rendering");
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
