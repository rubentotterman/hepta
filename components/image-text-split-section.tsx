// components/image-text-split-section.tsx
"use client"

import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Optional: if you want autoplay

interface ImageTextSplitSectionProps {
    images: string[]; // Array of image URLs
    heading: string;
    text: string;
    imagePosition?: 'left' | 'right'; // To control image placement
    backgroundColorClass?: string;     // e.g., "bg-slate-100 dark:bg-slate-800"
    textColorClass?: string;           // e.g., "text-gray-900 dark:text-white"
    paragraphColorClass?: string;      // e.g., "text-gray-600 dark:text-gray-300"
    imageMinHeightClass?: string;      // e.g., "min-h-[300px] md:min-h-[400px]"
    enableAutoplay?: boolean;
}

export const ImageTextSplitSection: React.FC<ImageTextSplitSectionProps> = ({
                                                                                images,
                                                                                heading,
                                                                                text,
                                                                                imagePosition = 'left',
                                                                                backgroundColorClass = 'bg-background', // Default to theme's background
                                                                                textColorClass = 'text-foreground',       // Default to theme's foreground
                                                                                paragraphColorClass = 'text-muted-foreground', // Default to theme's muted foreground
                                                                                imageMinHeightClass = 'min-h-[350px] sm:min-h-[450px] md:min-h-[500px]', // Ensure some height
                                                                                enableAutoplay = false,
                                                                            }) => {
    const imageContent = (
        <div className={`w-full md:w-1/2 relative ${imageMinHeightClass}`}>
            {images && images.length > 0 ? (
                images.length > 1 ? (
                    <Carousel
                        className="w-full h-full"
                        plugins={enableAutoplay ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : []}
                        opts={{
                            loop: true,
                        }}
                    >
                        <CarouselContent className="h-full">
                            {images.map((src, index) => (
                                <CarouselItem key={index} className="h-full">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={src}
                                            alt={`${heading} - Bilde ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            priority={index === 0} // Prioritize loading the first image
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 sm:left-4" />
                        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 sm:right-4" />
                    </Carousel>
                ) : (
                    // Single image
                    <div className="relative w-full h-full">
                        <Image
                            src={images[0]}
                            alt={heading}
                            layout="fill"
                            objectFit="cover"
                            priority
                        />
                    </div>
                )
            ) : (
                // Placeholder if no images
                <div className={`w-full h-full flex items-center justify-center bg-muted ${imageMinHeightClass}`}>
                    <p className="text-muted-foreground">Bilde ikke tilgjengelig</p>
                </div>
            )}
        </div>
    );

    const textContent = (
        <div className="w-full md:w-1/2 p-8 py-12 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${textColorClass}`}>
                {heading}
            </h2>
            <p className={`text-base sm:text-lg ${paragraphColorClass}`}>
                {text}
            </p>
            {/* You could add a CTA button here if needed */}
        </div>
    );

    return (
        <section className={`flex flex-col md:flex-row items-stretch overflow-hidden ${backgroundColorClass}`}>
            {imagePosition === 'left' ? (
                <>
                    {imageContent}
                    {textContent}
                </>
            ) : (
                <>
                    {textContent}
                    {imageContent}
                </>
            )}
        </section>
    );
};