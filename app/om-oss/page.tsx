"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function OmOss() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) return null

  return (
    <div>
      <h1 className="text-4xl font-bold">Om oss</h1>
      <p className="mt-4">Lær mer om Hepta og vårt team.</p>
    </div>
  )
}

