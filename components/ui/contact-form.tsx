// components/ContactForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Styles specific to this form's animations and input labels
// We are NOT styling html, body, or #__next here.
const formSpecificGlobalStyles = `
  input:focus, textarea:focus { /* This can also be in globals.css if preferred for all inputs */
    outline: none !important;
    box-shadow: none !important;
    border-color: white !important; 
  }
  .slide-enter { transform: translateY(-30px); opacity: 0; }
  .slide-enter-active { transform: translateY(0); opacity: 1; transition: all 500ms ease; }
  .slide-exit { transform: translateY(0); opacity: 1; position: absolute; width: 100%; left: 0; } /* Ensure these are scoped or specific enough if moved to globals.css */
  .slide-exit-active { transform: translateY(30px); opacity: 0; transition: all 500ms ease; }
  .input-label { 
    font-size: 0.75rem; 
    font-weight: 600; 
    margin-bottom: 0.25rem; 
    color: #a0a0a0; 
  }
`;

interface FormData {
  name: string; email: string; message: string; firstName: string; lastName: string; company: string; website: string; phone: string;
}
interface Step {
  id: string; formField: keyof FormData | (keyof FormData)[]; label: string; placeholder: string | string[]; type?: string; isRequired: boolean; multiline?: boolean; description?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", message: "Vi bruker referanser, sosiale medier og direktemarkedsføring for å nå nye kunder.",
    firstName: "", lastName: "", company: "", website: "", phone: ""
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  const steps: Step[] = [
    { id: "company", formField: "company", label: "Hva heter selskapet ditt?", placeholder: "Selskapsnavn...", isRequired: false },
    { id: "website", formField: "website", label: "Hva er nettsidelinken deres?", placeholder: "https://eksempel.no", type: "url", isRequired: false, description: "Inkluder http:// eller https://" },
    { id: "name", formField: ["firstName", "lastName"], label: "Hva heter du?", placeholder: ["Ditt fornavn...", "Ditt etternavn..."], isRequired: true, description: "Både fornavn og etternavn" },
    { id: "contact", formField: ["email", "phone"], label: "Hvordan kommer vi i kontakt med deg?", placeholder: ["din@epost.no", "Ditt telefonnummer..."], type: "email", isRequired: true, description: "E-post er påkrevd, telefon er valgfritt" },
    { id: "message", formField: "message", label: "Hvordan skaffer dere nye kunder?", placeholder: "Beskriv deres metoder...", multiline: true, isRequired: true, description: "Har dere en pålitelig salgskanal i dag? Fortell oss her." }
  ];

