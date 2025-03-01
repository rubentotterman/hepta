"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, CreditCard, Smartphone, Building, Check } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: string) => void;
}

interface PaymentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

export function PaymentModal({ isOpen, onClose, onSave }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("visa");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedMethod);
    onClose();
  };

  const paymentMethods: PaymentOption[] = [
    { 
      id: "Faktura", 
      name: "Faktura    ", 
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      description: "Faktura sendes til e-post"
    },
    { 
      id: "Stripe", 
      name: "Stripe", 
      icon: <CreditCard className="h-5 w-5 text-red-500" />,
      description: "Betal automatisk med Stripe" 
    },
    { 
      id: "vipps", 
      name: "Vipps", 
      icon: <Smartphone className="h-5 w-5 text-orange-500" />,
      description: "Betal med Vipps-appen" 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-auto bg-black border-4 border-white-500 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium">Velg betalingsmetode</h3>
          <button 
            onClick={onClose}
            className="text-black-500 hover:text-gray-100"
            aria-label="Lukk"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-orange-500 transition-colors ${
                selectedMethod === method.id ? 'border-orange-500 bg-black-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="mr-3">
                {method.icon}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{method.name}</div>
                {method.description && (
                  <div className="text-sm text-gray-500">{method.description}</div>
                )}
              </div>
              {selectedMethod === method.id && (
                <div className="text-blue-500">
                  <Check size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
          
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>
            Lagre endringer
          </Button>
        </div>
      </div>
    </div>
  );
}