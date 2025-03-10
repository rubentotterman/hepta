"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Home, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

// CSS som fjerner den blå fokus-markeringen
const globalStyles = `
  input:focus, textarea:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  
  const [activeStep, setActiveStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const steps = [
    { id: "name", label: "Hva heter du?", placeholder: "Ditt navn" },
    { id: "email", label: "Hva er din e-postadresse?", placeholder: "din.epost@eksempel.no", type: "email" },
    { id: "message", label: "Hva kan vi hjelpe deg med?", placeholder: "Fortell oss om prosjektet ditt", multiline: true }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && activeStep < steps.length - 1) {
      e.preventDefault() // Prevent form submission on Enter
      if (formData[steps[activeStep].id as keyof typeof formData]) {
        setActiveStep(prev => prev + 1)
      }
    }
  }
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1)
    }
  }
  
  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Her vil du vanligvis sende data til en API-rute
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulerer API-kall for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
    } catch (error) {
      console.error("Feil ved innsending:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
      
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
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
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {steps.map((step, index) => {
                // Bare vis det aktive trinnet
                if (index !== activeStep) return null;
                
                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
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
                          value={formData[step.id as keyof typeof formData] as string}
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
                              width: formData[step.id as keyof typeof formData] ? 
                                `${Math.min(100, (formData[step.id as keyof typeof formData] as string).length / 2)}%` : '0%' 
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
                          value={formData[step.id as keyof typeof formData] as string}
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
                              width: formData[step.id as keyof typeof formData] ? 
                                `${Math.min(100, (formData[step.id as keyof typeof formData] as string).length * 5)}%` : '0%' 
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
                          disabled={!formData[step.id as keyof typeof formData]}
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
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
  )
}