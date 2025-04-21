"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

// Type definisjon for tjenestekort
interface Service {
  title: string
  content: string
  slug: string
  bgColor?: string
  accentColor?: string
}

interface ServiceCardsProps {
  services: Service[]
}

// Definerer tilfeldig bakgrunnsbilde for hver tjeneste (disse kan erstattes med faktiske bilder)
const serviceBgColors = [
  "from-blue-900 to-blue-950",
  "from-purple-900 to-purple-950",
  "from-orange-900 to-orange-950",
  "from-green-900 to-green-950",
  "from-red-900 to-red-950",
  "from-pink-900 to-pink-950",
  "from-indigo-900 to-indigo-950",
  "from-yellow-900 to-yellow-950",
  "from-teal-900 to-teal-950",
  "from-cyan-900 to-cyan-950",
]

// Definerer accentfarge for hver tjeneste
const serviceAccentColors = [
  "bg-blue-500",
  "bg-purple-400",
  "bg-orange-500",
  "bg-green-500",
  "bg-red-400",
  "bg-pink-500",
  "bg-indigo-400",
  "bg-yellow-400",
  "bg-teal-400",
  "bg-cyan-500",
]

const ServiceCards = ({ services }: ServiceCardsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Beregner hvilke kort som skal vises og legger til farger
  const visibleCards = services.map((service, index) => ({
    ...service,
    bgColor: service.bgColor || serviceBgColors[index % serviceBgColors.length],
    accentColor: service.accentColor || serviceAccentColors[index % serviceAccentColors.length],
  }));
  
  const goToPrevious = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? services.length - 1 : prev - 1;
      
      // Scroller til det nye kortet
      const container = document.getElementById('service-cards-container');
      const card = document.getElementById(`service-card-${newIndex}`);
      
      if (container && card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => setIsScrolling(false), 500);
      return newIndex;
    });
  };
  
  const goToNext = () => {
    if (isScrolling) return;
    setIsScrolling(true);
    
    setCurrentIndex((prev) => {
      const newIndex = prev === services.length - 1 ? 0 : prev + 1;
      
      // Scroller til det nye kortet
      const container = document.getElementById('service-cards-container');
      const card = document.getElementById(`service-card-${newIndex}`);
      
      if (container && card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => setIsScrolling(false), 500);
      return newIndex;
    });
  };
  
  return (
    <div className="relative py-12">
      {/* Kort-container */}
      <div 
        id="service-cards-container"
        className="flex snap-x snap-mandatory overflow-x-auto hide-scrollbar pb-12 gap-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleCards.map((service, index) => (
          <div 
            id={`service-card-${index}`}
            key={service.slug} 
            className="flex-shrink-0 snap-center first:ml-12 last:mr-12"
            style={{ width: '320px' }} // Økt bredde fra 280px til 320px
          >
            <div 
              className={`relative rounded-lg overflow-hidden shadow-2xl h-[540px] bg-gradient-to-b ${service.bgColor} transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transform-gpu`}
            >
              {/* Tekstinnhold - plassert nederst på kortet */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start">
                {/* Tittel - stort, fet skrift */}
                <h3 className={`text-4xl font-bold text-white mb-6 ${service.title.length > 15 ? 'text-3xl' : 'text-4xl'}`}>
                  {service.title.toUpperCase()}
                </h3>
                
                {/* Farget linje */}
                <div className={`h-1 w-20 mb-6 ${service.accentColor}`}></div>
                
                {/* Beskrivelse - første del av beskrivelsen */}
                <p className="text-white text-base opacity-90">
                  {service.content.length > 100 
                    ? `${service.content.substring(0, 100)}...` 
                    : service.content}
                </p>
                
                {/* Les mer lenke */}
                <Link 
                  href={`/tjenester/${service.slug}`}
                  className="mt-6 text-white text-base flex items-center group hover:text-orange-400 transition-colors"
                >
                  <span>Les mer</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigasjonsknapper */}
      <div className="flex justify-between w-full max-w-6xl mx-auto px-8 mt-6">
        <button 
          onClick={goToPrevious}
          className="bg-black border border-gray-800 hover:bg-gray-900 text-white rounded-full p-3 focus:outline-none transition-all hover:scale-110"
          aria-label="Forrige"
          disabled={isScrolling}
        >
          <ArrowLeft size={28} />
        </button>
        
        <button 
          onClick={goToNext}
          className="bg-white hover:bg-gray-100 text-black rounded-full p-3 focus:outline-none transition-all hover:scale-110"
          aria-label="Neste"
          disabled={isScrolling}
        >
          <ArrowRight size={28} />
        </button>
      </div>
      
      {/* CSS for å skjule scrollbar men beholde funksjonalitet */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ServiceCards;