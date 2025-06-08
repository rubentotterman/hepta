"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from 'next/navigation'

const services = [
  {
    title: "AI og automasjon",
    description: "Innhold som skaper inntrykk, salg eller engasjement",
    content: "Vi utvikler skreddersydde innholdsløsninger som driver din virksomhet fremover. Fra video til grafisk design, vi skaper innhold som engasjerer.",
    slug: "AI",
    image: "/group11.png",
  },
  {
    title: "Videoproduksjon",
    description: "Fra idé til lansering",
    content: "Vi skaper brukervennlige og effektive applikasjoner som møter dine forretningsbehov og engasjerer brukerne dine.",
    slug: "Videoproduksjon",
    image: "/IMG_9003.JPG",
  },
  {
    title: "Digital markedsføring",
    description: "Fra idé til lansering",
    content: "Vi skaper brukervennlige og effektive applikasjoner som møter dine forretningsbehov og engasjerer brukerne dine.",
    slug: "Digitalmarkedsforing",
    image: "/digmark.jpg",
  },
  {
    title: "Utvikling",
    description: "Fra idé til lansering",
    content: "Vi skaper brukervennlige og effektive applikasjoner som møter dine forretningsbehov og engasjerer brukerne dine.",
    slug: "Utvikling",
    image: "/technology.jpg",
  },
]

export default function Tjenester() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Våre tjenester
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          I Hepta skreddersyr vi løsninger etter oppgaven, på tvers av kompetanseområder. 
          Når vi samler krefter skaper vi helhetlig kommunikasjon med gode resultater.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <Link 
            key={service.slug} 
            href={`/tjenester/${service.slug}`}
            className="group relative bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{service.description}</p>
              <p className="text-gray-300">{service.content}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Klar for å starte ditt neste prosjekt?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          La oss sammen skape løsninger som driver din virksomhet fremover. 
          Kontakt oss i dag for en uforpliktende samtale.
        </p>
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg"
          onClick={() => router.push("/contact")}
        >
          Kontakt oss
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  )
}