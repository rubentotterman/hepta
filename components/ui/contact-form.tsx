"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

// CSS som fjerner den blå fokus-markeringen og legger til globale stiler
const globalStyles = `
  body {
    background-color: #000000;
    color: white;
  }
  
  input:focus, textarea:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  
  .slide-enter {
    transform: translateY(-30px);
    opacity: 0;
  }
  
  .slide-enter-active {
    transform: translateY(0);
    opacity: 1;
    transition: all 500ms ease;
  }
  
  .slide-exit {
    transform: translateY(0);
    opacity: 1;
    position: absolute;
    width: 100%;
    left: 0;
  }
  
  .slide-exit-active {
    transform: translateY(30px);
    opacity: 0;
    transition: all 500ms ease;
  }
`;

interface FormData {
  // Backend krevde felt
  name: string;
  email: string;
  message: string;
  
  // UI-felter
  firstName: string;
  lastName: string;
  company: string;
  website: string;
  phone: string;
}

interface Step {
  id: string;
  formField: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  isRequired: boolean;
  multiline?: boolean;
  description?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "Vi bruker referanser, sosiale medier og direktemarkedsføring for å nå nye kunder.",
    firstName: "",
    lastName: "",
    company: "",
    website: "",
    phone: ""
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const steps: Step[] = [
    { 
      id: "company", 
      formField: "company", 
      label: "Hva heter selskapet ditt?", 
      placeholder: "Type your answer here...", 
      isRequired: false 
    },
    { 
      id: "website", 
      formField: "website", 
      label: "Hva er nettsidelinken deres?", 
      placeholder: "Type your answer here...", 
      type: "url", 
      isRequired: false,
      description: "Legg til 'http://' foran hvis det er en ekstern nettside"
    },
    { 
      id: "name", 
      formField: "name", 
      label: "Hva heter du?", 
      placeholder: "Type your answer here...", 
      isRequired: true,
      description: "Vi trenger både fornavn og etternavn"
    },
    { 
      id: "contact", 
      formField: "email", 
      label: "Hvordan kommer vi i kontakt med deg?", 
      placeholder: "Type your answer here...", 
      type: "email", 
      isRequired: true,
      description: "E-post er nødvendig, telefon er valgfritt"
    },
    { 
      id: "message", 
      formField: "message", 
      label: "How do you acquire new customers?", 
      placeholder: "Type your answer here...", 
      multiline: true, 
      isRequired: true,
      description: "Do you have a reliable sales channel at present? If so, tell us here."
    }
  ];

