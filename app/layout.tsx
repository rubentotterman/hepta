// app/layout.tsx
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css" // Sørg for at globals.css ikke har motstridende height/margin/padding for html/body
import { ThemeProvider } from "@/components/theme-provider"
import { PageWrapper } from "@/components/page-wrapper"
import { AuthProvider } from "@/contexts/auth-context"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Script from "next/script"

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
    <html lang="en" className="dark h-full bg-black"> {/* Lade til h-full og en base bg-black */}
      <body className={`${inter.className} h-full`}> {/* Lade til h-full */}
        {/* ThemeProvider og AuthProvider rendrer vanligvis ikke egne DOM-elementer som trenger styling, */}
        {/* men hvis de gjør det (f.eks. en div), kan de trenge h-full også. */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider serverSession={session}>
            {/* PageWrapper må være satt opp til å bruke den tilgjengelige høyden */}
            <PageWrapper>{children}</PageWrapper> 
          </AuthProvider>
        </ThemeProvider>

        <Script id="check-test-session" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              const testSession = localStorage.getItem('testSession');
              if (testSession) {
                document.cookie = 'hasTestSession=true; path=/';
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}