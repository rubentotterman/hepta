"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/ui/modal"; // Oppdatert import-sti

export default function Faktura() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Visa");
  
  const payments = Array.from({ length: 6 }, (_, i) => ({
    date: "1.10.2024",
    amount: "$0.00",
  }));

  const handleSavePaymentMethod = (method: string) => {
    // Konverter method-id til visningsnavn
    const methodMap: Record<string, string> = {
      visa: "Visa",
      mastercard: "Mastercard",
      vipps: "Vipps",
      bankoverføring: "Bankoverføring"
    };
    
    setPaymentMethod(methodMap[method] || method);
  };

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold">Faktura</h1>
      
      <div>
        <h2 className="text-2xl font-semibold">Betalingsmetode</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>{paymentMethod}</div>
          <Button 
            variant="outline" 
            onClick={() => setIsModalOpen(true)}
          >
            Endre betalingsmetode
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold">Betalingshistorikk</h2>
        <div className="mt-4 space-y-4">
          {payments.map((payment, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>{payment.date}</div>
              <div>{payment.amount}</div>
            </div>
          ))}
        </div>
      </div>
      
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePaymentMethod}
      />
    </div>
  );
}