  // Oppdater name-feltet når firstName eller lastName endres
  useEffect(() => {
    if (formData.firstName || formData.lastName) {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      setFormData(prev => ({ ...prev, name: fullName }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Oppdater det spesifikke feltet
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && activeStep < steps.length - 1) {
      e.preventDefault();
      const currentStep = steps[activeStep];
      
      // For navnesteget, sjekk både fornavn og etternavn
      if (currentStep.id === "name") {
        if (formData.firstName && formData.lastName) {
          navigateToNextStep();
        }
      }
      // For kontaktsteget, sjekk e-post
      else if (currentStep.id === "contact") {
        if (formData.email) {
          navigateToNextStep();
        }
      }
      // For andre steg
      else if (!currentStep.isRequired || formData[currentStep.formField]) {
        navigateToNextStep();
      }
    }
  };
  
  const navigateToNextStep = () => {
    if (activeStep < steps.length - 1) {
      const currentStep = steps[activeStep];
      
      // For navnesteget, valider at både fornavn og etternavn er fylt ut
      if (currentStep.id === "name") {
        if (!formData.firstName || !formData.lastName) {
          setError("Både fornavn og etternavn er påkrevd");
          return;
        }
      }
      
      // For kontaktsteget, valider at e-post er fylt ut
      if (currentStep.id === "contact" && !formData.email) {
        setError("E-postadresse er påkrevd");
        return;
      }
      
      // Fjern eventuelle feilmeldinger
      setError("");
      
      // Start animasjonen - nå animerer fra topp til bunn
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
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setDebugInfo("");

    // Valider at påkrevde felt er fylt ut
    if (!formData.name || !formData.email || !formData.message) {
      // Her håndterer vi spesifikke meldinger for ulike manglende felt
      const missingFields = [];
      if (!formData.name) missingFields.push("navn");
      if (!formData.email) missingFields.push("e-post");
      if (!formData.message) missingFields.push("melding");
      
      setError(`Følgende påkrevde felt mangler: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Preparere data til backend - kun send de feltene serveren forventer
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      message: formData.message
    };

    // Hvis vi har ekstra informasjon, legg det til i meldingsfeltet
    let extraInfo = [];
    if (formData.company) extraInfo.push(`Selskap: ${formData.company}`);
    if (formData.website) extraInfo.push(`Nettside: ${formData.website}`);
    if (formData.phone) extraInfo.push(`Telefon: ${formData.phone}`);
    
    if (extraInfo.length > 0) {
      dataToSend.message = `${dataToSend.message}\n\n--- Ekstra informasjon ---\n${extraInfo.join('\n')}`;
    }

    // Logging for debugging
    console.log("Sending form data:", dataToSend);
    setDebugInfo(`Forsøker å sende: ${JSON.stringify(dataToSend)}`);

    try {
      // Send data til serveren
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      // Hent responstekst
      const responseText = await response.text();
      setDebugInfo(prev => `${prev}\nServer respons: ${responseText}`);
      
      // Prøv å tolke som JSON
      let result;
      try {
        if (responseText.trim().startsWith('{')) {
          result = JSON.parse(responseText);
        } else {
          throw new Error(`Serveren returnerte ikke-JSON respons: ${responseText.substring(0, 100)}...`);
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error(`Kunne ikke tolke responsen: ${responseText.substring(0, 100)}...`);
      }
      
      // Sjekk om det var vellykket
      if (response.ok && (result.success || result.testMode)) {
        setIsSuccess(true);
      } else {
        throw new Error(result?.error || `Serverfeil: ${response.status}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error instanceof Error ? error.message : 'Det oppstod en feil ved sending av skjema');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fokuser automatisk på input-feltet når trinnet endres
  useEffect(() => {
    const inputElement = document.getElementById(steps[activeStep]?.id);
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 100);
    }
  }, [activeStep]);

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      {/* Global styles */}
      <style jsx global>{globalStyles}</style>
      
      {/* Hjem-knapp - alltid synlig */}
      <div className="absolute top-6 left-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Gå til forsiden</span>
          </Link>
        </Button>
      </div>
      
      {isSuccess ? (
        <div className="text-center mt-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-3xl font-semibold mb-3">Takk!</h3>
          <p className="text-gray-400 mb-8 text-lg">
            Vi har mottatt henvendelsen din og tar kontakt på {formData.email} snart.
          </p>
          <Button asChild className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 h-10 rounded-sm">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Gå til forsiden
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10 mt-12">
          <div className="relative h-auto min-h-[26rem]"> {/* Justert høyde for å passe de kombinerte feltene */}
            {/* Vis eventuell feilmelding */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-center mb-6">
                {error}
              </div>
            )}
            
            {/* Debug informasjon - fjern denne i produksjon */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-500 text-xs mb-6 max-h-32 overflow-auto">
                <pre>{debugInfo}</pre>
              </div>
            )}
            
            {/* Tittel og nummerindikator for alle trinn */}
            <div className={`mb-8 transition-all duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <span className="inline-block px-2 py-1 bg-gray-800 rounded">
                  {activeStep + 1}
                </span>
                <span className="text-sm">→</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {steps[activeStep].label}{steps[activeStep].isRequired ? '*' : ''}
              </h2>
              {steps[activeStep].description && (
                <p className="text-gray-400 mt-2">
                  {steps[activeStep].description}
                </p>
              )}
            </div>
          
            {/* Viser det aktive trinnet */}
            {steps.map((step, index) => {
              // Bare vis det aktive trinnet
              if (index !== activeStep) return null;
              
              // For siste trinnet trenger vi ikke å vise label igjen, siden den er i tittelen
              const showLabel = index !== steps.length - 1;
              
              return (
                <div 
                  key={step.id} 
                  className={`space-y-4 transition-all duration-500 ${animating ? 'opacity-0 transform -translate-y-8' : 'opacity-100 transform translate-y-0'}`}
                >
                  {showLabel && (
                    <div>
                      <label 
                        htmlFor={step.id} 
                        className="block text-lg font-medium"
                      >
                        {step.label} {step.isRequired && '*'}
                      </label>
                      {step.description && (
                        <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                      )}
                    </div>
                  )}
                  
                {step.id === "name" ? (
                    // Spesiell håndtering for navnefelt (både fornavn og etternavn)
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName || ""}
                          onChange={handleChange}
                          placeholder="Type your answer here..."
                          required={true}
                          autoFocus
                          className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-12 text-lg pb-2 placeholder-gray-500"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                          <div 
                            className="h-full bg-white transition-all duration-300"
                            style={{ 
                              width: formData.firstName ? 
                                `${Math.min(100, (formData.firstName || "").length * 5)}%` : '0%' 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName || ""}
                          onChange={handleChange}
                          placeholder="Type your answer here..."
                          required={true}
                          className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-12 text-lg pb-2 placeholder-gray-500"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                          <div 
                            className="h-full bg-white transition-all duration-300"
                            style={{ 
                              width: formData.lastName ? 
                                `${Math.min(100, (formData.lastName || "").length * 5)}%` : '0%' 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : step.id === "contact" ? (
                    // Spesiell håndtering for kontaktfelt (både e-post og telefon)
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          placeholder="Type your answer here..."
                          required={true}
                          autoFocus
                          className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-12 text-lg pb-2 placeholder-gray-500"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                          <div 
                            className="h-full bg-white transition-all duration-300"
                            style={{ 
                              width: formData.email ? 
                                `${Math.min(100, (formData.email || "").length * 5)}%` : '0%' 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={handleChange}
                          placeholder="Type your answer here..."
                          className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-12 text-lg pb-2 placeholder-gray-500"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                          <div 
                            className="h-full bg-white transition-all duration-300"
                            style={{ 
                              width: formData.phone ? 
                                `${Math.min(100, (formData.phone || "").length * 5)}%` : '0%' 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : step.multiline ? (
                    <div className="relative">
                      <textarea
                        id={step.id}
                        name={step.formField}
                        value={formData[step.formField] || ""}
                        onChange={handleChange}
                        placeholder={step.placeholder}
                        rows={1}
                        required={step.isRequired}
                        autoFocus
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white text-lg pb-2 placeholder-gray-500 resize-none"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                        <div 
                          className="h-full bg-white transition-all duration-300"
                          style={{ 
                            width: formData[step.formField] ? 
                              `${Math.min(100, (formData[step.formField] || "").length / 2)}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id={step.id}
                        name={step.formField}
                        type={step.type || "text"}
                        value={formData[step.formField] || ""}
                        onChange={handleChange}
                        placeholder={step.placeholder}
                        required={step.isRequired}
                        autoFocus
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-12 text-lg pb-2 placeholder-gray-500"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                        <div 
                          className="h-full bg-white transition-all duration-300"
                          style={{ 
                            width: formData[step.formField] ? 
                              `${Math.min(100, (formData[step.formField] || "").length * 5)}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Navigasjonsknapper */}
                  <div className="pt-8 flex justify-between items-center">
                    {activeStep === steps.length - 1 ? (
                      <Button 
                        type="submit" 
                        className="px-6 py-1 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-sm"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg 
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                            >
                              <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                              />
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            OK
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex justify-between w-full">
                        {activeStep > 0 && (
                          <Button 
                            type="button" 
                            variant="ghost"
                            onClick={navigateToPreviousStep}
                            className="text-gray-400 hover:text-white"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tilbake
                          </Button>
                        )}
                        
                        <Button 
                          type="button" 
                          onClick={navigateToNextStep}
                          disabled={
                            (step.id === "name" && (!formData.firstName || !formData.lastName)) ||
                            (step.id === "contact" && !formData.email) ||
                            (step.id !== "name" && step.id !== "contact" && step.isRequired && !formData[step.formField])
                          }
                          className="ml-auto bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 h-10 rounded-sm"
                        >
                          Neste
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* "Press Enter" hint for alle steg */}
          <p className="text-gray-500 text-sm mt-2 flex items-center">
            <span>Shift ⇧ + Enter ↵ to make a line break</span>
            {activeStep === steps.length - 1 && <span className="ml-auto">press Enter ↵</span>}
          </p>
          
          {/* Progressindikator */}
          <div className="flex justify-center space-x-3">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${
                  i === activeStep ? 'bg-white' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </form>
      )}
    </div>
  );
}

export default ContactForm;