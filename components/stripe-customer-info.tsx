"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { RefreshCw } from "lucide-react"

interface StripeCustomerInfoProps {
  userId: string
}

interface StripeCustomer {
  id: string
  email: string
  name?: string
  phone?: string
  created: number
  metadata?: Record<string, string>
}

export function StripeCustomerInfo({ userId }: StripeCustomerInfoProps) {
  const { sessionToken } = useAuth()
  const [customer, setCustomer] = useState<StripeCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomerInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/stripe-customer?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionToken || "test_session"}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch customer info: ${await response.text()}`)
      }

      const data = await response.json()
      setCustomer(data.customer || null)
    } catch (error) {
      console.error("Error fetching customer info:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch customer info")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCustomerInfo()
    }
  }, [userId, sessionToken])

  if (isLoading) {
    return (
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-800 bg-red-900/20">
        <CardHeader>
          <CardTitle>Feil ved lasting av kundeinformasjon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{error}</p>
          <Button onClick={fetchCustomerInfo} variant="outline" className="mt-4">
            Prøv igjen
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!customer) {
    return (
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle>Ingen kundeinformasjon</CardTitle>
          <CardDescription>Denne brukeren har ingen Stripe kunde tilknyttet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Stripe kundeinformasjon</CardTitle>
          <Button onClick={fetchCustomerInfo} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Oppdater
          </Button>
        </div>
        <CardDescription>Kunde ID: {customer.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400">E-post</div>
            <div>{customer.email}</div>
          </div>

          {customer.name && (
            <div>
              <div className="text-sm text-gray-400">Navn</div>
              <div>{customer.name}</div>
            </div>
          )}

          {customer.phone && (
            <div>
              <div className="text-sm text-gray-400">Telefon</div>
              <div>{customer.phone}</div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-400">Opprettet</div>
            <div>{new Date(customer.created * 1000).toLocaleDateString()}</div>
          </div>

          {customer.metadata && Object.keys(customer.metadata).length > 0 && (
            <div>
              <div className="text-sm text-gray-400">Metadata</div>
              <div className="bg-gray-800 p-2 rounded text-xs">
                <pre>{JSON.stringify(customer.metadata, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

