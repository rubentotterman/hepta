import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PageWrapper } from "@/components/page-wrapper"
import { AuthProvider } from "@/contexts/auth-context"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hepta Dashboard",
  description: "A modern dashboard built with Next.js",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider serverSession={session}>
            <PageWrapper>{children}</PageWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

