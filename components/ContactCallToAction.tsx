// components/ContactCallToAction.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// --- Styling & Dimensjoner ---
const rowHeight = "h-16 sm:h-20 md:h-24 lg:h-28";
const responsiveFontSize = "text-[clamp(1rem,_0.5rem_+_3vw,_3rem)]";
const textStyle = `font-bold ${responsiveFontSize} tracking-tighter leading-none uppercase text-white whitespace-nowrap`;

// Props
interface ContactCallToActionProps {
  line1: string;
  line2: string;
  line3: string; // Ensuring this prop is defined in the interface
  buttonText: string;
  onButtonClick: () => void;
  id?: string;
  // Add line4 if your omOssContactData intends to use it.
  // For now, matching the component's current usage of line1, line2, line3.
}

// Changed to a named export by adding 'export' before 'const'
export const ContactCallToAction: React.FC<ContactCallToActionProps> = ({
                                                                          line1,
                                                                          line2,
                                                                          line3, // Make sure this is destructured
                                                                          buttonText,
                                                                          onButtonClick,
                                                                          id,
                                                                        }) => {
  const textWidthRow1 = "w-[60%]"; const placeholderWidthRow1 = "w-[35%]";
  const placeholderWidthRow2 = "w-[35%]"; const textWidthRow2 = "w-[60%]";
  const textWidthRow3 = "w-[65%]"; const placeholderWidthRow3 = "w-[30%]";

  const placeholderVisualizeStyle = "border border-dashed border-neutral-700 bg-neutral-800/30 flex items-center justify-center text-xs text-neutral-500 p-1 rounded-lg";

  return (
      <section id={id} className="relative bg-black text-white min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center items-center py-16 sm:py-20 px-4">
        <div aria-hidden="true" className="absolute top-0 left-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-neutral-800 rounded-full -translate-x-1/3 -translate-y-1/3 opacity-40" />
        <div aria-hidden="true" className="absolute bottom-0 right-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-neutral-800 rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />

        <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl text-left">
          <div className="flex flex-col space-y-2 sm:space-y-3">
            {/* ----- RAD 1: "ET NYTT KAPITTEL" + Placeholder P1 ----- */}
            <div className={`relative flex justify-between items-center ${rowHeight}`}>
              <div className={`absolute left-0 top-0 bottom-0 flex items-center ${textWidthRow1}`}>
                <h1 className={`${textStyle} truncate`}>{line1}</h1>
              </div>
              <div className={`absolute right-0 top-0 bottom-0 ${placeholderWidthRow1} ${placeholderVisualizeStyle}`}>P1</div>
            </div>

            {/* ----- RAD 2: Placeholder P2 + "VENTER PÅ DEG." ----- */}
            <div className={`relative flex justify-between items-center ${rowHeight}`}>
              <div className={`absolute left-0 top-0 bottom-0 ${placeholderWidthRow2} ${placeholderVisualizeStyle}`}>P2</div>
              <div className={`absolute right-0 top-0 bottom-0 flex items-center justify-end ${textWidthRow2}`}>
                <h1 className={`${textStyle} text-right truncate`}>{line2}</h1>
              </div>
            </div>

            {/* ----- RAD 3: "TRYKK FOR Å AVDEKKE" + Placeholder P3 ----- */}
            <div className={`relative flex justify-between items-center ${rowHeight}`}>
              <div className={`absolute left-0 top-0 bottom-0 flex items-center ${textWidthRow3}`}>
                <h1 className={`${textStyle} truncate`}>{line3}</h1>
              </div>
              <div className={`absolute right-0 top-0 bottom-0 ${placeholderWidthRow3} ${placeholderVisualizeStyle}`}>P3</div>
            </div>

            {/* ----- RAD 4: KNAPPEN "POTENSIALET SAMMEN." (Full bredde, blå boks) ----- */}
            <div className="w-full pt-6 sm:pt-8">
              <Button
                  onClick={onButtonClick}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-lg transform hover:scale-105 transition-transform duration-150 ease-in-out group"
              >
                <div className={`flex items-center justify-center w-full ${rowHeight} px-4`}>
                <span className={`${textStyle.replace('text-white', '')}`}>
                  {buttonText}
                </span>
                  <ArrowRight className="ml-auto h-5 w-5 sm:h-6 sm:w-6 pl-2 sm:pl-3" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
  );
};

// Removed 'export default ContactCallToAction;'