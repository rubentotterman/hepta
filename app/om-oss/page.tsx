"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Code, Lightbulb, Megaphone } from "lucide-react"

export default function OmOss() {
  // Remove the useEffect that redirects to dashboard
  // Remove the early return if isLoggedIn

  const capabilities = [
    {
      title: "Markedsføring",
      icon: Megaphone,
      description: "Strategisk markedsføring som driver vekst og engasjement for din bedrift.",
    },
    {
      title: "Utvikling",
      icon: Code,
      description: "Skreddersydd programvareutvikling som bringer dine ideer til live.",
    },
    {
      title: "AI Workshops",
      icon: Lightbulb,
      description: "Innovative AI-workshops som gir deg konkurransefortrinn i den digitale verden.",
    },
  ]

  const teamMembers = [
    { name: "Anna Larsen", role: "CEO & Markedsføringssjef", image: "/placeholder.svg?height=400&width=400" },
    { name: "Erik Hansen", role: "CTO & Utviklingsleder", image: "/placeholder.svg?height=400&width=400" },
    { name: "Sofie Berg", role: "AI Spesialist", image: "/placeholder.svg?height=400&width=400" },
  ]

  return (
    <div className="container space-y-20 py-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-20 text-center sm:px-12">
        <div className="relative z-10">
          <h1 className="animate-fade-in bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Om Hepta
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-lg text-gray-400 [animation-delay:200ms]">
            Vi er et allsidig team av eksperter innen markedsføring, utvikling og AI. Vår misjon er å drive innovasjon
            og vekst for våre klienter gjennom skreddersydde digitale løsninger.
          </p>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
      </section>

      {/* Capabilities Section */}
      <section className="space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Våre Kjernekompetanser</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability, index) => (
            <Card
              key={index}
              className="overflow-hidden border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <capability.icon className="mb-4 h-12 w-12 text-orange-500" />
                <h3 className="text-2xl font-semibold tracking-tight">{capability.title}</h3>
                <p className="mt-2 text-gray-400">{capability.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Møt Vårt Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={400}
                height={400}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-orange-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-16 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Vår Misjon</h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-400">
          Hepta er dedikert til å drive digital innovasjon og vekst for våre klienter. Ved å kombinere ekspertise innen
          markedsføring, utvikling og AI, skaper vi helhetlige løsninger som gir målbare resultater og langsiktig
          suksess.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Klar for å samarbeide?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
          La oss sammen skape innovative løsninger som driver din virksomhet fremover. Kontakt oss i dag for en
          uforpliktende samtale om ditt neste prosjekt.
        </p>
        <Button size="lg" className="mt-8 h-14 px-8 text-lg">
          Kontakt oss
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  )
}

