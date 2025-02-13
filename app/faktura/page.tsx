import { Button } from "@/components/ui/button"

export default function Faktura() {
  const payments = Array.from({ length: 6 }, (_, i) => ({
    date: "1.10.2024",
    amount: "$0.00",
  }))

  return (
    <div className="container space-y-12 px-4 py-8">
      <h1 className="text-4xl font-bold">Faktura</h1>

      <div>
        <h2 className="text-2xl font-semibold">Betalingsmetode</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>Visa</div>
          <Button variant="outline">Legg til betalingsmetode</Button>
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
    </div>
  )
}

