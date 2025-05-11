// components/BigTextGrid.tsx
import React from 'react';

// --- Placeholder Height (Increased) ---
const placeholderHeight = "h-14 sm:h-16 md:h-[72px] lg:h-[88px] xl:h-[96px]"; // e.g., lg:h-[70px] to lg:h-[88px]

// Temporary styling for visualizing placeholders
const placeholderVisualizeStyle = "border border-dashed border-neutral-700 bg-neutral-800/30 flex items-center justify-center text-xs text-neutral-500 p-1";

// --- Main Text Styling (Increased MAX_SIZE in clamp) ---
// Example: max from 2.875rem (46px) to 3.5rem (56px) - TWEAK CAREFULLY
const responsiveFontSize = "text-[clamp(1.25rem,_0.75rem_+_3vw,_3.5rem)]"; // Adjusted vw and MAX
const mainTextStyle = `font-bold ${responsiveFontSize} tracking-tighter leading-none uppercase text-white whitespace-nowrap`;

// --- Styling for the LAST line ("INNOVATION DRIVES...") (Increased MAX_SIZE) ---
// Max from 2.45rem to 3.125rem (proportionally increased)
const lastLineResponsiveFontSize = "text-[clamp(1.25rem,_0.75rem_+_3vw,_3.5rem)]"; 
const lastLineTextStyle = `font-bold ${lastLineResponsiveFontSize} tracking-tighter leading-none uppercase text-white whitespace-nowrap`;

// Blue text styling (Increased)
const blueResponsiveFontSize = "text-[clamp(1rem,_0.5rem_+_2vw,_2.25rem)]"; 
const blueTextStyle = `font-bold ${blueResponsiveFontSize} text-blue-500 leading-tight tracking-tight`;

const BigTextGrid: React.FC = () => {
  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col justify-center items-center py-16 sm:py-24 px-2">
      <div aria-hidden="true" className="absolute top-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border border-neutral-800 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] border border-neutral-800 rounded-full translate-x-1/2 translate-y-1/2" />

      {/* Main Content Box - SIGNIFICANTLY WIDER */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-0"> 
      {/* Example: lg:max-w-[calc(theme(maxWidth.xl)+40px)] to lg:max-w-3xl (approx 768px to 1024px)
                   xl:max-w-[calc(theme(maxWidth.2xl)+40px)] to xl:max-w-5xl (approx 896px+40 to 1280px)
          You might need to use specific pixel/rem values if Tailwind scale isn't granular enough:
          lg:max-w-[800px] xl:max-w-[1000px]
      */}
        
        <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4"> {/* Increased md:space-y */}

          {/* ----- ROW 1: "WE CRAFT DIGITAL" + Placeholder ----- */}
          <div className="flex items-center justify-between space-x-3 sm:space-x-4"> {/* Increased space-x */}
            <h1 className={`${mainTextStyle} flex-shrink min-w-0`}>
              WE CRAFT DIGITAL
            </h1>
            <div className={`flex-grow flex-shrink-0 basis-[35%] sm:basis-[40%] md:basis-[45%] ${placeholderHeight} ${placeholderVisualizeStyle} rounded-lg`}>P1</div>
          </div>

          {/* ----- ROW 2: Placeholder + "EXPERIENCES THAT" ----- */}
          <div className="flex items-center justify-between space-x-3 sm:space-x-4">
            <div className={`flex-grow flex-shrink-0 basis-[40%] sm:basis-[45%] md:basis-[50%] ${placeholderHeight} ${placeholderVisualizeStyle} rounded-lg`}>P2</div>
            <h1 className={`${mainTextStyle} text-right flex-shrink min-w-0`}>
              EXPERIENCES THAT
            </h1>
          </div>
          
          {/* ----- ROW 3: "TRULY RESONATE DEEPLY." + Placeholder ----- */}
          <div className="flex items-center justify-between space-x-3 sm:space-x-4">
            <h1 className={`${mainTextStyle} flex-shrink min-w-0`}>
              TRULY RESONATE DEEPLY.
            </h1>
            {/* Adjusted basis for P3 from your last successful screenshot */}
            <div className={`flex-grow flex-shrink-0 basis-[20%] sm:basis-[25%] md:basis-[30%] ${placeholderHeight} ${placeholderVisualizeStyle} rounded-lg`}>P3</div>
          </div>

          {/* ----- ROW 4: "INNOVATION DRIVES OUR EVERY MOVE." (Full width) ----- */}
          <div className="w-full pt-1 md:pt-2"> {/* Increased md:pt */}
             <h1 className={`${lastLineTextStyle} text-left`}> 
              INNOVATION DRIVES OUR EVERY MOVE.
             </h1>
          </div>
        </div>
      </div> {/* End of Main Content Box */}

      {/* ----- Blue Text - OUTSIDE the main grid box ----- */}
      <div className="mt-10 sm:mt-12 md:mt-14 text-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-5xl px-4"> {/* Matched max-width & increased mt */}
        <p className={`${blueTextStyle}`}>
          Together, we create growth.
        </p>
      </div>
    </div>
  );
};

export default BigTextGrid;