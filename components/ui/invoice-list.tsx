"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAmountFromStripe } from "@/lib/stripe"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ArrowUpDown, Calendar, Check, Clock, Download, ExternalLink, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const { sessionToken, isLoggedIn } = useAuth()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        console.log("Fetching invoices with auth state:", { isLoggedIn, hasToken: !!sessionToken })

        // Always use mock data in development to avoid Stripe API issues
        const useMockData = process.env.NODE_ENV === "development"

        if (useMockData) {
          console.log("Using mock invoice data in development")
          // Mock data for development - expanded with more examples
          const mockInvoices = [
            {
              id: "in_mock_1",
              number: "INV-001",
              amount_due: 10000, // 100.00 in cents
              currency: "nok",
              status: "open",
              due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
            },
            {
              id: "in_mock_2",
              number: "INV-002",
              amount_due: 25000, // 250.00 in cents
              currency: "nok",
              status: "paid",
              due_date: Math.floor(Date.now() / 1000) - 86400 * 15, // 15 days ago
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
            },
            {
              id: "in_mock_3",
              number: "INV-003",
              amount_due: 15000, // 150.00 in cents
              currency: "nok",
              status: "open",
              due_date: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400 * 5, // 5 days ago
            },
            {
              id: "in_mock_4",
              number: "INV-004",
              amount_due: 35000, // 350.00 in cents
              currency: "nok",
              status: "paid",
              due_date: Math.floor(Date.now() / 1000) - 86400 * 45, // 45 days ago
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400 * 60, // 60 days ago
            },
            {
              id: "in_mock_5",
              number: "INV-005",
              amount_due: 5000, // 50.00 in cents
              currency: "nok",
              status: "draft",
              due_date: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days from now
              hosted_invoice_url: "#",
              created: Math.floor(Date.now() / 1000) - 86400 * 2, // 2 days ago
            },
          ]
          setInvoices(mockInvoices)
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/stripe/get-invoices", {
          headers: {
            Authorization: `Bearer ${sessionToken || "test_session"}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          const errorText = errorData?.error || (await response.text()) || `HTTP error ${response.status}`
          console.error("Failed to fetch invoices:", errorText)
          throw new Error(`Failed to fetch invoices: ${errorText}`)
        }

        const data = await response.json()
        console.log("Fetched invoices:", data.invoices?.length || 0)
        setInvoices(data.invoices || [])
      } catch (error: any) {
        console.error("Error fetching invoices:", error)
        setError(error.message || "Failed to load invoices")

        // Fallback to mock data in case of error
        const mockInvoices = [
          {
            id: "in_mock_error_1",
            number: "ERROR001",
            amount_due: 10000,
            currency: "nok",
            status: "open",
            due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
            hosted_invoice_url: "#",
            created: Math.floor(Date.now() / 1000) - 86400,
          },
        ]
        setInvoices(mockInvoices)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [isLoggedIn, sessionToken])

  const handlePayInvoice = (invoiceId: string) => {
    router.push(`/faktura/betal?id=${invoiceId}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30 hover:text-green-400">
            <Check className="mr-1 h-3 w-3" /> Betalt
          </Badge>
        )
      case "open":
        return (
          <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-400">
            <Clock className="mr-1 h-3 w-3" /> Åpen
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-400">
            <FileText className="mr-1 h-3 w-3" /> Utkast
          </Badge>
        )
      case "uncollectible":
        return (
          <Badge className="bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-400">Ikke innkrevbar</Badge>
        )
      case "void":
        return (
          <Badge className="bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-400">Annullert</Badge>
        )
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

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error && invoices.length === 0) {
    return (
      <Card className="border-red-800 bg-red-900/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-red-400">Feil ved lasting av fakturaer</h3>
          <p className="mt-2 text-gray-400">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Prøv igjen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Søk faktura..."
            className="bg-gray-800 pl-9 text-white border-gray-700 focus-visible:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[180px]">
            <select
              className="w-full h-10 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Alle statuser</option>
              <option value="open">Åpen</option>
              <option value="paid">Betalt</option>
              <option value="draft">Utkast</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-white">Ingen fakturaer funnet</h3>
            <p className="mt-2 text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Ingen fakturaer matcher dine søkekriterier."
                : "Du har ingen fakturaer for øyeblikket."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                className="mt-4 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Tilbakestill filter
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-gray-800 bg-gray-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                    <div className="flex items-center">
                      Faktura #
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Dato</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Forfallsdato</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Beløp</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-white">{invoice.number}</td>
                    <td className="px-4 py-3 text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
                        {formatDate(invoice.created)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
                        {formatDate(invoice.due_date)}
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {formatAmountFromStripe(invoice.amount_due).toFixed(2)} {invoice.currency.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="h-8 w-8 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
                          onClick={() =>
                            invoice.hosted_invoice_url !== "#"
                              ? window.open(invoice.hosted_invoice_url, "_blank")
                              : alert("Dette er en testfaktura uten ekstern URL.")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Vis faktura</span>
                        </button>
                        {invoice.status === "open" && (
                          <button
                            className="rounded-md bg-blue-500 px-2 py-1 text-sm font-medium text-white hover:bg-blue-600"
                            onClick={() => handlePayInvoice(invoice.id)}
                          >
                            Betal nå
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
