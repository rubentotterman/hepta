"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "./checkout-form"
import { Skeleton } from "@/components/ui/skeleton"
import { getSessionToken } from "@/lib/utils"

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface PaymentWrapperProps {
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentWrapper({ amount, onSuccess, onError }: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create a payment intent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getSessionToken() || ""}`,
          },
          body: JSON.stringify({ amount }),
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
        onError?.(error.message || "Failed to load payment form")
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, onError])

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 border border-red-800 bg-red-900/20 rounded-lg text-red-400">
        <p>Error: {error}</p>
        <p className="mt-2">Please try again later or contact support.</p>
      </div>
    )
  }

  if (!clientSecret) {
    return null
  }

  return (
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
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}

