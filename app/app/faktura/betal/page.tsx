"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Skeleton } from "@/components/ui/skeleton"

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(
  "pk_test_51NTj6ECBZbubqLlTkG0te9lkV8yeJ2oICi7xozoKXI6iftnjKhBLOhI28HgOEd4UIk8UGzqsMhXx8A5MQFTEJnXm009dnJfaPI",
)

// Define the CheckoutForm component directly in this file
function CheckoutForm({
  amount,
  onSuccess,
  onError,
}: {
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Check if we're using a mock client secret
      if (process.env.NODE_ENV === "development" && elements._commonOptions.clientSecret?.includes("_secret_")) {
        console.log("Using mock payment flow in development mode")
        // Simulate successful payment
        await new Promise((resolve) => setTimeout(resolve, 1500))
        onSuccess?.()
        return
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/faktura/betalt`,
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment.")
        onError?.(error.message || "An error occurred during payment.")
      } else {
        // Payment succeeded
        onSuccess?.()
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during payment.")
      onError?.(error.message || "An error occurred during payment.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-gray-800 bg-gray-900/50">
      <CardHeader>
        <CardTitle>Betal faktura</CardTitle>
        <CardDescription>Beløp: {amount.toFixed(2)} NOK</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <PaymentElement />
          {errorMessage && <div className="mt-4 text-sm text-red-500">{errorMessage}</div>}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!stripe || isLoading} className="bg-orange-500 hover:bg-orange-600">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Behandler...
              </>
            ) : (
              "Betal nå"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoadingPayment, setIsLoadingPayment] = useState(true)
  const { sessionToken, isLoggedIn } = useAuth()

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

  // Create a payment intent
  useEffect(() => {
    if (!invoice) return

    const createPaymentIntent = async () => {
      try {
        setIsLoadingPayment(true)
        console.log("Creating payment intent with auth state:", { isLoggedIn, hasToken: !!sessionToken })

        // For development, use mock data
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock payment intent in development mode")
          // Wait a bit to simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock client secret with the correct format
          setClientSecret(`pi_1234567890_secret_${Math.random().toString(36).substring(2, 15)}`)
          setIsLoadingPayment(false)
          return
        }

        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken || "test_session"}`,
          },
          body: JSON.stringify({ amount: invoice.amount_due }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Failed to create payment intent:", errorText)
          throw new Error(`Failed to create payment intent: ${errorText}`)
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error: any) {
        setError(error.message || "Failed to load payment form")
      } finally {
        setIsLoadingPayment(false)
      }
    }

    createPaymentIntent()
  }, [invoice, isLoggedIn, sessionToken])

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

          {isLoadingPayment ? (
            <div className="w-full max-w-md mx-auto">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#f97316",
                    colorBackground: "#111111",
                    colorText: "#ffffff",
                    colorDanger: "#ef4444",
                    fontFamily: "Inter, sans-serif",
                    spacingUnit: "4px",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <CheckoutForm amount={invoice.amount_due} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-400">Kunne ikke laste betalingsformularet. Vennligst prøv igjen senere.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

