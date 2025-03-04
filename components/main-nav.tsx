"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"

export function MainNav() {
  const { isLoggedIn, logout, checkAuth, user } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log("MainNav - Auth state:", { isLoggedIn, user })
    checkAuth().then(({ isLoggedIn, user }) => {
      console.log("MainNav - Auth state after checkAuth:", { isLoggedIn, user })
    })
  }, [checkAuth, isLoggedIn, user])

  const handleLoginClick = () => {
    console.log("Login button clicked, opening modal")
    setIsLoginModalOpen(true)
  }

  const handleLogoutClick = async () => {
    await logout()
    if (pathname !== "/") {
      router.push("/")
    }
  }

  // Force re-render when auth state changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [checkAuth])

  return (
    <div className="flex w-full items-center justify-between py-4">
      <div>
        <Link href="/" className="text-xl font-bold">
          Hepta
        </Link>
      </div>
      <nav className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <Link href="/" className={`font-medium ${pathname === "/" ? "text-orange-500" : "text-white"}`}>
              Hjem
            </Link>
            <Link
              href="/dashboard"
              className={`font-medium ${pathname === "/dashboard" ? "text-orange-500" : "text-white"}`}
            >
              Dashboard
            </Link>
            <Link
              href="/faktura"
              className={`font-medium ${pathname === "/faktura" ? "text-orange-500" : "text-white"}`}
            >
              Faktura
            </Link>
            <Link
              href="/innstillinger"
              className={`font-medium ${pathname === "/innstillinger" ? "text-orange-500" : "text-white"}`}
            >
              Innstillinger
            </Link>
          </>
        ) : (
          <>
            <Link href="/" className="font-medium">
              Hjem
            </Link>
            <Link href="/tjenester" className="font-medium">
              Tjenester
            </Link>
            <Link href="/om-oss" className="font-medium">
              Om oss
            </Link>
          </>
        )}
        <Button
          variant="default"
          className="bg-orange-500 hover:bg-orange-600"
          onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
        >
          {isLoggedIn ? "Logg ut" : "Logg inn"}
        </Button>
      </nav>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}

