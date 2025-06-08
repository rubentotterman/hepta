// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/progress-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hepta",
    description: "Hepta - Din partner for digitalisering",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="no" suppressHydrationWarning className="h-full overflow-x-hidden">
            <body className={`${inter.className} h-full bg-background text-foreground overflow-x-hidden`}>
                <ProgressBar />
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <AuthProvider serverSession={null}>
                        <div className="flex flex-col min-h-screen overflow-x-hidden w-full relative">
                            <MainNav />
                            <main className="flex-grow overflow-x-hidden w-full relative">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}