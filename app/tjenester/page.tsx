"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { ContactFormModal } from "@/components/contact-form-modal"
import { useState } from "react"

const services = [
  {
    title: "Teknologi",
    content:
      "Vi utvikler skreddersydde teknologiske løsninger som driver din virksomhet fremover. Vårt team av eksperter kombinerer innovativ tenkning med solid teknisk kompetanse.",
    slug: "teknologi",
  },
  {
    title: "App-utvikling",
    content:
      "Fra idé til lansering, vi skaper brukervennlige og effektive applikasjoner som møter dine forretningsbehov og engasjerer brukerne dine.",
    slug: "app-utvikling",
  },
  {
    title: "AI",
    content:
      "Utnytt kraften i kunstig intelligens for å optimalisere prosesser, få verdifulle innsikter og skape innovative løsninger for din virksomhet.",
    slug: "ai",
  },
  {
    title: "Innsikt og analyse",
    content:
      "Vi hjelper deg å forstå data og trender for å ta bedre beslutninger. Våre analyseverktøy gir deg verdifull innsikt i din virksomhet.",
    slug: "innsikt-og-analyse",
  },
  {
    title: "Kommunikasjon og PR",
    content:
      "Effektiv kommunikasjon som når frem og skaper resultater. Vi hjelper deg å bygge sterke relasjoner med dine målgrupper.",
    slug: "kommunikasjon-og-pr",
  },
  {
    title: "Innholdsprodusering",
    content:
      "Kreativt og engasjerende innhold som forteller din historie. Vi skaper innhold som resonerer med din målgruppe og støtter dine mål.",
    slug: "innholdsprodusering",
  },
  {
    title: "Design",
    content:
      "Vi skaper visuell kommunikasjon som gjør inntrykk. Våre designere kombinerer kreativitet med strategisk tenkning.",
    slug: "design",
  },
  {
    title: "Animering",
    content:
      "Bring historier til live gjennom animasjon. Vi skaper engasjerende animert innhold som fenger og formidler.",
    slug: "animering",
  },
  {
    title: "Film og animasjon",
    content:
      "Fra konsept til ferdig produksjon, vi lager film og animasjoner som engasjerer og inspirerer ditt publikum.",
    slug: "film-og-animasjon",
  },
  {
    title: "Faglig påfyll",
    content:
      "Hold deg oppdatert med våre kurs og workshops. Vi deler kunnskap og beste praksis innen digitale løsninger og kommunikasjon.",
    slug: "faglig-pafyll",
  },
]

export default function Tjenester() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
    <div className="container space-y-20 py-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-20 text-center sm:px-12">
        <div className="relative z-10">
          <h1 className="animate-fade-in bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Våre tjenester
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-lg text-gray-400 [animation-delay:200ms]">
            I Hepta skredderføres et levende etter oppgaven, på tvers av kompetanseområder. Når vi samler krefter skaper
            vi helhetlig kommunikasjon med gode resultater.
          </p>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
      </section>

      {/* Services Section */}
      <section className="space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Dette er vi gode på</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-2 text-gray-400">{service.content}</p>
                <Button
                  asChild
                  variant="link"
                  className="mt-4 h-auto p-0 text-orange-500 transition-colors hover:text-orange-400"
                >
                  <Link href={`/tjenester/${service.slug}`} className="group inline-flex items-center">
                    Les mer
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-16 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Klar for å starte ditt neste prosjekt?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          La oss sammen skape løsninger som driver din virksomhet fremover. Kontakt oss i dag for en uforpliktende
          samtale.
        </p>
        <Button size="lg" className="mt-8 h-14 px-8 text-lg" onClick={() => setIsContactModalOpen(true)}>
          Kontakt oss
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  )
}

