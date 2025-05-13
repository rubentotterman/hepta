// components/main-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"; // Forutsetter at du bruker Shadcn UI Button
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "@/components/login-modal";
import Image from "next/image";

export function MainNav() {
  const { isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => setIsLoginModalOpen(true);

  const handleLogoutClick = async () => {
    await logout();
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleContactClick = () => {
    router.push("/contact"); // Endre '/kontakt' til din faktiske kontaktside-URL
  };

  const getLinkClass = (path: string) => {
    const baseStyle = "font-medium text-xs hover:text-orange-400 transition-colors"; 
    return pathname === path 
      ? `text-orange-500 ${baseStyle}`
      : `text-neutral-300 ${baseStyle}`;
  };

  return (
    <div className="flex items-center justify-between h-12 md:h-14">
      
      {/* Venstre "Pilar": Logo og navigasjonslenker */}
      <div 
        className="flex items-center bg-neutral-800 px-3 py-2 md:px-4 rounded-r-lg h-full shadow-md" 
      >
        <Link href="/" className="flex items-center mr-2 md:mr-3 group" aria-label="Hepta Hjem">
          <div className="relative h-4 w-auto sm:h-5 aspect-[4/1]"> 
            <Image
              src="/A_white_hepta.png"
              alt="Hepta Logo"
              layout="fill" 
              objectFit="contain"
              priority 
            />
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1.5 md:gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/" className={getLinkClass("/")}>Hjem</Link>
              <Link href="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
              {/* ... andre innloggede lenker ... */}
            </>
          ) : (
            <>
              <Link href="/" className={getLinkClass("/")}>Hjem</Link>
              <Link href="/tjenester" className={getLinkClass("/tjenester")}>Tjenester</Link>
              <Link href="/om-oss" className={getLinkClass("/om-oss")}>Om oss</Link>
            </>
          )}
        </nav>
      </div>

      {/* Høyre Del: Kontakt-knapp og Logg inn/Logg ut knapp */}
      <div className="flex items-center space-x-2 md:space-x-3 ml-auto"> {/* space-x for mellomrom mellom knapper */}
        <Button
          variant="outline" // Bruker en annen variant for å skille den fra Logg inn/Logg ut
          className="bg-purple-600 text-neutral-300 hover:bg-neutral-800 hover:text-white font-medium px-3 py-1.5 md:px-4 rounded-md text-xs"
          onClick={handleContactClick}
        >
          Kontakt
        </Button>
        
        <Button
          variant="default"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1.5 md:px-4 rounded-md text-xs" 
          onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
        >
          {isLoggedIn ? "Logg ut" : "Logg inn"}
        </Button>
        {/* TODO: Mobilmeny-knapp her */}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}