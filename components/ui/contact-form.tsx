// components/ContactForm.tsx
"use client";

import { useState, useEffect, useRef } from "react"; // La til useRef for input-fokus
import { Button } from "@/components/ui/button";
import { Send, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

const globalStyles = `
  html, body, #__next { /* Sørg for at disse tar full høyde for min-h-screen på wrapper */
    height: 100%;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: #000000; /* Eller hentes fra Tailwind tema */
    color: white;
  }
  input:focus, textarea:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: white !important; /* Tydeligere fokus for input */
  }
  /* ... dine animasjonsstiler ... */
  .slide-enter { transform: translateY(-30px); opacity: 0; }
  .slide-enter-active { transform: translateY(0); opacity: 1; transition: all 500ms ease; }
  .slide-exit { transform: translateY(0); opacity: 1; position: absolute; width: 100%; left: 0; }
  .slide-exit-active { transform: translateY(30px); opacity: 0; transition: all 500ms ease; }
  .input-label { font-size: 0.75rem; font-weight: 600; margin-bottom: 0.25rem; color: #a0a0a0; } /* Litt lysere label */
`;

interface FormData { /* ... (som før) ... */ 
  name: string; email: string; message: string; firstName: string; lastName: string; company: string; website: string; phone: string;
}
interface Step { /* ... (som før) ... */ 
  id: string; formField: keyof FormData; label: string; placeholder: string; type?: string; isRequired: boolean; multiline?: boolean; description?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", message: "Vi bruker referanser, sosiale medier og direktemarkedsføring for å nå nye kunder.",
    firstName: "", lastName: "", company: "", website: "", phone: ""
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(""); // Feilmelding spesifikk for det aktive steget
  const [animating, setAnimating] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);


  const steps: Step[] = [
    { id: "company", formField: "company", label: "Hva heter selskapet ditt?", placeholder: "Selskapsnavn...", isRequired: false },
    { id: "website", formField: "website", label: "Hva er nettsidelinken deres?", placeholder: "https://eksempel.no", type: "url", isRequired: false, description: "Inkluder http:// eller https://" },
    { id: "name", formField: "name", label: "Hva heter du?", placeholder: "Fullt navn", isRequired: true, description: "Både fornavn og etternavn" },
    { id: "contact", formField: "email", label: "Hvordan kommer vi i kontakt med deg?", placeholder: "din@epost.no", type: "email", isRequired: true, description: "E-post er påkrevd, telefon er valgfritt" },
    { id: "message", formField: "message", label: "Hvordan skaffer dere nye kunder?", placeholder: "Beskriv deres metoder...", multiline: true, isRequired: true, description: "Har dere en pålitelig salgskanal i dag? Fortell oss her." }
  ];

  useEffect(() => {
    if (formData.firstName || formData.lastName) {
      setFormData(prev => ({ ...prev, name: `${prev.firstName} ${prev.lastName}`.trim() }));
    } else {
      setFormData(prev => ({...prev, name: ""}));
    }
  }, [formData.firstName, formData.lastName]);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Nullstill generell feil når brukeren skriver
  };
  
  const validateCurrentStep = (): boolean => {
    const currentStepData = steps[activeStep];
    let stepError = "";

    if (currentStepData.id === "name") {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        stepError = "Både fornavn og etternavn må fylles ut.";
      }
    } else if (currentStepData.id === "contact") {
      if (!formData.email.trim()) {
        stepError = "E-postadresse er påkrevd.";
      } else if (!isValidEmail(formData.email)) {
        stepError = "Vennligst skriv inn en gyldig e-postadresse.";
      }
    } else if (currentStepData.isRequired && !formData[currentStepData.formField].trim()) {
      stepError = `"${currentStepData.label}" er et påkrevd felt.`;
    }
    
    setError(stepError);
    return !stepError;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeStep < steps.length - 1) {
        if (validateCurrentStep()) {
          navigateToNextStep();
        }
      } else {
        if (validateCurrentStep()) { // Valider siste steg før submit med Enter
            handleSubmit(e as any);
        }
      }
    }
  };
  
  const navigateToNextStep = () => {
    if (activeStep < steps.length - 1) {
      if (!validateCurrentStep()) return;
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(prev => prev + 1);
        setAnimating(false);
      }, 500);
    }
  };
  
  const navigateToPreviousStep = () => {
    if (activeStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(prev => prev - 1);
        setAnimating(false);
        setError(""); 
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) { // Valider aktivt (siste) steg
        setIsSubmitting(false);
        return;
    }
    // Global sjekk av påkrevde kjernefelter for backend
    if (!formData.name || !formData.email || !formData.message) {
        let missingMsg = "Følgende påkrevde felt mangler for innsending: ";
        const missing = [];
        if(!formData.name) missing.push("navn (fra fornavn/etternavn)");
        if(!formData.email) missing.push("e-post");
        if(!formData.message) missing.push("hvordan dere skaffer kunder");
        setError(missingMsg + missing.join(", ") + ".");
        setIsSubmitting(false);
        return;
    }
    // ... (resten av din handleSubmit logikk forblir den samme) ...
    setIsSubmitting(true);
    // ... fetch ...
    // Simulerer suksess for testing
    setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
    }, 1000);
  };

  useEffect(() => {
    if (!animating && inputRefs.current[activeStep]) {
      inputRefs.current[activeStep]?.focus();
    }
  }, [activeStep, animating]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-6 bg-black">
      <style jsx global>{globalStyles}</style>
      
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Gå til forsiden">
            <Home className="h-5 w-5 text-white hover:text-gray-300" />
          </Link>
        </Button>
      </div>
      
      <div className="w-full max-w-md sm:max-w-lg mx-auto"> {/* Skjema-container */}
        {isSuccess ? (
          <div className="text-center py-10 sm:py-20">
            {/* ... (din suksessmelding) ... */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <h3 className="text-3xl font-semibold mb-3">Takk!</h3>
            <p className="text-gray-400 mb-8 text-lg">Vi har mottatt henvendelsen din og tar kontakt på {formData.email} snart.</p>
            <Button asChild className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 h-10 rounded-sm">
              <Link href="/"><Home className="mr-2 h-4 w-4" />Gå til forsiden</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 mt-8 sm:mt-10">
            {/* Container for det animerte innholdet */}
            <div className="relative h-auto min-h-[26rem] sm:min-h-[28rem] overflow-hidden"> {/* overflow-hidden for å klippe animasjon */}
              
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`
                    w-full transition-all duration-500 ease-in-out
                    ${activeStep === index ? 'opacity-100 translate-y-0 static' : 'opacity-0 absolute top-0 left-0 pointer-events-none'}
                    ${animating && activeStep === index ? (index > activeStep -1 ? 'translate-y-5' : '-translate-y-5') : ''} 
                    ${animating && activeStep !== index ? (index < activeStep ? '-translate-y-8' : 'translate-y-8') : ''} 
                  `}
                  // Vurder å bruke et bibliotek som Framer Motion for mer robuste animasjoner
                >
                  <div className={`mb-4 sm:mb-6`}>
                    <div className="flex items-center gap-2 text-gray-400 mb-2 sm:mb-3">
                      <span className="inline-block px-2 py-1 bg-gray-800 rounded text-xs sm:text-sm">{index + 1}</span>
                      <span className="text-xs sm:text-sm">→</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold">{step.label}{step.isRequired && !step.multiline ? '*' : ''}</h2>
                    {step.description && <p className="text-gray-500 mt-1 text-xs sm:text-sm">{step.description}</p>}
                  </div>
                
                  {/* Input-felt logikk */}
                  {step.id === "name" ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative"><div className="input-label">Fornavn{step.isRequired ? '*' : ''}</div><input ref={el => inputRefs.current[index] = el} id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="Ditt fornavn..." required className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.firstName ? `${Math.min(100, formData.firstName.length * 6)}%` : '0%' }} /></div></div>
                      <div className="relative"><div className="input-label">Etternavn{step.isRequired ? '*' : ''}</div><input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Ditt etternavn..." required className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.lastName ? `${Math.min(100, formData.lastName.length * 6)}%` : '0%' }} /></div></div>
                    </div>
                  ) : step.id === "contact" ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative"><div className="input-label">E-post{step.isRequired ? '*' : ''}</div><input ref={el => inputRefs.current[index] = el} id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="din@epost.no" required className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.email ? `${Math.min(100, formData.email.length * 5)}%` : '0%' }} /></div></div>
                      <div className="relative"><div className="input-label">Telefon (valgfritt)</div><input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Ditt telefonnummer..." className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.phone ? `${Math.min(100, formData.phone.length * 5)}%` : '0%' }} /></div></div>
                    </div>
                  ) : step.multiline ? (
                    <div className="relative"><textarea ref={el => inputRefs.current[index] = el} id={step.id} name={step.formField} value={formData[step.formField]} onChange={handleChange} placeholder={step.placeholder} rows={3} required={step.isRequired} onKeyDown={handleKeyDown} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white text-base sm:text-lg pb-1 placeholder-gray-500 min-h-[80px] sm:min-h-[100px] resize-y" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData[step.formField] ? `${Math.min(100, formData[step.formField].length / 1.5)}%` : '0%' }} /></div></div>
                  ) : (
                    <div className="relative"><input ref={el => inputRefs.current[index] = el} id={step.id} name={step.formField} type={step.type || "text"} value={formData[step.formField]} onChange={handleChange} placeholder={step.placeholder} required={step.isRequired} onKeyDown={handleKeyDown} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData[step.formField] ? `${Math.min(100, formData[step.formField].length * 5)}%` : '0%' }} /></div></div>
                  )}

                  {/* Feilmelding spesifikk for steget */}
                  {error && index === activeStep && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2 text-left">{error}</p>
                  )}
                  
                  {/* Navigasjonsknapper for aktivt steg */}
                  {index === activeStep && (
                    <div className="pt-4 sm:pt-6 flex justify-between items-center">
                      {activeStep === steps.length - 1 ? (
                        <Button type="submit" className="px-5 py-1.5 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm" disabled={isSubmitting}> {/* Endret farge og størrelse */}
                          {isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Sender...</>) : "Send skjema"}
                        </Button>
                      ) : (
                        <div className="flex justify-between w-full items-center">
                          {activeStep > 0 ? (
                            <Button type="button" variant="ghost" onClick={navigateToPreviousStep} className="text-gray-400 hover:text-white px-3 py-1 h-10 rounded-sm text-sm">
                              <ArrowLeft className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Tilbake
                            </Button>
                          ) : <div /> }
                          
                          <Button type="button" onClick={navigateToNextStep} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 h-10 rounded-sm text-sm">
                            Neste
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div> {/* Slutt på animasjonscontainer */}
            
            {/* Global feilmelding (hvis en feil ikke er knyttet til et spesifikt aktivt steg, f.eks. ved submit) */}
            {/* Denne er nå fjernet, da vi viser feil per steg */}

            {/* Debug informasjon */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <div className="p-2 sm:p-3 bg-blue-900/50 border border-blue-700 rounded-md text-blue-400 text-xs mt-3 sm:mt-4 max-h-24 sm:max-h-32 overflow-auto">
                <pre className="whitespace-pre-wrap break-all text-[10px] sm:text-xs">{debugInfo}</pre>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 sm:mt-6">
                <p className="text-gray-500 text-xs sm:text-sm">
                    Shift ⇧ + Enter ↵ for linjeskift
                </p>
                <div className="flex justify-center space-x-1.5 sm:space-x-2">
                    {steps.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                        i === activeStep ? 'bg-white scale-110' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => { /* TODO: Vurder navigasjon ved klikk på prikker, med validering */ }}
                    />
                    ))}
                </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactForm;