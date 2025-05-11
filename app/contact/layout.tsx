// contact/layout.tsx
import type React from "react"; // Importer type React for klarhet

// Denne layouten setter opp <html> og <body> for /contact-ruten
export default function ContactRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    // html og body MÅ ha h-full for at min-h-screen skal fungere på barn-elementer
    // bg-black og text-white her setter standard for denne ruten hvis ikke overstyrt
    <html lang="no" className="h-full bg-black text-white">
      <body className="h-full"> {/* inter.className kan legges til hvis du vil ha Inter-fonten her også fra app/layout.tsx */}
        {/* 
          Children her vil være din contact/page.tsx.
          Hvis contact/page.tsx rendrer ContactForm-komponenten, 
          og ContactForm-komponenten har sin egen ytre div med:
          `className="flex flex-col items-center justify-center min-h-screen w-full ..."`
          så skal sentreringen nå fungere.
        */}
        {children}
        {/* <CookieBanner /> // Fjernet denne linjen */}
      </body>
    </html>
  );
}