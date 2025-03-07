"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft } from "lucide-react"
import { StripeCustomerInfo } from "@/components/stripe-customer-info"

interface User {
  id: string
  email: string
  created_at: string
  stripe_customer_id?: string
  full_name?: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { sessionToken } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params?.id as string

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionToken || "test_session"}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${await response.text()}`)
      }

      const data = await response.json()
      setUser(data.user || null)
    } catch (error) {
      console.error("Error fetching user:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch user")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId, sessionToken])

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-4xl font-bold">Brukerdetaljer</h1>
      </div>

      {isLoading ? (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-800 bg-red-900/20">
          <CardHeader>
            <CardTitle>Feil ved lasting av bruker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">{error}</p>
            <Button onClick={fetchUser} variant="outline" className="mt-4">
              Prøv igjen
            </Button>
          </CardContent>
        </Card>
      ) : !user ? (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle>Bruker ikke funnet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Kunne ikke finne brukeren du leter etter.</p>
            <Button onClick={() => router.push("/admin/users")} variant="outline" className="mt-4">
              Tilbake til brukerliste
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>{user.full_name || user.email}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Bruker ID</div>
                  <div className="font-mono text-sm">{user.id}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-400">Opprettet</div>
                  <div>{new Date(user.created_at).toLocaleDateString()}</div>
                </div>

                {user.stripe_customer_id && (
                  <div>
                    <div className="text-sm text-gray-400">Stripe kunde ID</div>
                    <div className="font-mono text-sm">{user.stripe_customer_id}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <StripeCustomerInfo userId={user.id} />
        </>
      )}
    </div>
  )
}

