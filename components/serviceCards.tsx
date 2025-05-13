// components/serviceCards.tsx
"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface Service {
  title: string; // Can contain "\n" for line breaks
  content: string; // This will be the subtitle
  slug: string;
  image?: string;
  accentColorClass?: string; // Use this to match the provided image's accent colors
}

interface ServiceCardsProps {
  services: Service[];
}

// Updated to match example image more closely
const defaultAccentColors = [
  "bg-blue-500",
];

export const ServiceCards = ({ services }: ServiceCardsProps) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCards = services.map((service, index) => ({
    ...service,
    accentColorClass: service.accentColorClass || defaultAccentColors[index % defaultAccentColors.length],
  }));

  const scroll = (direction: 'left' | 'right') => {
    if (isScrolling || !containerRef.current) return;
    setIsScrolling(true);
    const container = containerRef.current;
    const firstCard = container.firstChild as HTMLElement;
    if (!firstCard) {
      setIsScrolling(false);
      return;
    }
    const cardWidth = firstCard.offsetWidth;
    // Get gap from computed style
    const gapStyle = window.getComputedStyle(container).getPropertyValue('gap');
    const gap = parseInt(gapStyle) || 32; // Default gap if not found

    const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 500);
  };

  return (
      <div className="relative py-12 md:py-16 lg:py-20 bg-black">
        <div
            ref={containerRef}
            id="service-cards-container"
            className="flex snap-x snap-mandatory overflow-x-auto hide-scrollbar pb-8 md:pb-12 gap-x-6 sm:gap-x-8 md:gap-x-10 px-4 sm:px-6 md:px-8 lg:px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleCards.map((service, index) => (
              <Link
                  href={`/tjenester/${service.slug}`}
                  key={service.slug}
                  className="group flex-shrink-0 snap-center block w-[280px] sm:w-[300px] md:w-[340px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white"
                  passHref
              >
                <div // This div is now the visual card that receives hover effects
                    className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg h-[420px] sm:h-[460px] md:h-[500px] transition-all duration-300 group-hover:shadow-2xl transform-gpu" // Restored previous shadow logic
                >
                  {service.image && (
                      <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105" // Restored image zoom
                            sizes="(max-width: 640px) 280px, (max-width: 768px) 300px, 340px"
                            priority={index <= 2}
                        />
                        {/* Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-300" />
                      </div>
                  )}
                  {!service.image && (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                        <p className="text-neutral-500">Image not available</p>
                      </div>
                  )}

                  {/* Text Content Wrapper - Positioned towards the bottom AND CENTERED */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-7 z-10 flex flex-col items-center text-center"> {/* Added items-center and text-center */}
                    <h3 className="font-semibold text-white text-3xl sm:text-4xl leading-tight sm:leading-tight mb-2 sm:mb-3" style={{ whiteSpace: 'pre-line' }}>
                      {service.title}
                    </h3>

                    {/* Accent line will be centered due to parent's items-center */}
                    <div className={`h-[3px] w-16 sm:w-[70px] mb-3 sm:mb-4 ${service.accentColorClass}`}></div>

                    <p className="text-neutral-200 text-sm sm:text-base leading-normal">
                      {service.content}
                    </p>

                    {/* "Les mer" element completely removed */}
                  </div>
                </div>
              </Link>
          ))}
        </div>

        <div className="flex justify-center gap-x-3 sm:gap-x-4 w-full mx-auto mt-8 md:mt-10">
          <button
              onClick={() => scroll('left')}
              className="bg-neutral-800/80 hover:bg-neutral-700/90 text-white rounded-full p-2.5 sm:p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white transition-all hover:scale-105 disabled:opacity-50"
              aria-label="Forrige"
              disabled={isScrolling}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          <button
              onClick={() => scroll('right')}
              className="bg-neutral-800/80 hover:bg-neutral-700/90 text-white rounded-full p-2.5 sm:p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-white transition-all hover:scale-105 disabled:opacity-50"
              aria-label="Neste"
              disabled={isScrolling}
          >
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
  );
};