// components/TextAndImage.tsx
"use client";

import Image from 'next/image';
import React from 'react';

interface TextAndImageProps {
  imageSrc: string;
  altText: string;
  title: string;
  paragraphs: string[];
  imageOnLeft?: boolean;
  imageClassName?: string;
  textContainerClassName?: string;
  imageContainerClassName?: string;
  // Adding 'imageContainerCustomClass' to the interface, as it's used in your Home page
  imageContainerCustomClass?: string;
}

// Added 'export' to the const declaration
export const TextAndImage: React.FC<TextAndImageProps> = ({
                                                            imageSrc,
                                                            altText,
                                                            title,
                                                            paragraphs,
                                                            imageOnLeft = false,
                                                            imageClassName = "object-cover",
                                                            textContainerClassName = "",
                                                            imageContainerClassName = "aspect-[3/4] sm:aspect-[2/3]", // Default value
                                                            imageContainerCustomClass // This will be used if provided from Home page
                                                          }) => {
  const textContent = (
      <div className={`space-y-4 md:space-y-6 ${textContainerClassName}`}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h2>
        {paragraphs.map((p, index) => (
            <p key={index} className="text-base sm:text-lg  leading-relaxed">
              {p}
            </p>
        ))}
      </div>
  );

  const imageContent = (
      // Use imageContainerCustomClass if provided, otherwise fall back to imageContainerClassName
      <div className={`relative w-full ${imageContainerCustomClass || imageContainerClassName} overflow-hidden rounded-lg shadow-lg`}>
        <Image
            src={imageSrc}
            alt={altText}
            layout="fill"
            className={imageClassName}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
  );

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {imageOnLeft ? (
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
      </div>
  );
};

// Removed 'export default TextAndImage;'