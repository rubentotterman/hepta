"use client"

import { ContactForm } from "@/components/ui/contact-form"
import { useEffect } from "react"

export default function ContactPage() {
  useEffect(() => {
    // Dette vil skjule navigasjonsmenyen når siden lastes
    const navbar = document.querySelector("header") || document.querySelector("nav");
    
    if (navbar) {
      navbar.style.display = "none";
    }
    
    // Sikre at kroppen ikke har scrolling
    document.body.style.overflow = "hidden";
    
    // Denne funksjonen vil kjøre når komponenten fjernes fra DOM
    return () => {
      if (navbar) {
        navbar.style.display = ""; // Gjenoppretter den opprinnelige displaystilen
      }
      document.body.style.overflow = ""; // Gjenoppretter scrolling
    };
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-background to-background" />
      
      <ContactForm />
      
      <style jsx global>{`
        /* Skjul alle potensielle navigasjonselementer */
        header, nav, .navbar, .nav, .header, .top-bar {
          display: none !important;
        }
        
        /* Sikre at body og html ikke har scrolling */
        html, body {
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  )
}