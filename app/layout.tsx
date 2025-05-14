// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hepta - Digital Agency",
  description: "Vi forvandler digitale rom til vekstreiser",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} flex flex-col h-full bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MainNav /> {/* Navbar rendered here */}
            <main className="flex-grow overflow-y-auto">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
