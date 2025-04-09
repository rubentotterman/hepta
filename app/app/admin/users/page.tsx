"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Search, UserPlus, RefreshCw, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  created_at: string
  stripe_customer_id?: string
  full_name?: string
}

export default function AdminUsersPage() {
  const { sessionToken, userRole } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatingCustomer, setIsCreatingCustomer] = useState<string | null>(null)
  const [manualCustomerId, setManualCustomerId] = useState<string>("")
  const [isAssigningCustomer, setIsAssigningCustomer] = useState<string | null>(null)
  const [isAdminPage = userRole === "admin" || process.env.NODE_ENV === "development", setIsAdminPage] = useState(
    userRole === "admin" || process.env.NODE_ENV === "development",
  )

  useEffect(() => {
    // Redirect if not admin
    if (!isAdminPage) {
      router.push("/dashboard")
    }
  }, [isAdminPage, router])

  if (!isAdminPage) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Administrer brukere</h1>
        <Card className="border-red-800 bg-red-900/20">
          <CardHeader>
            <CardTitle>Ingen tilgang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">Du har ikke tilgang til denne siden. Kun administratorer kan se denne siden.</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4">
              Tilbake til dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${sessionToken || "test_session"}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${await response.text()}`)
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [sessionToken])

  // Create or get Stripe customer for a user
  const createStripeCustomer = async (userId: string, email: string, name?: string) => {
    try {
      setIsCreatingCustomer(userId)

      const response = await fetch("/api/admin/create-stripe-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken || "test_session"}`,
        },
        body: JSON.stringify({
          userId,
          email,
          name,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create Stripe customer: ${await response.text()}`)
      }

      const data = await response.json()

      // Update the user in the local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, stripe_customer_id: data.customerId } : user)))

      return data.customerId
    } catch (error) {
      console.error("Error creating Stripe customer:", error)
      alert(error instanceof Error ? error.message : "Failed to create Stripe customer")
      return null
    } finally {
      setIsCreatingCustomer(null)
    }
  }

  // Assign an existing Stripe customer ID to a user
  const assignStripeCustomer = async (userId: string) => {
    if (!manualCustomerId) {
      alert("Please enter a Stripe customer ID")
      return
    }

    try {
      setIsAssigningCustomer(userId)

      const response = await fetch("/api/admin/assign-stripe-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken || "test_session"}`,
        },
        body: JSON.stringify({
          userId,
          customerId: manualCustomerId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to assign Stripe customer: ${await response.text()}`)
      }

      // Update the user in the local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, stripe_customer_id: manualCustomerId } : user)))

      // Clear the input
      setManualCustomerId("")
    } catch (error) {
      console.error("Error assigning Stripe customer:", error)
      alert(error instanceof Error ? error.message : "Failed to assign Stripe customer")
    } finally {
      setIsAssigningCustomer(null)
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.stripe_customer_id?.includes(searchQuery),
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Administrer brukere</h1>
        <Button onClick={fetchUsers} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Oppdater
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Søk etter brukere..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-800 bg-red-900/20">
          <CardHeader>
            <CardTitle>Feil ved lasting av brukere</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">{error}</p>
            <Button onClick={fetchUsers} variant="outline" className="mt-4">
              Prøv igjen
            </Button>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle>Ingen brukere funnet</CardTitle>
            <CardDescription>
              {searchQuery ? "Ingen brukere matcher søket ditt." : "Det er ingen brukere i systemet ennå."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="border-gray-800 bg-gray-900/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{user.full_name || user.email}</CardTitle>
                  {user.stripe_customer_id ? (
                    <Badge className="bg-green-600">Stripe kunde</Badge>
                  ) : (
                    <Badge className="bg-gray-600">Ingen Stripe kunde</Badge>
                  )}
                </div>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    {user.stripe_customer_id ? (
                      <div className="text-sm">
                        <span className="text-gray-400">Stripe kunde ID:</span>{" "}
                        <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">{user.stripe_customer_id}</code>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Ingen Stripe kunde tilknyttet</div>
                    )}
                  </div>
                  <Button
                    onClick={() => createStripeCustomer(user.id, user.email, user.full_name)}
                    disabled={!!isCreatingCustomer || !!user.stripe_customer_id}
                    className="gap-2"
                  >
                    {isCreatingCustomer === user.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Oppretter...
                      </>
                    ) : user.stripe_customer_id ? (
                      "Allerede opprettet"
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Opprett Stripe kunde
                      </>
                    )}
                  </Button>
                </div>

                {!user.stripe_customer_id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <Label htmlFor={`manual-customer-${user.id}`} className="text-sm text-gray-400 mb-2 block">
                      Eller tilknytt eksisterende Stripe kunde ID:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`manual-customer-${user.id}`}
                        placeholder="cus_..."
                        value={user.id === isAssigningCustomer ? manualCustomerId : ""}
                        onChange={(e) => setManualCustomerId(e.target.value)}
                      />
                      <Button
                        onClick={() => assignStripeCustomer(user.id)}
                        disabled={!!isAssigningCustomer || !manualCustomerId}
                        variant="outline"
                        className="gap-2"
                      >
                        {isAssigningCustomer === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <LinkIcon className="h-4 w-4" />
                            Tilknytt
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

