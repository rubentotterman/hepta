"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const rowHeight = "h-[120px] sm:h-[160px] md:h-[200px] lg:h-[280px] xl:h-[350px]";
const responsiveFontSize = "text-[clamp(1rem,_0.5rem_+_3vw,_3rem)]";
const textStyle = `font-bold break-words text-center sm:text-left tracking-tighter leading-tight text-white text-[clamp(1rem,_1vw_+_1rem,_2rem)]`;


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
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-neutral-800 rounded-full -translate-x-1/3 -translate-y-1/3 opacity-40"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] border border-neutral-800 rounded-full translate-x-1/3 translate-y-1/3 opacity-40"
      />

      <div className="relative z-10 w-full max-w-4xl text-left space-y-6">
        {/* ROW 1 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
          <div className="flex items-center justify-center sm:w-1/2">
            <h1 className={`${textStyle} text-center sm:text-left`}>
              {line1}
            </h1>
          </div>
          <div
            className={`flex items-center justify-center sm:w-1/2 ${rowHeight} bg-neutral-800/30 rounded-lg overflow-hidden`}
          >
            <Image
              src="/4.jpg"
              alt="Placeholder 1"
              width={300}
              height={300}
              className="object-cover h-full w-full"
              priority
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
          <div
            className={`flex items-center justify-center sm:w-1/2 ${rowHeight} bg-neutral-800/30 rounded-lg overflow-hidden`}
          >
            <Image
              src="/5.jpg"
              alt="Placeholder 2"
              width={300}
              height={300}
              className="object-cover h-full w-full"
              priority
            />
          </div>
          <div className="flex items-center justify-center sm:w-1/2">
            <h1 className={`${textStyle} text-center sm:text-right`}>
              {line2}
            </h1>
          </div>
        </div>

       {/* ROW 3 */}
<div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
  {/* Text */}
  <div className={`sm:w-1/2 ${rowHeight} flex items-center justify-center`}>
    <h1 className={`${textStyle} text-center sm:text-left`}>
      {line3}
    </h1>
  </div>

  {/* Image */}
  <div className={`sm:w-1/2 ${rowHeight} bg-neutral-800/30 rounded-lg overflow-hidden flex items-center justify-center`}>
    <Image
      src="/6.jpg"
      alt="Placeholder 3"
      width={300}
      height={300}
      className="object-cover h-full w-full"
      priority
    />
  </div>
</div>


        <div className="flex justify-center mt-8">
          <Button
            className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200"
            onClick={onButtonClick}
          >
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
