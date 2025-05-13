// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import "./navbar.css"; // Assuming this is for MainNav, ensure it's linked if needed
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { AuthProvider } from "@/contexts/auth-context"
// Import Footer if you want to use it as shown
// import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hepta - Digital Agency",
  description: "Vi forvandler digitale rom til vekstreiser",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="no" suppressHydrationWarning className="h-full"> {/* Ensure html can be 100% height */}
      <body className={`${inter.className} flex flex-col h-full bg-background text-foreground`}> {/* Make body flex-col and full height */}
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <MainNav /> {/* This will take its natural height */}
          <main className="flex-grow overflow-y-auto"> {/* main takes remaining space and allows scrolling */}
            {children}
          </main>
          {/* <Footer />  // Example: If you add a Footer component */}
        </AuthProvider>
      </ThemeProvider>
      </body>
      </html>
  )
}