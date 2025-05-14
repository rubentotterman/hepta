"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const rowHeight = "h-[120px] sm:h-[160px] md:h-[200px] lg:h-[280px] xl:h-[350px]";
const responsiveFontSize = "text-[clamp(1rem,_0.5rem_+_3vw,_3rem)]";
const textStyle = `font-bold ${responsiveFontSize} tracking-tighter leading-none uppercase text-white whitespace-nowrap`;

interface ContactCallToActionProps {
  line1: string;
  line2: string;
  line3: string;
  buttonText: string;
  onButtonClick: () => void;
  id?: string;
}

export const ContactCallToAction: React.FC<ContactCallToActionProps> = ({
  line1,
  line2,
  line3,
  buttonText,
  onButtonClick,
  id,
}) => {
  return (
    <section
      id={id}
      className="relative bg-black text-white min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center items-center py-16 sm:py-20 px-4"
    >
      <div aria-hidden="true" className="absolute top-0 left-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-neutral-800 rounded-full -translate-x-1/3 -translate-y-1/3 opacity-40" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-neutral-800 rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />

      <div className="relative z-10 w-full max-w-2xl text-left space-y-6">

        {/* ----- Row 1 ----- */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="flex items-center justify-center sm:w-1/2">
            <h1 className={`${textStyle} text-center sm:text-left`}>
              {line1}
            </h1>
          </div>
          <div className={`w-full sm:w-1/2 ${rowHeight} bg-neutral-800/30 rounded-lg overflow-hidden relative`}>
            <Image
              src="/p1.png"
              alt="Placeholder 1"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ----- Row 2 ----- */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch sm:space-x-4 space-y-3 sm:space-y-0">
          <div className={`w-full sm:w-1/2 ${rowHeight} bg-neutral-800/30 rounded-lg overflow-hidden relative`}>
            <Image
              src="/p2.png"
              alt="Placeholder 2"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center sm:w-1/2">
            <h1 className={`${textStyle} text-center sm:text-right`}>
              {line2}
            </h1>
          </div>
        </div>

        {/* ----- Row 3 ----- */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="flex items-center justify-center sm:w-1/2">
            <h1 className={`${textStyle} text-center sm:text-left`}>
              {line3}
            </h1>
          </div>
          <div className={`w-full sm:w-1/2 ${rowHeight} bg-neutral-800/30 rounded-lg overflow-hidden relative`}>
            <Image
              src="/p3.png"
              alt="Placeholder 3"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* ----- Call to Action Button ----- */}
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
    </section>
  );
};
