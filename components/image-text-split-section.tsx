// components/image-text-split-section.tsx
"use client";

import React from "react";
import Image from "next/image";

// Props interface for ImageTextSplitSection
interface ImageTextSplitSectionProps {
    imageSrc: string;
    altText: string;
    title: string;
    paragraphs: string[];
    imageOnLeft: boolean;
    imageContainerCustomClass?: string;
    isTextBlack?: boolean;
}

// Component renamed to ImageTextSplitSection
export const ImageTextSplitSection: React.FC<ImageTextSplitSectionProps> = ({
                                                                                imageSrc,
                                                                                altText,
                                                                                title,
                                                                                paragraphs,
                                                                                imageOnLeft,
                                                                                imageContainerCustomClass = "",
                                                                                isTextBlack = false,
                                                                            }) => {
    const titleColorClass = isTextBlack ? "text-black" : "text-white";
    const paragraphColorClass = isTextBlack ? "text-black" : "text-white";

    const TextBlock = (
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${titleColorClass}`}>
                {title}
            </h2>
            {paragraphs.map((p, idx) => (
                <p key={idx} className={`mb-4 text-base sm:text-lg ${paragraphColorClass}`}>
                    {p}
                </p>
            ))}
        </div>
    );

    const ImageBlock = (
        <div className={`w-full md:w-1/2 relative ${imageContainerCustomClass}`}>
            <Image
                src={imageSrc}
                alt={altText}
                fill
                className="object-cover rounded-lg"
                priority // Consider if priority is needed for all instances
            />
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
            {imageOnLeft ? (
                <>
                    {ImageBlock}
                    {TextBlock}
                </>
            ) : (
                <>
                    {TextBlock}
                    {ImageBlock}
                </>
            )}
        </div>
    );
};