// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/footer"; // Make sure this path is correct

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hepta - Digital Agency",
    description: "Vi forvandler digitale rom til vekstreiser",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="no" suppressHydrationWarning className="h-full">
        {/* The body needs to allow its child (ThemeProvider's output) to fill it. */}
        <body className={`${inter.className} h-full bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <AuthProvider>
                {/* This div is crucial: it sets up the main flex column for your page structure.
                It takes at least the full screen height. */}
                <div className="flex flex-col min-h-screen">
                    <MainNav />
                    {/* Main content area will grow to fill available space, pushing footer down. */}
                    <main className="flex-grow overflow-y-auto">
                        {children}
                    </main>
                    {/* Footer will be at the bottom. */}
                    <Footer />
                </div>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}