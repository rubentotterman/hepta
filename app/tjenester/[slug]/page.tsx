"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const services = {
  Innholdsproduksjon: {
    title: "innholdsproduksjon",
    description: "Innhold som skaper inntrykk, salg eller engasjement. Uansett ditt behov skaper vi innhold til anledningen",
    content: `Teknologi er kjernen i moderne forretningsutvikling. Vårt team av eksperter kombinerer innovativ tenkning med solid teknisk kompetanse for å skape løsninger som gir din virksomhet et konkurransefortrinn.

    Vi tilbyr:
    • Skreddersydd Filmproduksjon
    • Logo, firmaprofil og grafisk design
    • Teksting og oversettelse
    • Animasjon og motion graphics
    
    Vi lager innholdet som folket elsker å dele. Fra reklamefilmer til bedriftsvideoer, vi skaper innhold som engasjerer og konverterer.`,
  },
  "app-utvikling": {
    title: "App-utvikling",
    description: "Fra idé til lansering, vi skaper brukervennlige og effektive applikasjoner.",
    content: `Vi utvikler mobile og web-applikasjoner som møter dine forretningsbehov og engasjerer brukerne dine. Med fokus på brukeropplevelse og teknisk kvalitet, skaper vi applikasjoner som gir verdi.

    Våre tjenester inkluderer:
    • Native iOS og Android-utvikling
    • Cross-platform løsninger
    • Progressive Web Apps (PWA)
    • UX/UI-design
    • App-vedlikehold og support`,
  },
  AI: {
    title: "AI",
    description: "Utnytt kraften i kunstig intelligens for å optimalisere din virksomhet.",
    content: `Kunstig intelligens revolusjonerer måten vi jobber på. Vi hjelper deg å implementere AI-løsninger som gir konkurransefortrinn og effektiviserer arbeidsprosesser.

    Våre AI-tjenester omfatter:
    • Maskinlæring og prediktiv analyse
    • Naturlig språkprosessering
    • Computer Vision
    • Chatbots og automatisering
    • AI-strategi og implementering`,
  },
  "innsikt-og-analyse": {
    title: "Innsikt og analyse",
    description: "Vi hjelper deg å forstå data og trender for å ta bedre beslutninger.",
    content: `Data er nøkkelen til innsikt og bedre beslutninger. Vi hjelper deg å samle, analysere og visualisere data på en måte som gir verdifull innsikt for din virksomhet.

    Vi tilbyr:
    • Dataanalyse og visualisering
    • Business Intelligence
    • Markedsanalyse
    • Kundeanalyse
    • Rapportering og dashboards`,
  },
  "kommunikasjon-og-pr": {
    title: "Kommunikasjon og PR",
    description: "Effektiv kommunikasjon som når frem og skaper resultater.",
    content: `God kommunikasjon er avgjørende for å bygge sterke relasjoner med dine målgrupper. Vi hjelper deg å utvikle og gjennomføre kommunikasjonsstrategier som gir resultater.

    Våre tjenester inkluderer:
    • Strategisk kommunikasjon
    • Medierelasjon
    • Krisekommunikasjon
    • Intern kommunikasjon
    • Digital PR og omdømmebygging`,
  },
  Paidads: {
    title: "Betalt annonsering",
    description: "Vi hjelper deg med kampanjer som konverterer.",
    content: `Betalt annonsering er en effektiv måte å nå ut til målgruppen din på. Vi hjelper deg med å utvikle og implementere annonseringsstrategier som gir resultater.
    
    Vi tilbyr:
    • Meta annonsering
    • Google Ads
    • YouTube annonsering
    • TikTok annonsering
    • LinkedIn annonsering
    • Analyse av 
    • Sosiale medier-innhold
    • Nyhetsbrev og e-post
    • Content marketing-strategi`,
  },
  design: {
    title: "Design",
    description: "Vi skaper visuell kommunikasjon som gjør inntrykk.",
    content: `God design handler om mer enn estetikk. Vi kombinerer kreativitet med strategisk tenkning for å skape design som kommuniserer effektivt og støtter dine forretningsmål.

    Våre designtjenester omfatter:
    • Grafisk design
    • UX/UI-design
    • Identitetsdesign
    • Emballasjedesign
    • Digital design`,
  },
  Radgivning: {
    title: "Rådgivning",
    description: "Lyst å gjøre jobben selv men trenger hjelp for å komme i gang? Vi hjelper dere på veien",
    content: `Vi hjelper dere med å utvikle gode kampanjer som konverterer og/ eller skaper inntrykk. Vår rådgivning baserer seg på resultat og fokuserer på at dere skal lykkes med deres mål.

    Vi tilbyr:
    • SoMe rådgivning
    • Kampanjerådgivning
    • PR og kommunikasjonsrådgivning
    • Målgruppeanalyse
    • Strategisk rådgivning`,
  },
  "film-og-animasjon": {
    title: "Film og animasjon",
    description: "Fra konsept til ferdig produksjon, vi lager film som engasjerer.",
    content: `Vi kombinerer kreativ historiefortelling med teknisk ekspertise for å skape film- og animasjonsinnhold som engasjerer og inspirerer ditt publikum.

    Våre tjenester inkluderer:
    • Reklameproduksjon
    • Dokumentarfilm
    • Bedriftspresentasjoner
    • Sosiale medier-innhold
    • Live-action og animasjon`,
  },
  "faglig-pafyll": {
    title: "Faglig påfyll",
    description: "Hold deg oppdatert med våre kurs og workshops.",
    content: `Vi deler vår kunnskap og erfaring gjennom kurs, workshops og seminarer. Hold deg oppdatert på de nyeste trendene og beste praksisene innen digitale løsninger og kommunikasjon.

    Vi tilbyr:
    • Faglige workshops
    • Digitale kurs
    • Skreddersydde opplæringsprogrammer
    • Seminarer og webinarer
    • Konsulentbistand`,
  },
}

export default function ServicePage() {
  const params = useParams()
  const slug = params?.slug as string
  const service = services[slug as keyof typeof services]

  if (!service) return null

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-4">
        <Link href="/tjenester" className="inline-flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake til tjenester
        </Link>
        <h1 className="text-4xl font-bold">{service.title}</h1>
        <p className="text-xl text-gray-400">{service.description}</p>
      </div>

      <div className="prose prose-invert max-w-none">
        {service.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="pt-8">
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/kontakt">Kontakt oss</Link>
        </Button>
      </div>
    </div>
  )
}

