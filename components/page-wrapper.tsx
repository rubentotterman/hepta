// components/page-wrapper.tsx
import type React from "react"
import { MainNav } from "./main-nav"
import { Footer } from "./footer"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* FJERNET sticky top-0 z-50. Beholdt py-6 for luft, eller juster/fjern. */}
      {/* Beholdt skygge foreløpig, kan fjernes hvis ønskelig. */}
      <header className="bg-black shadow-md py-6"> 
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Standard container padding */}
          <MainNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
    </div>
  )
}