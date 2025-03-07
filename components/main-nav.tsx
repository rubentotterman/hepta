"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"

export function MainNav() {
  const { isLoggedIn, logout, user, userRole } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Use a ref to prevent unnecessary re-renders
  const initialRenderDone = useRef(false)

  // Only log auth state on initial render and when it changes
  useEffect(() => {
    if (!initialRenderDone.current) {
      console.log("MainNav - Initial auth state:", { isLoggedIn, user, userRole })
      initialRenderDone.current = true
    }
  }, [isLoggedIn, user, userRole])

  // In the handleLoginClick function, make sure it's properly setting the modal state
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
            {/* Only show Admin link for admin users */}
            {(userRole === "admin" || process.env.NODE_ENV === "development") && (
              <Link
                href="/admin/users"
                className={`font-medium ${pathname.startsWith("/admin") ? "text-orange-500" : "text-white"}`}
              >
                Admin
              </Link>
            )}
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
        {/* Make sure the login button is using this handler */}
        <Button
          variant="default"
          className="bg-orange-500 hover:bg-orange-600"
          onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
        >
          {isLoggedIn ? "Logg ut" : "Logg inn"}
        </Button>
      </nav>
      {/* Make sure the login modal is properly included at the bottom of the component */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}

