// app/om-oss/page.tsx
"use client"

import { ContactFormModal } from "@/components/contact-form-modal";
import { VideoHero } from '@/components/video-hero';
import { ImageTextSplitSection } from '@/components/image-text-split-section';
import { ContactCallToAction } from '@/components/ContactCallToAction';

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function OmOss() {
    const router = useRouter();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const kreativeMiljoImages = [
        "/artist.jpg",
    ];

    const teknologiSentrumImages = [
        "/technology.jpg",
    ];

    const omOssContactData = {
        line1: "KLAR FOR NESTE STEG?",
        line2: "LA OSS SKAPE NOE",
        line3: "UTROLIG SAMMEN.",
        buttonText: "KONTAKT OSS NÅ",
    };

    return (
        <div>
            {/* Video Hero Section (takes 50vh) */}
            <VideoHero
                videoSrc="/videos/omosshero.mp4"
                title="HEPTA"
                subtitle="solution consultants"
            />

            {/* Introductory Text Section - Modified for half-page height */}
            <section
                className="min-h-[50vh] flex flex-col items-center justify-center text-center py-12 sm:py-16 bg-background text-foreground px-4"
            >
                <div className="container"> {/* Container can still be used for max-width of text */}
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        HEPTA er din partner for digital transformasjon.
                    </h2>
                </div>
            </section>

            {/* First ImageTextSplitSection (Image on Left) */}
            <ImageTextSplitSection
                images={kreativeMiljoImages}
                heading="Vårt Kreative Miljø"
                text="Se innsiden av vårt kontor hvor ideer blir til virkelighet. Et dynamisk og inspirerende sted designet for samarbeid og nyskapning, utstyrt med den nyeste teknologien for å drive prosjektene dine fremover."
                imagePosition="left"
                backgroundColorClass="bg-slate-50 dark:bg-slate-900"
                enableAutoplay={true}
            />

            {/* Second ImageTextSplitSection (Image on Right) */}
            <ImageTextSplitSection
                images={teknologiSentrumImages}
                heading="Teknologi i Sentrum"
                text="Vi lever og ånder for teknologi. Vår tilnærming er bygget på å utnytte kraften i moderne verktøy og plattformer for å skape robuste, skalerbare og fremtidsrettede løsninger for våre kunder."
                imagePosition="right"
                backgroundColorClass="bg-background"
                enableAutoplay={false}
            />

            {/* CTA Section using ContactCallToAction */}
            <ContactCallToAction
                id="om-oss-kontakt"
                line1={omOssContactData.line1}
                line2={omOssContactData.line2}
                line3={omOssContactData.line3}
                buttonText={omOssContactData.buttonText}
                onButtonClick={() => router.push("/contact")}
            />

            {/* Contact Form Modal */}
            <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </div>
    );
}