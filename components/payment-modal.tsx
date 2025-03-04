"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Building, Wallet } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (method: string) => void
}

export function PaymentModal({ isOpen, onClose, onSave }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("visa")

  const handleSave = () => {
    onSave(selectedMethod)
    onClose()
  }

  const paymentMethods = [
    {
      id: "visa",
      name: "Visa",
      description: "Betal med Visa-kort",
      icon: CreditCard,
    },
    {
      id: "mastercard",
      name: "Mastercard",
      description: "Betal med Mastercard",
      icon: CreditCard,
    },
    {
      id: "vipps",
      name: "Vipps",
      description: "Betal med Vipps",
      icon: Wallet,
    },
    {
      id: "bankoverføring",
      name: "Bankoverføring",
      description: "Betal med bankoverføring",
      icon: Building,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Velg betalingsmetode</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                  selectedMethod === method.id
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <RadioGroupItem value={method.id} id={method.id} className="border-gray-700" />
                <Label htmlFor={method.id} className="flex flex-1 cursor-pointer items-center gap-3">
                  <method.icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-400">{method.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave}>
            Lagre
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

