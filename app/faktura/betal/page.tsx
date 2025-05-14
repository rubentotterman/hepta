"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/faktura/betalt`,
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "En feil oppstod.")
        onError?.(error.message || "En feil oppstod.")
      } else {
        onSuccess?.()
      }
    } catch (err: any) {
      setErrorMessage(err.message || "En feil oppstod.")
      onError?.(err.message || "En feil oppstod.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Fullfør betaling</CardTitle>
        <CardDescription className="text-gray-500">Beløp: {amount.toFixed(2)} NOK</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <PaymentElement />
        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end p-6 border-t border-gray-100">
        <Button type="submit" disabled={!stripe || isLoading} className="bg-blue-600 hover:bg-blue-700">
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
  )
}

export default function BetalFaktura() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get("id")
  const { sessionToken } = useAuth()

  const [invoice, setInvoice] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPayment, setIsLoadingPayment] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (!invoiceId) return

    const fetchInvoice = async () => {
      try {
        const mock = {
          id: invoiceId,
          number: "INV-2025",
          amount_due: 1249.99,
          currency: "NOK",
          description: "Webutvikling",
        }
        setInvoice(mock)
      } catch (e) {
        setError("Kunne ikke hente faktura.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoice()
  }, [invoiceId])

  useEffect(() => {
    if (!invoice) return

    const createPaymentIntent = async () => {
      try {
        setIsLoadingPayment(true)

        // ✅ Use correct mock format
        const mockClientSecret = `pi_1234567890_secret_${Math.random().toString(36).substring(2)}`
        setClientSecret(mockClientSecret)
      } catch (e) {
        setError("Kunne ikke laste betalingsinformasjon.")
      } finally {
        setIsLoadingPayment(false)
      }
    }

    createPaymentIntent()
  }, [invoice])

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6" />
              Betaling fullført
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">Du blir nå videresendt...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-8">
      <div className="flex items-center gap-2">
        <Link href="/faktura" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Faktura #{invoice.number}</h1>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {invoice.description}
          </CardTitle>
          <CardDescription className="text-gray-500">
            Total:{" "}
            <span className="font-medium text-gray-800">
              {invoice.amount_due.toFixed(2)} {invoice.currency}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPayment ? (
            <Skeleton className="h-[300px] w-full rounded-lg" />
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#2563eb",
                    fontFamily: "Inter, sans-serif",
                    borderRadius: "6px",
                  },
                },
              }}
            >
              <CheckoutForm
                amount={invoice.amount_due}
                onSuccess={() => {
                  setPaymentSuccess(true)
                  setTimeout(() => router.push("/faktura/betalt"), 2000)
                }}
                onError={(msg) => setError(msg)}
              />
            </Elements>
          ) : (
            <p className="text-center text-red-500">
              Kunne ikke vise betalingsinformasjon.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
