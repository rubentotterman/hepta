"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface CheckoutFormProps {
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
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

