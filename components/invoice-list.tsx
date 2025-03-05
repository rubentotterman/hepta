"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAmountFromStripe } from "@/lib/stripe"
import { useRouter } from "next/navigation"
import { getSessionToken } from "@/lib/utils"

interface Invoice {
  id: string
  number: string
  amount_due: number
  currency: string
  status: string
  due_date: number
  hosted_invoice_url: string
  created: number
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/stripe/get-invoices", {
          headers: {
            Authorization: `Bearer ${getSessionToken() || ""}`,
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Failed to fetch invoices:", errorText)
          throw new Error(`Failed to fetch invoices: ${errorText}`)
        }

        const data = await response.json()
        console.log("Fetched invoices:", data.invoices?.length || 0)
        setInvoices(data.invoices || [])
      } catch (error: any) {
        console.error("Error fetching invoices:", error)
        setError(error.message || "Failed to load invoices")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const handlePayInvoice = (invoiceId: string) => {
    router.push(`/faktura/betal?id=${invoiceId}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">Betalt</Badge>
      case "open":
        return <Badge className="bg-yellow-600">Åpen</Badge>
      case "draft":
        return <Badge className="bg-gray-600">Utkast</Badge>
      case "uncollectible":
        return <Badge className="bg-red-600">Ikke innkrevbar</Badge>
      case "void":
        return <Badge className="bg-gray-600">Annullert</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
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
    )
  }

  if (error) {
    return (
      <Card className="border-red-800 bg-red-900/20">
        <CardHeader>
          <CardTitle>Feil ved lasting av fakturaer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Prøv igjen
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle>Ingen fakturaer</CardTitle>
          <CardDescription>Du har ingen fakturaer for øyeblikket.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="border-gray-800 bg-gray-900/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Faktura #{invoice.number}</CardTitle>
              {getStatusBadge(invoice.status)}
            </div>
            <CardDescription>
              Opprettet: {formatDate(invoice.created)} | Forfallsdato: {formatDate(invoice.due_date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">
                {formatAmountFromStripe(invoice.amount_due).toFixed(2)} {invoice.currency.toUpperCase()}
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => window.open(invoice.hosted_invoice_url, "_blank")}>
                  Vis faktura
                </Button>
                {invoice.status === "open" && (
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    size="sm"
                    onClick={() => handlePayInvoice(invoice.id)}
                  >
                    Betal nå
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

