"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight } from "lucide-react"

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
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) return null

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Våre tjenester</h1>
        <p className="max-w-2xl text-lg text-gray-400">
          I Hepta skredderføres et levende etter oppgaven, på tvers av kompetanseområder. Når vi samler krefter skaper
          vi helhetlig kommunikasjon med gode resultater.
        </p>
      </section>

      {/* Services Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dette er vi gode på</h2>
        <Accordion type="single" collapsible className="w-full">
          {services.map((service, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg">{service.title}</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">{service.content}</p>
                <Link
                  href={`/tjenester/${service.slug}`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600"
                >
                  Les mer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}

