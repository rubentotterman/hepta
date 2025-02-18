"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) return null

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="pt-10">
        <div className="max-w-[800px]">
          <h1 className="text-5xl font-bold leading-tight">Vi er Hepta, utviklere, markedsførere og problemløsere</h1>
          <p className="mt-6 text-lg text-gray-400">
            Vårt team av erfarne utviklere, designere og produktledere hjelper deg å realisere ideene dine. Enten du er
            en startup eller et stort selskap, har vi deg dekket.
          </p>
          <Button className="mt-8 bg-orange-500 hover:bg-orange-600">Start nå</Button>
        </div>
      </section>

      {/* What We Do Section */}
      <section>
        <h2 className="text-3xl font-bold">Hva vi gjør</h2>
        <p className="mt-2 text-gray-400">Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-gray-900 p-6">
              <div className="mb-4 h-40 rounded-lg bg-gray-800" />
              <h3 className="font-semibold">Lorem Ipsum</h3>
              <p className="mt-1 text-orange-500">Lorem Ipsum</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="rounded-lg bg-gray-900 aspect-video" />
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold">Hvem er vi</h2>
          <Button className="mt-8 w-full bg-orange-500 hover:bg-orange-600 sm:w-auto">Mer om oss</Button>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <div className="mx-auto max-w-[600px] text-center">
          <h2 className="text-3xl font-bold">Klar for å samarbeide med oss?</h2>
          <p className="mt-2 text-gray-400">
            Tell us a bit about your project, and we&apos;ll get back to you within 24 hours
          </p>
          <form className="mt-8 flex flex-col gap-4">
            <Input type="email" placeholder="Email" className="bg-[#FAF6F0] text-black" />
            <Textarea placeholder="Melding" className="min-h-[150px] bg-[#FAF6F0] text-black" />
            <Button className="bg-orange-500 hover:bg-orange-600">Start nå</Button>
          </form>
        </div>
      </section>
    </div>
  )
}

