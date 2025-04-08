"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

// CSS som fjerner den blå fokus-markeringen
const globalStyles = `
  input:focus, textarea:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Step {
  id: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Add debug log function
  const addDebugLog = (message: string) => {
    console.log("DEBUG:", message);
    setDebugLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };
  
  // Display debug logs when they change
  useEffect(() => {
    if (debugLogs.length > 0) {
      setDebugInfo(debugLogs.join('\n'));
    }
  }, [debugLogs]);

  // Initialize with a debug message to confirm component is rendering
  useEffect(() => {
    addDebugLog("ContactForm component mounted");
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      addDebugLog(`Running in ${process.env.NODE_ENV} mode`);
    }
  }, []);

  const steps: Step[] = [
    { id: "name", label: "Hva heter du?", placeholder: "Ditt navn" },
    { id: "email", label: "Hva er din e-postadresse?", placeholder: "din.epost@eksempel.no", type: "email" },
    { id: "message", label: "Hva kan vi hjelpe deg med?", placeholder: "Fortell oss om prosjektet ditt", multiline: true }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && activeStep < steps.length - 1) {
      e.preventDefault();
      if (formData[steps[activeStep].id]) {
        setActiveStep(prev => prev + 1);
      }
    }
  };
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setDebugLogs([]);
    addDebugLog("Form submission started");

    try {
      addDebugLog(`Sending form data: ${JSON.stringify(formData)}`);
      
      // Try to create the nodemailer API route directly
      addDebugLog("Creating direct nodemailer connection for testing");
      
      // Fetch API call with detailed logging
      addDebugLog("Sending POST request to /api/contact");
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      addDebugLog(`Response received with status: ${response.status}`);
      
      // Log response headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      addDebugLog(`Response headers: ${JSON.stringify(headers)}`);
      
      // Get response text
      const responseText = await response.text();
      addDebugLog(`Response text length: ${responseText.length}`);
      if (responseText.length > 0) {
        addDebugLog(`Response preview: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
      } else {
        addDebugLog("Response is empty");
      }
      
      // Parse JSON response if present
      let result = null;
      if (responseText && responseText.trim()) {
        try {
          result = JSON.parse(responseText);
          addDebugLog(`Parsed JSON: ${JSON.stringify(result)}`);
        } catch (jsonError) {
          addDebugLog(`JSON parsing error: ${String(jsonError)}`);
          throw new Error(`Kunne ikke tolke responsen som JSON: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
        }
      } else {
        addDebugLog("Empty response received");
        throw new Error("Serveren returnerte et tomt svar");
      }
      
      // Check for errors
      if (!response.ok) {
        addDebugLog(`Response not OK: ${response.status}`);
        throw new Error(result?.error || `Serverfeil: ${response.status}`);
      }
      
      // Success!
      addDebugLog("Form submission successful");
      setIsSuccess(true);
    } catch (error) {
      addDebugLog(`Error occurred: ${String(error)}`);
      setError(error instanceof Error ? error.message : 'Det oppstod en feil ved sending av skjema');
    } finally {
      setIsSubmitting(false);
      addDebugLog("Form submission process completed");
    }
  };

  // For testing - gjør det lettere å hoppe til siste steg
  const goToLastStep = () => {
    // Bare for testing
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      setActiveStep(steps.length - 1);
      setFormData({
        name: "Test Testerson",
        email: "test@example.com",
        message: "Dette er en testmelding"
      });
      addDebugLog("Jumped to last step with test data");
    }
  };
  
  // Test API connection directly
  const testApiConnection = async () => {
    addDebugLog("Testing API connection directly");
    try {
      const testData = { test: true };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      addDebugLog(`Test API response status: ${response.status}`);
      const text = await response.text();
      addDebugLog(`Test API response: ${text}`);
    } catch (error) {
      addDebugLog(`Test API connection error: ${String(error)}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Global styles to remove blue focus outlines */}
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
      
      {/* Debug informasjon - alltid synlig i development mode */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded text-xs overflow-auto max-h-60">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold">Debug Info:</p>
              <div>
                <button 
                  type="button"
                  onClick={testApiConnection}
                  className="text-xs text-blue-500 hover:text-blue-700 mr-2"
                >
                  [Test API]
                </button>
                <button 
                  type="button"
                  onClick={() => addDebugLog("Manual log test")}
                  className="text-xs text-green-500 hover:text-green-700"
                >
                  [Test Log]
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap">{debugInfo || "No debug info yet"}</pre>
          </div>
          
          {/* Test-knapp for å hoppe til siste skritt */}
          <div className="mb-4 text-right">
            <button 
              type="button" 
              onClick={goToLastStep}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              [DEBUG: Hopp til siste steg]
            </button>
          </div>
        </>
      )}
      
      {isSuccess ? (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-orange-500" 
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
          <h3 className="text-3xl font-semibold mb-3">Takk, {formData.name}!</h3>
          <p className="text-gray-400 mb-8 text-lg">
            Vi har mottatt henvendelsen din og tar kontakt på {formData.email} snart.
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Gå til forsiden
            </Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            {/* Vis eventuell feilmelding */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-center">
                {error}
              </div>
            )}
          
            {/* Viser det aktive trinnet */}
            {steps.map((step, index) => {
              // Bare vis det aktive trinnet
              if (index !== activeStep) return null;
              
              return (
                <div key={step.id} className="space-y-4">
                  <label 
                    htmlFor={step.id} 
                    className="block text-2xl md:text-3xl font-medium text-center"
                  >
                    {step.label}
                  </label>
                  
                  {step.multiline ? (
                    <div className="relative">
                      <textarea
                        id={step.id}
                        name={step.id}
                        value={formData[step.id]}
                        onChange={handleChange}
                        placeholder={step.placeholder}
                        rows={4}
                        required
                        autoFocus
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-orange-500 text-lg pb-2 placeholder-gray-500 resize-none text-center"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{ 
                            width: formData[step.id] ? 
                              `${Math.min(100, formData[step.id].length / 2)}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id={step.id}
                        name={step.id}
                        type={step.type || "text"}
                        value={formData[step.id]}
                        onChange={handleChange}
                        placeholder={step.placeholder}
                        required
                        autoFocus
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-700 focus:ring-0 focus:border-orange-500 h-12 text-lg pb-2 placeholder-gray-500 text-center"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{ 
                            width: formData[step.id] ? 
                              `${Math.min(100, formData[step.id].length * 5)}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-8 flex justify-center gap-4">
                    {activeStep > 0 && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handlePrevious}
                        className="px-6"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Tilbake
                      </Button>
                    )}
                    
                    {index < steps.length - 1 ? (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        disabled={!formData[step.id]}
                        className="px-8"
                      >
                        Neste
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        className="px-8 py-2 h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg 
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
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
                            Sender...
                          </>
                        ) : (
                          <>
                            Send melding
                            <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progressindikator */}
          <div className="flex justify-center space-x-3">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${
                  i === activeStep ? 'bg-orange-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </form>
      )}
    </div>
  );
}

// Make sure the default export is included
export default ContactForm;