"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "@/components/login-modal";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function MainNav() {
  const { isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleContactClick = () => {
    router.push("/contact");
    setIsMobileMenuOpen(false);
  };

  const getLinkClass = (path: string) => {
    const baseStyle = "font-medium text-sm hover:text-blue-400 transition-colors";
    return pathname === path
      ? `text-blue-500 ${baseStyle}`
      : `text-neutral-300 ${baseStyle}`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-neutral-950 border-b border-neutral-800 px-4 md:px-6 py-2 shadow-sm flex items-center justify-between">
        {/* Logo */}
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
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-4 ml-4">
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

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3 ml-auto">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-full text-sm"
            onClick={handleContactClick}
          >
            Kontakt
          </Button>
          <Button
            className={`${
              isLoggedIn
                ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                : "bg-white hover:bg-gray-100 text-blue-700"
            } font-medium px-4 py-1.5 rounded-full text-sm`}
            onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
          >
            {isLoggedIn ? "Logg ut" : "Logg inn"}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="fixed top-14 left-0 w-full bg-neutral-950 border-t border-neutral-800 px-6 py-4 z-40 md:hidden shadow-lg animate-fade-in space-y-4">
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/" className={getLinkClass("/")} onClick={() => setIsMobileMenuOpen(false)}>Hjem</Link>
                <Link href="/dashboard" className={getLinkClass("/dashboard")} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/" className={getLinkClass("/")} onClick={() => setIsMobileMenuOpen(false)}>Hjem</Link>
                <Link href="/tjenester" className={getLinkClass("/tjenester")} onClick={() => setIsMobileMenuOpen(false)}>Tjenester</Link>
                <Link href="/om-oss" className={getLinkClass("/om-oss")} onClick={() => setIsMobileMenuOpen(false)}>Om oss</Link>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-sm"
              onClick={handleContactClick}
            >
              Kontakt
            </Button>
            <Button
              className={`${
                isLoggedIn
                  ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                  : "bg-white hover:bg-gray-100 text-blue-700"
              } font-medium rounded-full text-sm`}
              onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
            >
              {isLoggedIn ? "Logg ut" : "Logg inn"}
            </Button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
