"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BetaltFaktura() {
  const router = useRouter()

  useEffect(() => {
    // You could fetch payment confirmation details here
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Betaling fullført</h1>

      <Card className="border-green-800 bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Betaling vellykket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>Din betaling er behandlet og bekreftet. En kvittering er sendt til din e-postadresse.</p>

          <div className="p-4 bg-green-950/30 rounded-lg border border-green-800">
            <h3 className="font-medium mb-2">Betalingsdetaljer</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-400">Betalingsdato:</span>
              <span>{new Date().toLocaleDateString("no-NO")}</span>

              <span className="text-gray-400">Betalingsreferanse:</span>
              <span>REF-{Math.floor(Math.random() * 1000000)}</span>

              <span className="text-gray-400">Betalingsmetode:</span>
              <span>Kredittkort</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/faktura">Tilbake til fakturaer</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Gå til dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

