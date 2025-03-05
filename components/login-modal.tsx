"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  console.log("LoginModal rendered with isOpen:", isOpen)
  const [loading, setLoading] = useState(false)
  const { createTestSession } = useAuth()
  const supabase = createClientComponentClient()

  // Simplified login for local testing
  const handleTestLogin = async () => {
    setLoading(true)

    try {
      console.log("Login modal - Creating test session")
      await createTestSession()
      onClose()

      // Force a page refresh to ensure all components update with the new auth state
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error creating test session:", error)
      alert("Failed to create test session. See console for details.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log("Login modal - Attempting Google login")
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        console.error("Error logging in with Google:", error)
        alert("Error logging in with Google. Please try again.")
      }
    } catch (error) {
      console.error("Unexpected error during Google login:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logg inn</DialogTitle>
          <DialogDescription>Logg inn for å få tilgang til din konto.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Button className="w-full" onClick={handleTestLogin} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logger inn...
              </>
            ) : (
              "Logg inn med e-post"
            )}
          </Button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Eller fortsett med</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Logg inn med Google
        </Button>
      </DialogContent>
    </Dialog>
  )
}

