import type React from "react"
import { MainNav } from "./main-nav"
import { Footer } from "./footer"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <MainNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

