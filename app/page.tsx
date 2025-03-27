"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowUpRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import { LoginModal } from "@/components/login-modal"
import Link from "next/link"
import { ContactFormModal } from "@/components/contact-form-modal"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { isLoggedIn } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
  }

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

  const features = ["Skreddersydde løsninger", "Erfarne fagfolk", "Innovativ teknologi", "Resultatorientert tilnærming"]

  function handleStartClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="space-y-32">
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-background to-background" />
        <div className="container relative">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="animate-fade-in bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl md:text-7xl">
              Vi er Hepta, utviklere, markedsførere og problemløsere
            </h1>
            <p className="mt-8 animate-fade-in text-lg leading-relaxed text-gray-400 [animation-delay:200ms]">
              Vårt team av erfarne utviklere, designere og produktledere hjelper deg å realisere ideene dine. Enten du
              er en startup eller et stort selskap, har vi deg dekket.
            </p>
            <div className="mt-12 flex justify-center gap-4">
              <Button
                className="animate-fade-in h-14 px-8 text-lg [animation-delay:400ms]"
                size="lg"
                asChild
              >
                <Link href="/tjenester">
                  Se hva vi gjør
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!isLoggedIn && (
                <Button
                  variant="outline"
                  className="animate-fade-in h-14 px-8 text-lg [animation-delay:400ms]"
                  size="lg"
                  onClick={handleLoginClick}
                >
                  Logg inn
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </section>

      <section className="container">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight">Hva vi gjør</h2>
          <p className="mt-4 text-xl text-gray-400">
            Vi tilbyr en rekke tjenester for å hjelpe din bedrift å vokse og lykkes
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {services.map((service, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900 hover:shadow-lg hover:shadow-orange-500/10"
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
                  <h3 className="text-2xl font-semibold tracking-tight">{service.name}</h3>
                  <p className="mt-2 text-gray-400">{service.description}</p>
                  <Button
                    variant="link"
                    className="mt-4 h-auto p-0 text-orange-500 transition-colors hover:text-orange-400"
                  >
                    Les mer <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="grid gap-8 p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black/50">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent" />
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Hepta team at work"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">Hvem er vi</h2>
              <p className="text-xl text-gray-400">
                Vi er et team av dedikerte fagfolk som brenner for å skape digitale løsninger som gjør en forskjell. Med
                vår brede kompetanse og innovative tilnærming, hjelper vi bedrifter å nå sine mål og utnytte sitt fulle
                potensial.
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-orange-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div>
                <Button size="lg" className="group text-lg">
                  Mer om oss
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <Card className="overflow-hidden border-gray-800 bg-gray-900/50">
          <CardContent className="p-8 sm:p-12">
            <div className="mx-auto max-w-[600px] text-center">
              <h2 className="text-4xl font-bold tracking-tight">Klar for å samarbeide med oss?</h2>
              <p className="mt-4 text-xl text-gray-400">
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
                <Button size="lg" className="mt-6 w-full text-lg sm:w-auto" onClick={handleStartClick}>
                  Start nå
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}