  useEffect(() => {
    if (formData.firstName || formData.lastName) {
      setFormData(prev => ({ ...prev, name: `${prev.firstName} ${prev.lastName}`.trim() }));
    } else {
      setFormData(prev => ({ ...prev, name: "" }));
    }
  }, [formData.firstName, formData.lastName]);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return (url.startsWith("http://") || url.startsWith("https://"));
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error && name === steps[activeStep].id || (Array.isArray(steps[activeStep].formField) && (steps[activeStep].formField as string[]).includes(name))) {
      setError("");
    }
  };

  const validateCurrentStep = (): boolean => {
    const currentStepData = steps[activeStep];
    let stepError = "";
    let fieldToFocus: HTMLInputElement | HTMLTextAreaElement | null = null;

    if (currentStepData.id === "name") {
      if (!formData.firstName.trim()) {
        stepError = "Fornavn må fylles ut.";
        fieldToFocus = firstNameRef.current;
      } else if (!formData.lastName.trim()) {
        stepError = "Etternavn må fylles ut.";
        fieldToFocus = lastNameRef.current;
      }
    } else if (currentStepData.id === "contact") {
      if (!formData.email.trim()) {
        stepError = "E-postadresse er påkrevd.";
        fieldToFocus = emailRef.current;
      } else if (!isValidEmail(formData.email)) {
        stepError = "Vennligst skriv inn en gyldig e-postadresse.";
        fieldToFocus = emailRef.current;
      }
    } else if (currentStepData.id === "website" && formData.website && !isValidUrl(formData.website)) {
      stepError = "Vennligst skriv inn en gyldig nettside-URL (inkluder http:// eller https://).";
      fieldToFocus = inputRefs.current[activeStep];
    } else if (currentStepData.isRequired && !Array.isArray(currentStepData.formField) && !formData[currentStepData.formField as keyof FormData].trim()) {
      stepError = `"${currentStepData.label}" er et påkrevd felt.`;
      fieldToFocus = inputRefs.current[activeStep];
    }

    setError(stepError);
    if (stepError && fieldToFocus) {
      fieldToFocus.focus();
    }
    return !stepError;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault();
      if (activeStep < steps.length - 1) {
        if (validateCurrentStep()) {
          navigateToNextStep();
        }
      } else {
        if (validateCurrentStep()) {
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
      }, 300); // Keep your original 500ms if preferred
    }
  };

  const navigateToPreviousStep = () => {
    if (activeStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(prev => prev - 1);
        setAnimating(false);
        setError("");
      }, 300); // Keep your original 500ms if preferred
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateCurrentStep()) {
      setIsSubmitting(false);
      return;
    }

    let globalError = "";
    const missingFields = [];
    if (!formData.firstName.trim() || !formData.lastName.trim()) missingFields.push("navn (fornavn og etternavn)");
    if (!formData.email.trim() || !isValidEmail(formData.email)) missingFields.push("gyldig e-post");
    if (!formData.message.trim()) missingFields.push("hvordan dere skaffer kunder");

    if (missingFields.length > 0) {
      globalError = "Vennligst fyll ut alle påkrevde felt korrekt: " + missingFields.join(", ") + ".";
      setError(globalError);
      setIsSubmitting(false);
      return;
    }

    setError("");

    console.log("Submitting form data:", formData);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);

    } catch (err) {
      console.error("Submission error:", err);
      setError("Noe gikk galt under innsending. Prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess || animating) return;
    let fieldToFocus: HTMLElement | null = null;
    const currentStepData = steps[activeStep];
    if (currentStepData?.id === "name") {
      if (!formData.firstName.trim()) fieldToFocus = firstNameRef.current;
      else if (!formData.lastName.trim()) fieldToFocus = lastNameRef.current;
      else fieldToFocus = firstNameRef.current;
    } else if (currentStepData?.id === "contact") {
      if (!formData.email.trim() || !isValidEmail(formData.email)) fieldToFocus = emailRef.current;
      else if (!formData.phone.trim()) fieldToFocus = phoneRef.current;
      else fieldToFocus = emailRef.current;
    } else if (inputRefs.current[activeStep]) {
      fieldToFocus = inputRefs.current[activeStep];
    }
    fieldToFocus?.focus();
  }, [activeStep, animating, isSuccess]);

  return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-6 bg-black text-white">
        {/* Re-add form-specific global styles here */}
        <style jsx global>{formSpecificGlobalStyles}</style>

        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Gå til forsiden">
              <Home className="h-5 w-5 text-white hover:text-gray-300" />
            </Link>
          </Button>
        </div>

        <div className="w-full max-w-md sm:max-w-lg mx-auto">
          {isSuccess ? (
              <div className="text-center py-10 sm:py-20">
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
                <div className="relative h-auto min-h-[26rem] sm:min-h-[28rem] overflow-hidden">
                  {steps.map((step, index) => (
                      <div
                          key={step.id}
                          className={`
                    w-full transition-all duration-300 ease-in-out
                    ${activeStep === index ? 'opacity-100 translate-y-0 static' : 'opacity-0 absolute top-0 left-0 pointer-events-none'}
                    ${animating && activeStep === index ? (index > activeStep -1 ? 'translate-y-3' : '-translate-y-3') : ''} 
                    ${animating && activeStep !== index ? (index < activeStep ? '-translate-y-5' : 'translate-y-5') : ''} 
                  `}
                      >
                        {activeStep === index && (
                            <>
                              <div className="mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 text-gray-400 mb-2 sm:mb-3">
                                  <span className="inline-block px-2 py-1 bg-gray-800 rounded text-xs sm:text-sm">{index + 1}</span>
                                  <span className="text-xs sm:text-sm">→</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold">{step.label}{step.isRequired && !step.multiline && step.id !== 'name' && step.id !== 'contact' ? '*' : ''}</h2>
                                {step.description && <p className="text-gray-500 mt-1 text-xs sm:text-sm">{step.description}</p>}
                              </div>

                              {step.id === "name" ? (
                                  <div className="space-y-3 sm:space-y-4">
                                    <div className="relative"><div className="input-label">Fornavn{step.isRequired ? '*' : ''}</div><input ref={firstNameRef} id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={Array.isArray(step.placeholder) ? step.placeholder[0] : step.placeholder} required={step.isRequired} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.firstName ? `${Math.min(100, formData.firstName.length * 6)}%` : '0%' }} /></div></div>
                                    <div className="relative"><div className="input-label">Etternavn{step.isRequired ? '*' : ''}</div><input ref={lastNameRef} id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={Array.isArray(step.placeholder) ? step.placeholder[1] : undefined} required={step.isRequired} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.lastName ? `${Math.min(100, formData.lastName.length * 6)}%` : '0%' }} /></div></div>
                                  </div>
                              ) : step.id === "contact" ? (
                                  <div className="space-y-3 sm:space-y-4">
                                    <div className="relative"><div className="input-label">E-post{step.isRequired ? '*' : ''}</div><input ref={emailRef} id="email" name="email" type="email" value={formData.email} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={Array.isArray(step.placeholder) ? step.placeholder[0] : step.placeholder} required={step.isRequired} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.email ? `${Math.min(100, formData.email.length * 5)}%` : '0%' }} /></div></div>
                                    <div className="relative"><div className="input-label">Telefon (valgfritt)</div><input ref={phoneRef} id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={Array.isArray(step.placeholder) ? step.placeholder[1] : undefined} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData.phone ? `${Math.min(100, formData.phone.length * 5)}%` : '0%' }} /></div></div>
                                  </div>
                              ) : step.multiline ? (
                                  <div className="relative"><textarea ref={el => inputRefs.current[index] = el} id={step.id} name={Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData} value={formData[Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData]} onChange={handleChange} placeholder={step.placeholder as string} rows={3} required={step.isRequired} onKeyDown={handleKeyDown} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white text-base sm:text-lg pb-1 placeholder-gray-500 min-h-[80px] sm:min-h-[100px] resize-y" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData[Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData] ? `${Math.min(100, formData[Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData].length / 1.5)}%` : '0%' }} /></div></div>
                              ) : (
                                  <div className="relative"><input ref={el => inputRefs.current[index] = el} id={step.id} name={Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData} type={step.type || "text"} value={formData[Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData]} onChange={handleChange} placeholder={step.placeholder as string} required={step.isRequired} onKeyDown={handleKeyDown} className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-white h-10 sm:h-12 text-base sm:text-lg pb-1 placeholder-gray-500" /><div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700"><div className="h-full bg-white transition-all duration-300" style={{ width: formData[Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData] ? `${Math.min(100, formData[Array.isArray(step.formField) ? step.formField[0] : step.formField as keyof FormData].length * 5)}%` : '0%' }} /></div></div>
                              )}

                              {error && (
                                  <p className="text-red-400 text-xs sm:text-sm mt-2 text-left">{error}</p>
                              )}

                              <div className="pt-4 sm:pt-6 flex justify-between items-center">
                                {activeStep === steps.length - 1 ? (
                                    <Button type="submit" className="px-5 py-1.5 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm" disabled={isSubmitting}>
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
                            </>
                        )}
                      </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 sm:mt-6">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Shift ⇧ + Enter ↵ for linjeskift i tekstfelt
                  </p>
                  <div className="flex justify-center space-x-1.5 sm:space-x-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                                i === activeStep ? 'bg-white scale-110' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
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
