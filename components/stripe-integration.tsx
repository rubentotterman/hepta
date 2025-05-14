"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"

export function StripeIntegration() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock subscription data
  const subscription = {
    status: "active",
    plan: "Pro Plan",
    amount: "1 499 kr",
    interval: "månedlig",
    nextBilling: "15. juni 2025",
    paymentMethod: {
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
    },
  }

  return (
    <div className="mb-10 space-y-6">
      <div className="mb-6">
        <div className="inline-flex h-9 items-center justify-start space-x-1.5 rounded-md bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              activeTab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Oversikt
          </button>
          <button
            onClick={() => setActiveTab("payment-methods")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              activeTab === "payment-methods" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Betalingsmetoder
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              activeTab === "subscription" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Abonnement
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    Aktivt abonnement
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {subscription.plan} - {subscription.amount} {subscription.interval}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Neste faktura: {subscription.nextBilling}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setActiveTab("subscription")}
                >
                  Administrer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                    Betalingsmetode
                  </h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex h-8 w-12 items-center justify-center rounded bg-gray-100 border border-gray-200">
                      <span className="text-xs font-bold uppercase text-gray-800">
                        {subscription.paymentMethod.brand}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">•••• {subscription.paymentMethod.last4}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setActiveTab("payment-methods")}
                >
                  Endre
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "payment-methods" && (
        <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dine betalingsmetoder</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center">
                  <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100 border border-gray-200">
                    <span className="text-sm font-bold uppercase text-gray-800">
                      {subscription.paymentMethod.brand}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">•••• {subscription.paymentMethod.last4}</p>
                    <p className="text-xs text-gray-500">
                      Utløper {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Fjern
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    Standard
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <CreditCard className="mr-2 h-4 w-4" />
                Legg til betalingsmetode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "subscription" && (
        <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ditt abonnement</h3>
              <div className="flex items-center">
                <CheckCircle className="mr-1.5 h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Aktivt</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{subscription.plan}</h4>
                    <p className="mt-1 text-sm text-gray-600">Fakturert {subscription.interval}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{subscription.amount}</p>
                    <p className="mt-1 text-sm text-gray-600">Neste faktura: {subscription.nextBilling}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Ubegrenset innholdsproduksjon</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Prioritert support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">Avansert analyse</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Endre plan
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    Kanseller abonnement
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start">
                  <AlertCircle className="mr-3 h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Viktig informasjon</h5>
                    <p className="mt-1 text-xs text-gray-700">
                      Hvis du kansellerer abonnementet ditt, vil du fortsatt ha tilgang til tjenestene ut inneværende
                      faktureringsperiode. Etter {subscription.nextBilling} vil kontoen din nedgraderes til
                      gratisversjonen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
