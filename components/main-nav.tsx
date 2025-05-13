"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    router.push("/contact");
  };

  const getLinkClass = (path: string) => {
    const baseStyle = "font-medium text-xs hover:text-orange-400 transition-colors"; 
    return pathname === path 
      ? `text-orange-500 ${baseStyle}`
      : `text-neutral-300 ${baseStyle}`;
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-neutral-950 border-b border-neutral-800 px-4 md:px-6 py-2 shadow-sm flex items-center justify-between">
      
      {/* Left: Logo + Links */}
      <div className="flex items-center bg-neutral-800 px-3 py-2 md:px-4 rounded-r-lg h-full shadow-md">
        <Link href="/" className="flex items-center mr-3 group" aria-label="Hepta Hjem">
          <div className="relative h-5 w-auto aspect-[4/1]">
            <Image
              src="/A_white_hepta.png"
              alt="Hepta Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/" className={getLinkClass("/")}>Hjem</Link>
              <Link href="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
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

      {/* Right: Actions */}
      <div className="flex items-center space-x-3 ml-auto">
        <Button
          variant="outline"
          className="bg-purple-600 text-neutral-300 hover:bg-purple-700 hover:text-white font-medium px-4 py-1.5 rounded-full text-xs"
          onClick={handleContactClick}
        >
          Kontakt
        </Button>
        
        <Button
          variant="default"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-1.5 rounded-full text-xs"
          onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
        >
          {isLoggedIn ? "Logg ut" : "Logg inn"}
        </Button>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
