"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ContactFormModal } from "@/components/contact-form-modal"
import { ServiceCards } from "@/components/serviceCards"
import { useRouter } from 'next/navigation'


const services = [
  {
    title: "Videoproduksjon",
    content:
      "Vi utvikler skreddersydde teknologiske løsninger som driver din virksomhet fremover. Vårt team av eksperter kombinerer innovativ tenkning med solid teknisk kompetanse.",
    slug: "Videoproduksjon",
    image: "/IMG_9003.JPG",
  },
  {
    title: "Utvikling",
    content:
      "Fra idé til lansering, vi skaper brukervennlige og effektive applikasjoner som møter dine forretningsbehov og engasjerer brukerne dine.",
    slug: "utvikling",
    image: "/consulting.jpg",
  },
  {
    title: "AI og automasjon",
    content:
      "Utnytt kraften i kunstig intelligens for å optimalisere prosesser, få verdifulle innsikter og skape innovative løsninger for din virksomhet.",
    slug: "AI",
    image: "/group11.png",

  },
  {
    title: "Digital markedsføring",
    content:
      "Vi hjelper deg å forstå data og trender for å ta bedre beslutninger. Våre analyseverktøy gir deg verdifull innsikt i din virksomhet.",
    slug: "Digitalmarkedsforing",
    image: "/ai.jpg",
  },
]

export default function Tjenester() {
  const router = useRouter()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
      <div className="container space-y-20 py-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl px-6 py-20 text-center sm:px-12">
          <div className="relative z-10">
            <h1 className="animate-fade-in bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
              Våre tjenester
            </h1>
            <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-lg text-gray-400 [animation-delay:200ms]">
              I Hepta skredderføres et levende etter oppgaven, på tvers av kompetanseområder. Når vi samler krefter skaper
              vi helhetlig kommunikasjon med gode resultater.
            </p>
          </div>
        </section>

      {/* Services Section - ERSTATTET MED NYE KORT */}
      <section className="space-y-8">

        
        {/* Importert ServiceCards-komponent */}
        <ServiceCards services={services} />
      </section>

      {/* CTA Section */}
      <section className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-16 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Klar for å starte ditt neste prosjekt?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          La oss sammen skape løsninger som driver din virksomhet fremover. Kontakt oss i dag for en uforpliktende
          samtale.
        </p>
        <Button size="lg" className="mt-8 h-14 px-8 text-lg" onClick={() => router.push("/contact")}>
    Kontakt oss
    <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
      </section>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  )
}