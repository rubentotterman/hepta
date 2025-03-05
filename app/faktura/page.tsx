"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceList } from "@/components/invoice-list"
import { PaymentModal } from "@/components/payment-modal"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { getSessionToken } from "@/lib/utils"

export default function Faktura() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("Visa")
  const [isCreatingTestInvoice, setIsCreatingTestInvoice] = useState(false)
  const { user } = useAuth()
  const isDevelopment = process.env.NODE_ENV === "development"

  const handleSavePaymentMethod = (method: string) => {
    // Convert method-id to display name
    const methodMap: Record<string, string> = {
      visa: "Visa",
      mastercard: "Mastercard",
      vipps: "Vipps",
      bankoverføring: "Bankoverføring",
    }

    setPaymentMethod(methodMap[method] || method)
  }

  const createTestInvoice = async () => {
    if (!isDevelopment) return

    try {
      setIsCreatingTestInvoice(true)

      // First ensure we have a customer ID
      const customerResponse = await fetch("/api/stripe/create-customer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getSessionToken() || ""}`,
        },
      })

      if (!customerResponse.ok) {
        throw new Error(`Failed to create/get customer: ${await customerResponse.text()}`)
      }

      // Now create the test invoice
      const response = await fetch("/api/stripe/create-test-invoice", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getSessionToken() || ""}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server response:", errorText)
        throw new Error(`Failed to create test invoice: ${errorText}`)
      }

      const data = await response.json()
      console.log("Test invoice created:", data)

      // Refresh the page to show the new invoice
      window.location.reload()
    } catch (error) {
      console.error("Error creating test invoice:", error)
      alert(`Failed to create test invoice: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsCreatingTestInvoice(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Faktura</h1>

        {isDevelopment && (
          <Button
            onClick={createTestInvoice}
            disabled={isCreatingTestInvoice}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCreatingTestInvoice ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Oppretter...
              </>
            ) : (
              "Opprett testfaktura"
            )}
          </Button>
        )}
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="invoices">Fakturaer</TabsTrigger>
          <TabsTrigger value="payment-methods">Betalingsmetoder</TabsTrigger>
          <TabsTrigger value="history">Betalingshistorikk</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Dine fakturaer</CardTitle>
              <CardDescription>Se og betal dine fakturaer</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Betalingsmetode</CardTitle>
              <CardDescription>Administrer dine betalingsmetoder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>{paymentMethod}</div>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Endre betalingsmetode
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Betalingshistorikk</CardTitle>
              <CardDescription>Se dine tidligere betalinger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>{`${i}.${Math.floor(Math.random() * 12) + 1}.2024`}</div>
                    <div>{`${(Math.random() * 1000).toFixed(2)} NOK`}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSavePaymentMethod} />
    </div>
  )
}

