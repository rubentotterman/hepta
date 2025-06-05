// app/om-oss/page.tsx
"use client"

import { ContactFormModal } from "@/components/contact-form-modal";
import { VideoHero } from '@/components/video-hero';
import { ImageTextSplitSection } from '@/components/image-text-split-section'; // This import is now correct
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

    // Define alt texts (could be more descriptive)
    const kreativeMiljoAltText = "Interiør av Heptas kreative kontormiljø";
    const teknologiSentrumAltText = "Abstrakt representasjon av teknologi";

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
                <div className="container">
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        HEPTA er din partner for digital transformasjon.
                    </h2>
                </div>
            </section>

            {/* First ImageTextSplitSection (Image on Left) */}
            {/* Apply backgroundColorClass to a wrapper div */}


            {/* Second ImageTextSplitSection (Image on Right) */}
            {/* Apply backgroundColorClass to a wrapper div */}
            <div className="bg-background py-12 sm:py-16"> {/* Added padding to wrapper */}
                <div className="container mx-auto"> {/* Optional: Add container for content width control */}
                    <ImageTextSplitSection
                        imageSrc={teknologiSentrumImages[0]} // Mapped from images
                        altText={teknologiSentrumAltText}    // Added alt text
                        title="Teknologi i Sentrum"          // Mapped from heading
                        paragraphs={["Vi lever og ånder for teknologi. Vår tilnærming er bygget på å utnytte kraften i moderne verktøy og plattformer for å skape robuste, skalerbare og fremtidsrettede løsninger for våre kunder."]} // Mapped from text
                        imageOnLeft={false}                  // Mapped from imagePosition="right"
                        isTextBlack={true}                   // Assuming light background needs black text
                        // enableAutoplay is not a prop of this component
                    />
                </div>
            </div>

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