"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function MainNav() {
  const { isLoggedIn, login, logout } = useAuth()

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
        <Button variant="default" className="bg-orange-500 hover:bg-orange-600" onClick={isLoggedIn ? logout : login}>
          {isLoggedIn ? "Logg ut" : "Logg inn"}
        </Button>
      </nav>
    </div>
  )
}

