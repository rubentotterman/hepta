"\"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CheckoutForm } from "./checkout-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"

// Load Stripe outside of component render to avoid recreating Stripe object on every render
// Using the provided publishable key
const stripePromise = loadStripe(
  "pk_test_51NTj6ECBZbubqLlTkG0te9lkV8yeJ2oICi7xozoKXI6iftnjKhBLOhI28HgOEd4UIk8UGzqsMhXx8A5MQFTEJnXm009dnJfaPI",
)

interface PaymentWrapperProps {
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentWrapper({ amount, onSuccess, onError }: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { sessionToken, isLoggedIn } = useAuth()

  useEffect(() => {
    // Create a payment intent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true)
        console.log("Creating payment intent with auth state:", { isLoggedIn, hasToken: !!sessionToken })

        // For development, if we don't have a real session, use mock data
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock payment intent in development mode")
          // Wait a bit to simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock client secret
          setClientSecret(
            `pi_mock_${Math.random().toString(36).substring(2, 10)}_secret_${Math.random().toString(36).substring(2, 15)}`,
          )
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken || "test_session"}`,
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
  }, [amount, onError, isLoggedIn, sessionToken])

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

