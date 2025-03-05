"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentWrapper } from "@/components/stripe/payment-wrapper"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

interface InvoiceDetails {
  id: string
  number: string
  amount_due: number
  currency: string
  description?: string
}

export default function BetalFaktura() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const invoiceId = searchParams.get("id")
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (!invoiceId) {
      setError("Ingen faktura-ID angitt")
      setIsLoading(false)
      return
    }

    const fetchInvoiceDetails = async () => {
      try {
        setIsLoading(true)
        // This would be a real API call to get invoice details
        // For demo purposes, we'll create a mock invoice
        const mockInvoice = {
          id: invoiceId,
          number: `INV-${Math.floor(Math.random() * 10000)}`,
          amount_due: Math.floor(Math.random() * 100000) / 100,
          currency: "nok",
          description: "Månedlig abonnement",
        }

        setInvoice(mockInvoice)
      } catch (error: any) {
        setError(error.message || "Kunne ikke hente fakturaopplysninger")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoiceDetails()
  }, [invoiceId])

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push("/faktura/betalt")
    }, 2000)
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/faktura" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-4xl font-bold">Betal faktura</h1>
        </div>
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="animate-pulse bg-gray-800 h-8 w-1/3 rounded"></CardTitle>
            <CardDescription className="animate-pulse bg-gray-800 h-4 w-1/4 rounded mt-2"></CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] animate-pulse bg-gray-800 rounded"></CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/faktura" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-4xl font-bold">Betal faktura</h1>
        </div>
        <Card className="border-red-800 bg-red-900/20">
          <CardHeader>
            <CardTitle>Feil ved lasting av faktura</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">{error}</p>
            <Button onClick={() => router.push("/faktura")} variant="outline" className="mt-4">
              Tilbake til fakturaer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Betal faktura</h1>
        <Card className="border-green-800 bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Betaling vellykket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-400">Din betaling er behandlet. Du blir nå omdirigert...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/faktura" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-4xl font-bold">Betal faktura</h1>
        </div>
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle>Faktura ikke funnet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Kunne ikke finne fakturaen du leter etter.</p>
            <Button onClick={() => router.push("/faktura")} variant="outline" className="mt-4">
              Tilbake til fakturaer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/faktura" className="text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-4xl font-bold">Betal faktura</h1>
      </div>

      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle>Faktura #{invoice.number}</CardTitle>
          <CardDescription>{invoice.description || "Fakturadetaljer"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Beløp:</span>
              <span className="text-xl font-bold">
                {invoice.amount_due.toFixed(2)} {invoice.currency.toUpperCase()}
              </span>
            </div>
            <div className="h-px bg-gray-800 my-4"></div>
          </div>

          <PaymentWrapper amount={invoice.amount_due} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
        </CardContent>
      </Card>
    </div>
  )
}

