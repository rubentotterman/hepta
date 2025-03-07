"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function DynamicForm() {
  const [isMounted, setIsMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [userEmail, setUserEmail] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [emailValid, setEmailValid] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Handle email input
  const handleEmailChange = (e) => {
    const email = e.target.value
    setUserEmail(email)
    setEmailValid(validateEmail(email))
  }

  // Continue to message step
  const handleContinue = (e) => {
    e.preventDefault()
    if (emailValid) {
      setCurrentStep(1)
    }
  }

  // Go back to email step
  const handleBack = () => {
    setCurrentStep(0)
  }

  // Submit the full form
  const handleSubmit = (e) => {
    e.preventDefault()
    if (userMessage.trim() !== "") {
      console.log("Form submitted:", { email: userEmail, message: userMessage })
      setFormSubmitted(true)
    }
  }

  // Reset form
  const handleReset = () => {
    setUserEmail("")
    setUserMessage("")
    setCurrentStep(0)
    setFormSubmitted(false)
  }

  if (!isMounted) {
    return <div className="animate-pulse space-y-4">
      <div className="h-12 bg-gray-800 rounded"></div>
      <div className="h-12 bg-gray-800 rounded"></div>
    </div>
  }

  return (
    <div className="mt-8">
      {!formSubmitted ? (
        <>
          {currentStep === 0 ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={handleEmailChange}
                className="h-12 border-gray-800 bg-gray-950/50 px-4 text-base transition-colors hover:border-gray-700 focus:border-orange-500"
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={!emailValid}
                className={`mt-6 w-full text-lg sm:w-auto ${!emailValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Fortsett
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-2 text-left">
                <p className="text-sm text-gray-400">Sender til: {userEmail}</p>
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="text-sm text-orange-500 hover:text-orange-400"
                >
                  Endre e-post
                </button>
              </div>
              <Textarea
                placeholder="Melding"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="min-h-[150px] border-gray-800 bg-gray-950/50 px-4 py-3 text-base transition-colors hover:border-gray-700 focus:border-orange-500"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="mt-6 w-full text-lg sm:w-auto"
                disabled={userMessage.trim() === ""}
              >
                Start nå
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          )}
        </>
      ) : (
        <div className="mt-8 p-6 border border-gray-800 rounded-lg bg-gray-950/30">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Takk for din henvendelse!</h3>
          <p className="text-gray-400 mb-4">Vi tar kontakt med deg på {userEmail} innen kort tid.</p>
          <Button 
            onClick={handleReset}
            variant="outline" 
            className="border-gray-800 hover:bg-gray-800 hover:text-white"
          >
            Send ny melding
          </Button>
        </div>
      )}
    </div>
  )
}