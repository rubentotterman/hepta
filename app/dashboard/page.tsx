"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { TikTokAnalytics } from "@/components/tiktok-analytics"
import { InvoiceList } from "@/components/invoice-list"
import { StripeIntegration } from "@/components/stripe-integration"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CreditCard, FileText, LineChart, TrendingUp, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tiktok")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Analysesenter</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 md:flex"
          >
            <FileText className="mr-2 h-4 w-4" />
            Eksporter Data
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-gray-200 bg-white text-gray-700">
              <DropdownMenuLabel>Min Konto</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900">
                <User className="mr-2 h-4 w-4" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900">
                <Settings className="mr-2 h-4 w-4" /> Innstillinger
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900">
                <CreditCard className="mr-2 h-4 w-4" /> Fakturering
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="hover:bg-gray-100 hover:text-gray-900">
                <LogOut className="mr-2 h-4 w-4" /> Logg ut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-white">
          <div className="absolute inset-0 bg-blue-50/30 z-0"></div>
          <div className="absolute inset-0 z-0">
            <Image src="/herobg.jpg" alt="" fill priority quality={90} className="object-cover opacity-10" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50 z-0"></div>

          <div className="relative z-10 container mx-auto px-6 py-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Kontrollpanel</h1>
              <p className="mt-4 text-xl text-gray-600">Velkommen til ditt personlige analysekontrollpanel</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Totale Visninger"
              value="124.5K"
              change="+12.3%"
              trend="up"
              icon={<LineChart className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              title="Engasjement"
              value="24.8%"
              change="+3.2%"
              trend="up"
              icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              title="Konverteringer"
              value="1,024"
              change="-2.1%"
              trend="down"
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            />
            <StatCard
              title="Inntekt"
              value="12 450 kr"
              change="+8.4%"
              trend="up"
              icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("tiktok")}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 ${
                  activeTab === "tiktok" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                TikTok
              </button>
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 ${
                  activeTab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Oversikt
              </button>
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 ${
                  activeTab === "campaigns" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Kampanjer
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-gray-900 ${
                  activeTab === "billing" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                }`}
              >
                Fakturering
              </button>
            </div>

            <div className="mt-6">
              {activeTab === "tiktok" && <TikTokAnalytics />}

              {activeTab === "overview" && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Plattformoversikt</CardTitle>
                    <CardDescription>Sammendrag av alle markedsføringsplattformene dine</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Oversiktsinnhold vil vises her.</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "campaigns" && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Kampanjestyring</CardTitle>
                    <CardDescription>Administrer alle markedsføringskampanjene dine</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Kampanjestyring vil vises her.</p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "billing" && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="border-b border-gray-200 pb-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold">Fakturering</CardTitle>
                        <CardDescription>Administrer fakturaer og betalingshistorikk</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        >
                          Betalingsmetoder
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Ny betaling
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <StripeIntegration />
                    <InvoiceList />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, change, trend, icon }) {
  return (
    <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
          </div>
          <div className="rounded-full bg-blue-50 p-2">{icon}</div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>{change}</span>
          <span className="ml-1 text-xs text-gray-500">vs forrige periode</span>
        </div>
      </CardContent>
    </Card>
  )
}
