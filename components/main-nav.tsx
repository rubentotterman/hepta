"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"

export function MainNav() {
  const { isLoggedIn, logout, checkAuth } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogoutClick = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="flex w-full items-center justify-between py-4">
      <Link href="/" className="text-xl font-bold">
        Hepta
      </Link>
      <nav className="flex items-center gap-6">
        {!isLoggedIn && (
          <>
            <Link href="/">Hjem</Link>
            <Link href="/tjenester">Tjenester</Link>
            <Link href="/om-oss">Om oss</Link>
          </>
        )}
        {isLoggedIn && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/faktura">Faktura</Link>
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

