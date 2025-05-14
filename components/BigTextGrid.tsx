// components/BigTextGrid.tsx
import React from 'react';

import Image from "next/image";

// --- Placeholder Height (Increased) ---
const placeholderHeight = "h-[120px] sm:h-[160px] md:h-[200px] lg:h-[280px] xl:h-[350px]";

// Temporary styling for visualizing placeholders
const placeholderVisualizeStyle = "border border-dashed border-neutral-700 bg-neutral-800/30 flex items-center justify-center text-xs text-neutral-500 p-1";

// --- Main Text Styling (Increased MAX_SIZE in clamp) ---
const responsiveFontSize = "text-[clamp(1.25rem,_0.75rem_+_3vw,_3.5rem)]";
const mainTextStyle = `font-bold ${responsiveFontSize} tracking-tighter leading-none uppercase text-white whitespace-nowrap`;

// --- Styling for the LAST line ("INNOVATION DRIVES...") (Increased MAX_SIZE) ---
const lastLineResponsiveFontSize = "text-[clamp(1.25rem,_0.75rem_+_3vw,_3.5rem)]";
const lastLineTextStyle = `font-bold ${lastLineResponsiveFontSize} tracking-tighter leading-none uppercase text-white whitespace-nowrap`;

// Blue text styling (Increased)
const blueResponsiveFontSize = "text-[clamp(1rem,_0.5rem_+_2vw,_2.25rem)]";
const blueTextStyle = `font-bold ${blueResponsiveFontSize} text-blue-500 leading-tight tracking-tight`;

// Added 'export' to the const declaration
export const BigTextGrid: React.FC = () => {
    return (
        <div className="relative bg-black text-white min-h-screen flex flex-col justify-center items-center py-16 sm:py-24 px-2">
            <div aria-hidden="true" className="absolute top-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border border-neutral-800 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border border-neutral-800 rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-0">
                <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
                    {/* ----- ROW 1: "WE CRAFT DIGITAL" + Image Placeholder ----- */}
                    <div className="flex items-center justify-between space-x-3 sm:space-x-4">
                        <h1 className={`${mainTextStyle} flex-shrink min-w-0`}>
                            WE CRAFT DIGITAL
                        </h1>
                        <div
                            className={`flex-grow flex-shrink-0 basis-[20%] sm:basis-[40%] md:basis-[45%] ${placeholderHeight} rounded-lg overflow-hidden relative`}
                        >
                            <Image
                                src="/digital.png"
                                alt="Digital graphic"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                    </div>
                    {/* ----- ROW 2: Image Placeholder + "EXPERIENCES THAT" ----- */}
                    <div className="flex items-center justify-between space-x-3 sm:space-x-4">
                        <div
                            className={`flex-grow flex-shrink-0 basis-[20%] sm:basis-[45%] md:basis-[50%] ${placeholderHeight} rounded-lg overflow-hidden relative bg-neutral-800/30`}
                        >
                            <Image
                                src="/experiences.png"
                                alt="Experiences concept"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <h1 className={`${mainTextStyle} text-right flex-shrink min-w-0`}>
                            EXPERIENCES THAT
                        </h1>
                    </div>


                  {/* ----- ROW 3: "TRULY RESONATE DEEPLY." + Image Placeholder ----- */}
<div className="flex items-center justify-between space-x-3 sm:space-x-4">
  <h1 className={`${mainTextStyle} flex-shrink min-w-0`}>
    RESONATE DEEPLY.
  </h1>
  <div
    className={`flex-grow flex-shrink-0 basis-[35%] sm:basis-[45%] md:basis-[45%] ${placeholderHeight} rounded-lg overflow-hidden relative bg-neutral-800/30`}
  >
    <Image
      src="/ok.png"
      alt="Visual concept"
      fill
      className="object-cover"
      priority
    />
  </div>
</div>


                    {/* ----- ROW 4: "INNOVATION DRIVES OUR EVERY MOVE." (Full width) ----- */}
                    <div className="w-full pt-6 md:pt-2">
                        <h1 className={`${lastLineTextStyle} text-left`}>
                            INNOVATION DRIVES OUR EVERY MOVE.
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mt-10 sm:mt-12 md:mt-14 text-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-4">
                <p className={`${blueTextStyle}`}>
                    Together, we create growth.
                </p>
            </div>
        </div>
    );
};

// Removed 'export default BigTextGrid;'