"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const services = [
  {
    title: "Teknologi",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "App-utvikling",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "AI",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Innsikt og analyse",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Kommunikasjon og PR",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Innholdsprodusering",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Design",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Animering",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Film og animasjon",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    title: "Faglig påfyll",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
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
              <AccordionContent>{service.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}

