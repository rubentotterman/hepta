import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PageWrapper } from "@/components/page-wrapper"
import { AuthProvider } from "@/contexts/auth-context"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hepta Dashboard",
  description: "A modern dashboard built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <PageWrapper>{children}</PageWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

