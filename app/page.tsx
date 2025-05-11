// page.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import { LoginModal } from "@/components/login-modal";
import { ContactFormModal } from "@/components/contact-form-modal";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import ServiceCards from "@/components/serviceCards";
import BigTextGrid from "@/components/BigTextGrid";
import TextAndImage from '@/components/TextAndImage';
import ContactCallToAction from "@/components/ContactCallToAction"; // Ny import
import useIntersectionObserverInit from '@/hooks/useIntersectionObserverInit';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const router = useRouter();

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleStartClick = () => setIsContactModalOpen(true); // Antar at denne var for ContactFormModal
  const handleServiceNavigation = () => router.push("/tjenester");

  const services = [
    { title: "Innholdsproduksjon", content: "Innhold som skaper inntrykk, salg eller engasjement. Uansett ditt behov skaper vi innhold til anledningen", slug: "Innholdsproduksjon", image: "/creation.jpg" },
    { title: "Betalt annonsering", content: "vi hjelper deg med kampanjer som konverterer så du kan fokusere på det du er best på", slug: "Paidads", image: "/paid.jpg" },
    { title: "AI", content: "Har din bedrift behov for AI? Vi hjelper med å implementere løsninger som sparer tid og bemanning", slug: "AI", image: "/ai.jpg" },
    { title: "Rådgivning", content: "Lyst å gjøre jobben selv men trenger hjelp for å komme i gang? Vi hjelper dere på veien", slug: "Radgivning", image: "/consulting.jpg" },
  ];
  // const features = ["Skreddersydde løsninger", "Erfarne fagfolk", "Innovativ teknologi", "Resultatorientert tilnærming"]; // Fjernet da "Hvem er vi" er borte


  // --- For Color Changing Section ---
  const triggerSectionRef = useRef<HTMLDivElement | null>(null); // Denne ref-en er for TextAndImage-seksjonen
  const entry = useIntersectionObserverInit(triggerSectionRef, { threshold: 0.4, freezeOnceVisible: false });
  const shouldPageBeWhite = !!entry?.isIntersecting;

  // Data for TextAndImage i trigger-seksjonen
  const section1Data = {
    imageSrc: '/images/generic-placeholder-300x400.png',
    altText: 'Placeholder image 1 for strategic partnership section',
    title: 'Strategisk Partnerskap',
    paragraphs: [
      "Vi går dypere enn bare utførelse. Som din strategiske partner, jobber vi tett med deg for å forstå dine mål og utvikle skreddersydde digitale løsninger som gir reell verdi.",
      "Vår prosess er transparent, samarbeidsorientert og alltid fokusert på dine langsiktige suksess."
    ],
    imageContainerCustomClass: "aspect-[3/4] bg-gray-300 dark:bg-gray-700"
  };
  const section2Data = {
    imageSrc: '/images/generic-placeholder-300x400.png',
    altText: 'Placeholder image 2 for creativity and technology section',
    title: 'Kreativitet og Teknologi',
    paragraphs: [
      "Vi kombinerer nyskapende design med den nyeste teknologien for å skape digitale opplevelser som ikke bare ser bra ut, men som også fungerer feilfritt og engasjerer ditt publikum.",
      "Fra konsept til lansering, er kvalitet og innovasjon kjernen i alt vi gjør."
    ],
    imageContainerCustomClass: "aspect-[2/3] bg-gray-400 dark:bg-gray-600"
  };
  
  // Tekst for "eventyr" kontaktseksjon - Alternativ 2
  const contactAdventureData = {
    line1: "ET NYTT KAPITTEL",
    line2: "VENTER PÅ DEG.",
    line3: "TRYKK FOR Å AVDEKKE",
    line4: "POTENSIALET SAMMEN.",
    button: "START DITT NESTE KAPITTEL"
  };
  // --- End For Color Changing Section ---

  const defaultPageBg = "bg-gray-900 dark:bg-black"; 
  const defaultPageFg = "text-gray-100 dark:text-gray-50"; 
  const whitePageBg = "bg-white dark:bg-gray-100";
  const whitePageFg = "text-gray-900 dark:text-gray-800";
  
  // Blå tekst styling (hvis brukt globalt for den linjen)
  const blueResponsiveFontSize = "text-[clamp(1rem,_0.5rem_+_2vw,_2.5rem)]";
  const blueTextStyle = `font-bold ${blueResponsiveFontSize} text-blue-500 leading-tight tracking-tight`;


  return (
    <div 
      className={`min-h-screen w-full transition-colors duration-1000 ease-in-out ${
        shouldPageBeWhite 
          ? `${whitePageBg} ${whitePageFg}`
          : `${defaultPageBg} ${defaultPageFg}`
      }`}
    >
      <div className="space-y-32"> 
        
        {/* --------------- HERO SECTION STARTS HERE --------------- */}
        <section className="relative min-h-screen overflow-hidden pt-20">
          <div className={`absolute inset-0 ${shouldPageBeWhite ? 'opacity-0' : defaultPageBg } transition-opacity duration-1000`} />
          <Image
            src="/herobg.jpg"
            alt=""
            fill
            priority
            quality={100}
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${shouldPageBeWhite ? 'to-white dark:to-gray-100' : 'to-gray-900 dark:to-black'}`} />
          
          <div className="container mx-auto px-4 relative">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className={`animate-fade-in bg-gradient-to-br from-white to-gray-400 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl md:text-7xl`}>
              Vi forvandler digitale rom til vekstreiser gjennom sømløs sammenfletting av visjon og presisjon.
              </h1>
              <div className="mt-12 flex justify-center gap-4">
                <Button
                  className={`animate-fade-in h-14 px-8 text-lg [animation-delay:400ms] ${shouldPageBeWhite ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-gray-200 text-slate-900' }`}
                  size="lg"
                  onClick={handleServiceNavigation}
                >
                  se tjenester
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* --------------- HERO SECTION ENDS HERE --------------- */}

        {/* Den første BigTextGrid for hovedbudskapet ditt */}
        <BigTextGrid
          line1Text="WE CRAFT DIGITAL"
          // line1Placeholder={true} // Er standard true, kan fjernes hvis du vil ha den
          line2Text="EXPERIENCES THAT"
          // line2Placeholder={true}
          line3Text="TRULY RESONATE DEEPLY."
          // line3Placeholder={true}
          line4Text="INNOVATION DRIVES OUR EVERY MOVE."
          // buttonText="Utforsk Mer" // Eksempel hvis du vil ha knapp her
          // onButtonClick={() => console.log("Utforsk Mer klikket!")}
        />

        {/* --------------- HVA VI GJØR (ServiceCards) SECTION STARTS HERE --------------- */}
        <section>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight">Hva vi gjør</h2>
              <p className="mt-4 text-xl text-gray-400 dark:text-gray-500">
                Vi tilbyr en rekke tjenester for å hjelpe din bedrift å vokse og lykkes
              </p>
            </div>
            <div className="mt-16">
              <ServiceCards services={services} />
            </div>
          </div>
        </section>
        {/* --------------- HVA VI GJØR (ServiceCards) SECTION ENDS HERE --------------- */}

        {/* --------------- TRIGGER SECTION (Contains TextAndImage) STARTS HERE --------------- */}
        <section ref={triggerSectionRef} className="py-16 sm:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mb-16 md:mb-24">
              <TextAndImage
                imageSrc={section1Data.imageSrc}
                altText={section1Data.altText}
                title={section1Data.title}
                paragraphs={section1Data.paragraphs}
                imageOnLeft={false} 
                imageContainerClassName={section1Data.imageContainerCustomClass}
              />
            </div>
            <div>
              <TextAndImage
                imageSrc={section2Data.imageSrc}
                altText={section2Data.altText}
                title={section2Data.title}
                paragraphs={section2Data.paragraphs}
                imageOnLeft={true}
                imageContainerClassName={section2Data.imageContainerCustomClass}
              />
            </div>
          </div>
        </section>
        {/* --------------- TRIGGER SECTION ENDS HERE --------------- */}

        {/* NY ContactCallToAction SEKSJON */}
        <ContactCallToAction
          id="kontakt-oss" // Valgfri ID for ankerlenker
          line1={contactAdventureData.line1}
          line2={contactAdventureData.line2}
          line3={contactAdventureData.line3}
          line4={contactAdventureData.line4}
          buttonText={contactAdventureData.button}
          onButtonClick={() => router.push('/contact')} // Endre '/kontakt' til din faktiske kontaktside-URL
        />
        
        {/* ----- Blå Tekst (Valgfri) ----- */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-4">
          <p className={`${blueTextStyle}`}>
            {/* Du kan fjerne denne helt, eller endre teksten. For eksempel: */}
            {/* Vårt fundament for felles vekst. */}
          </p>
        </div>
        
        

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </div>
    </div>
  );
}