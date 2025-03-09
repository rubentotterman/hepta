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

      // Set a session cookie that expires in 7 days
      document.cookie = `session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`

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
      </DialogContent>
    </Dialog>
  )
}

