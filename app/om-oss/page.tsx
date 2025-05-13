// app/om-oss/page.tsx
"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ContactFormModal } from "@/components/contact-form-modal";
import { VideoHero } from '@/components/video-hero';
import { ImageTextSplitSection } from '@/components/image-text-split-section';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function OmOss() {
    const router = useRouter();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Example images for the ImageTextSplitSection components
    // Ensure these image paths are correct and files exist in your /public/images/ directory
    const officeImages1 = [
        "/images/office-1.jpg",
        "/images/office-2.jpg",
    ];

    const officeImages2 = [
        "/images/tech-1.jpg",
        "/images/team-meeting.jpg",
    ];

    return (
        <div>
            {/* Video Hero Section */}
            <VideoHero
                videoSrc="/videos/omosshero.mp4"
                title="HEPTA"
                subtitle="solution consultants"
            />

            {/* Introductory Text Section Below Video Hero */}
            <section className="py-16 text-center sm:py-20 bg-background text-foreground">
                <div className="container">
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        HEPTA er din partner for digital transformasjon.
                    </h2>
                    <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl">
                        Vi er et dedikert team som brenner for å bygge innovative løsninger som ikke bare møter dagens behov,
                        men også ruster din bedrift for fremtiden. Med en fot i teknologi og den andre i strategi,
                        hjelper vi deg å navigere det digitale landskapet.
                    </p>
                </div>
            </section>

            {/* First ImageTextSplitSection (Image on Left) */}
            <ImageTextSplitSection
                images={officeImages1}
                heading="Vårt Kreative Miljø"
                text="Se innsiden av vårt kontor hvor ideer blir til virkelighet. Et dynamisk og inspirerende sted designet for samarbeid og nyskapning, utstyrt med den nyeste teknologien for å drive prosjektene dine fremover."
                imagePosition="left"
                backgroundColorClass="bg-slate-50 dark:bg-slate-900"
                enableAutoplay={true}
            />

            {/* Second ImageTextSplitSection (Image on Right) */}
            <ImageTextSplitSection
                images={officeImages2}
                heading="Teknologi i Sentrum"
                text="Vi lever og ånder for teknologi. Vår tilnærming er bygget på å utnytte kraften i moderne verktøy og plattformer for å skape robuste, skalerbare og fremtidsrettede løsninger for våre kunder."
                imagePosition="right"
                backgroundColorClass="bg-background"
                enableAutoplay={false}
            />

            {/* CTA Section */}
            <div className="container py-16 sm:py-20 bg-background">
                <section className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Klar for å samarbeide?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                        La oss sammen skape innovative løsninger som driver din virksomhet fremover. Kontakt oss i dag for en
                        uforpliktende samtale om ditt neste prosjekt.
                    </p>
                    <Button size="lg" className="mt-8 h-14 px-8 text-lg" onClick={() => router.push("/contact")}>
                        Kontakt oss
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </section>
            </div>

            {/* Contact Form Modal */}
            <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </div>
    );
}