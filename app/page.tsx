"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) return null

  const services = [
    {
      name: "Marketing",
      image: "/placeholder.svg?height=300&width=400",
      description: "Strategisk markedsføring for vekst",
    },
    {
      name: "SEO",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DyrXKUz2yM46weXW-generated_image.jpg-kKQYqkWAsZ3VesarAD0MN6iFfmxZ6V.jpeg",
      description: "Optimalisering for søkemotorer",
    },
    { name: "AI Workshop", image: "/placeholder.svg?height=300&width=400", description: "Innovativ AI-opplæring" },
    {
      name: "Development",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NScCSeoMhG3otlsf-generated_image.jpg-AO2NVqUPiotxAfwLxsgSIZ9jhnXhek.jpeg",
      description: "Skreddersydd programvareutvikling",
    },
  ]

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-background to-background" />
        <div className="mx-auto max-w-[800px] text-center">
          <h1 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-6xl font-bold leading-tight tracking-tight text-transparent">
            Vi er Hepta, utviklere, markedsførere og problemløsere
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-gray-400">
            Vårt team av erfarne utviklere, designere og produktledere hjelper deg å realisere ideene dine. Enten du er
            en startup eller et stort selskap, har vi deg dekket.
          </p>
          <Button className="mt-12 h-12 px-8 text-base" size="lg">
            Start nå
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Hva vi gjør</h2>
          <p className="mt-4 text-gray-400">Vi tilbyr en rekke tjenester for å hjelpe din bedrift å vokse og lykkes</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {services.map((service, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900"
            >
              <CardContent className="p-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={`Illustrasjon av ${service.name}`}
                    fill
                    className="transition-transform duration-300 group-hover:scale-105"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold tracking-tight">{service.name}</h3>
                  <p className="mt-2 text-orange-500">{service.description}</p>
                  <Button variant="link" className="mt-4 h-auto p-0 text-gray-400 transition-colors hover:text-white">
                    Les mer <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="container">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="grid gap-8 p-8 lg:grid-cols-2 lg:gap-12 lg:p-12">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black/50">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent" />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">Hvem er vi</h2>
              <p className="text-gray-400">
                Vi er et team av dedikerte fagfolk som brenner for å skape digitale løsninger som gjør en forskjell.
              </p>
              <div>
                <Button size="lg" className="group">
                  Mer om oss
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container pb-20">
        <Card className="overflow-hidden border-gray-800 bg-gray-900/50">
          <CardContent className="p-8">
            <div className="mx-auto max-w-[600px] text-center">
              <h2 className="text-3xl font-bold">Klar for å samarbeide med oss?</h2>
              <p className="mt-4 text-gray-400">
                Fortell oss litt om prosjektet ditt, så tar vi kontakt innen 24 timer
              </p>
              <form className="mt-8 space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-12 border-gray-800 bg-gray-950/50 px-4 text-base transition-colors hover:border-gray-700 focus:border-orange-500"
                />
                <Textarea
                  placeholder="Melding"
                  className="min-h-[150px] border-gray-800 bg-gray-950/50 px-4 py-3 text-base transition-colors hover:border-gray-700 focus:border-orange-500"
                />
                <Button size="lg" className="mt-6 w-full sm:w-auto">
                  Start nå
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

