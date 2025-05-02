"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import { LoginModal } from "@/components/login-modal"
import { ContactFormModal } from "@/components/contact-form-modal"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import ServiceCards from "@/components/serviceCards"


export default function Home() {
  const { isLoggedIn } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const router = useRouter()

  const handleLoginClick = () => {
    setIsLoginModalOpen(true)
  }

  const handleStartClick = () => {
    setIsContactModalOpen(true)
  }

  const handleServiceNavigation = () => {
    router.push("/tjenester")
  }

  // Services data for ServiceCards component
  const services = [
    {
      title: "Innholdsproduksjon",
      content: "Innhold som skaper inntrykk, salg eller engasjement. Uansett ditt behov skaper vi innhold til anledningen",
      slug: "Innholdsproduksjon",
       image: "/creation.jpg",
    },
    {
      title: "Betalt annonsering",
      content: "vi hjelper deg med kampanjer som konverterer så du kan fokusere på det du er best på",
      slug: "Paidads",
       image: "/paid.jpg",
    },
    {
      title: "AI",
      content: "Har din bedrift behov for AI? Vi hjelper med å implementere løsninger som sparer tid og bemanning",
      slug: "AI",
       image: "/ai.jpg",
    },
    {
      title: "Rådgivning",
      content: "Lyst å gjøre jobben selv men trenger hjelp for å komme i gang? Vi hjelper dere på veien",
      slug: "Radgivning",
       image: "/consulting.jpg",
    },
  ]

  const features = ["Skreddersydde løsninger", "Erfarne fagfolk", "Innovativ teknologi", "Resultatorientert tilnærming"]

  return (
    <div className="space-y-32">
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* Simple background image approach */}
        <div className="absolute inset-0 bg-gray-900">
          <Image 
            src="/herobg.jpg"
            alt=""
            fill
            priority
            quality={100}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        
        <div className="container relative">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="animate-fade-in bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl md:text-7xl">
              Vi er Hepta, utviklere, markedsførere og problemløsere
            </h1>
            <p className="mt-8 animate-fade-in text-lg leading-relaxed text-gray-200 [animation-delay:200ms]">
              Vårt team av erfarne utviklere, designere og produktledere hjelper deg å realisere ideene dine. Enten du
              er en startup eller et stort selskap, har vi deg dekket.
            </p>
            <div className="mt-12 flex justify-center gap-4">
              <Button
                className="animate-fade-in h-14 px-8 text-lg [animation-delay:400ms]"
                size="lg"
                onClick={handleServiceNavigation}
              >
                se tjenester
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
        
        {/* Her importeres ServiceCards-komponenten */}
        <div className="mt-16">
          <ServiceCards services={services} />
        </div>
      </section>

      <section className="container">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="grid gap-8 p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black/50">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent" />
              <Image
                src="/team.jpg"
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
                <Button size="lg" className="group" asChild>
                  <Link href="/om-oss">
                    Mer om oss
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
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
              <p className="mt-4 text-xl text-gray-400">Ta kontakt for en uforpliktende samtale om ditt prosjekt</p>
              <div className="mt-8">
                <Button size="lg" className="h-14 px-8 text-lg" onClick={() => router.push("/contact")}>
                  Kontakt oss
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  )
}