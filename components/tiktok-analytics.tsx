"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Filter,
  HelpCircle,
  Info,
  Loader2,
  RefreshCw,
  Search,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
)

// Mock data structure based on TikTok API
interface TikTokData {
  date: string
  impressions: number
  clicks: number
  likes: number
  shares: number
  comments: number
  conversions: number
  conversion_rate: number
  spend: number
  cpa: number
  cpc: number
  cpm: number
  video_id?: string
  video_title?: string
  audience_age?: Record<string, number>
  audience_gender?: Record<string, number>
}

interface Campaign {
  id: string
  name: string
  status: "active" | "paused" | "completed"
  budget: number
  start_date: string
  end_date?: string
}

interface ContentItem {
  id: string
  title: string
  thumbnail: string
  views: number
  engagement_rate: number
  date_posted: string
}

export function TikTokAnalytics() {
  const [data, setData] = useState<TikTokData[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "custom">("30d")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")
  const [comparisonMode, setComparisonMode] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // In a real implementation, you would fetch from the TikTok API
        // For now, we'll generate mock data
        const mockData = generateMockData(dateRange)
        setData(mockData)

        // Generate mock campaigns
        setCampaigns([
          {
            id: "camp_1",
            name: "Summer Sale Promotion",
            status: "active",
            budget: 5000,
            start_date: "2023-06-01",
          },
          {
            id: "camp_2",
            name: "Product Launch",
            status: "active",
            budget: 10000,
            start_date: "2023-07-15",
          },
          {
            id: "camp_3",
            name: "Brand Awareness",
            status: "paused",
            budget: 3000,
            start_date: "2023-05-01",
            end_date: "2023-06-30",
          },
          {
            id: "camp_4",
            name: "Holiday Special",
            status: "completed",
            budget: 8000,
            start_date: "2022-12-01",
            end_date: "2023-01-15",
          },
        ])

        // Generate mock content items
        setContentItems([
          {
            id: "vid_1",
            title: "How to use our new product",
            thumbnail: "/placeholder.svg?height=120&width=200",
            views: 45000,
            engagement_rate: 8.3,
            date_posted: "2023-07-10",
          },
          {
            id: "vid_2",
            title: "Behind the scenes tour",
            thumbnail: "/placeholder.svg?height=120&width=200",
            views: 32000,
            engagement_rate: 6.7,
            date_posted: "2023-07-05",
          },
          {
            id: "vid_3",
            title: "Customer testimonial",
            thumbnail: "/placeholder.svg?height=120&width=200",
            views: 28000,
            engagement_rate: 5.2,
            date_posted: "2023-06-28",
          },
          {
            id: "vid_4",
            title: "Product tutorial",
            thumbnail: "/placeholder.svg?height=120&width=200",
            views: 52000,
            engagement_rate: 9.1,
            date_posted: "2023-06-20",
          },
        ])
      } catch (err) {
        console.error("Failed to load TikTok data:", err)
        setError(err instanceof Error ? err.message : "Failed to load TikTok data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [dateRange])

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      // In a real implementation, you would fetch fresh data from the TikTok API
      const mockData = generateMockData(dateRange)
      setData(mockData)
      // Wait a bit to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (err) {
      console.error("Failed to refresh TikTok data:", err)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Generate mock data based on date range
  const generateMockData = (range: "7d" | "30d" | "90d" | "custom"): TikTokData[] => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
    const result: TikTokData[] = []

    const today = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Base values that will be adjusted for trends
      const baseImpressions = 1000 + Math.random() * 2000
      const baseClicks = 50 + Math.random() * 150

      // Create some trends in the data
      const dayOfWeekFactor = 1 + (date.getDay() === 0 || date.getDay() === 6 ? 0.3 : 0) // Weekend boost
      const trendFactor = 1 + (i / days) * 0.5 // Gradual improvement over time

      const impressions = Math.round(baseImpressions * dayOfWeekFactor * trendFactor)
      const clicks = Math.round(baseClicks * dayOfWeekFactor * trendFactor)
      const likes = Math.round(impressions * (0.05 + Math.random() * 0.05))
      const shares = Math.round(impressions * (0.01 + Math.random() * 0.02))
      const comments = Math.round(impressions * (0.02 + Math.random() * 0.03))
      const conversions = Math.round(clicks * (0.1 + Math.random() * 0.15))
      const spend = Math.round((50 + Math.random() * 100) * 100) / 100

      // Add audience demographics
      const audienceAge = {
        "13-17": Math.round(Math.random() * 10),
        "18-24": Math.round(10 + Math.random() * 30),
        "25-34": Math.round(20 + Math.random() * 30),
        "35-44": Math.round(10 + Math.random() * 20),
        "45+": Math.round(Math.random() * 15),
      }

      const audienceGender = {
        male: Math.round(30 + Math.random() * 20),
        female: Math.round(30 + Math.random() * 20),
        other: Math.round(Math.random() * 10),
      }

      result.push({
        date: date.toISOString().split("T")[0],
        impressions,
        clicks,
        likes,
        shares,
        comments,
        conversions,
        conversion_rate: Math.round((conversions / clicks) * 1000) / 10, // percentage with 1 decimal
        spend,
        cpa: Math.round((spend / (conversions || 1)) * 100) / 100,
        cpc: Math.round((spend / clicks) * 100) / 100,
        cpm: Math.round((spend / impressions) * 1000 * 100) / 100,
        audience_age: audienceAge,
        audience_gender: audienceGender,
      })
    }

    return result
  }

  // Filter data based on selected campaign and search query
  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Apply campaign filter if not "all"
    if (selectedCampaign !== "all") {
      // In a real implementation, you would filter by campaign ID
      // For now, we'll just return a subset of the data
      filtered = filtered.slice(0, Math.floor(filtered.length * 0.7))
    }

    // Apply search filter
    if (searchQuery) {
      // In a real implementation, you would search through relevant fields
      // For now, we'll just return a subset of the data
      filtered = filtered.slice(0, Math.floor(filtered.length * 0.5))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "impressions":
          comparison = a.impressions - b.impressions
          break
        case "clicks":
          comparison = a.clicks - b.clicks
          break
        case "conversions":
          comparison = a.conversions - b.conversions
          break
        case "spend":
          comparison = a.spend - b.spend
          break
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [data, selectedCampaign, searchQuery, sortBy, sortOrder])

  // Calculate previous period data for comparison
  const previousPeriodData = useMemo(() => {
    if (!comparisonMode) return []

    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
    const result: TikTokData[] = []

    const today = new Date()
    for (let i = days * 2 - 1; i >= days; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Generate data similar to current period but with some variation
      const baseImpressions = 800 + Math.random() * 1800
      const baseClicks = 40 + Math.random() * 130

      const dayOfWeekFactor = 1 + (date.getDay() === 0 || date.getDay() === 6 ? 0.3 : 0)
      const trendFactor = 1 + ((i - days) / days) * 0.4

      const impressions = Math.round(baseImpressions * dayOfWeekFactor * trendFactor)
      const clicks = Math.round(baseClicks * dayOfWeekFactor * trendFactor)
      const likes = Math.round(impressions * (0.04 + Math.random() * 0.05))
      const shares = Math.round(impressions * (0.01 + Math.random() * 0.015))
      const comments = Math.round(impressions * (0.015 + Math.random() * 0.025))
      const conversions = Math.round(clicks * (0.08 + Math.random() * 0.12))
      const spend = Math.round((45 + Math.random() * 90) * 100) / 100

      result.push({
        date: date.toISOString().split("T")[0],
        impressions,
        clicks,
        likes,
        shares,
        comments,
        conversions,
        conversion_rate: Math.round((conversions / clicks) * 1000) / 10,
        spend,
        cpa: Math.round((spend / (conversions || 1)) * 100) / 100,
        cpc: Math.round((spend / clicks) * 100) / 100,
        cpm: Math.round((spend / impressions) * 1000 * 100) / 100,
      })
    }

    return result
  }, [comparisonMode, dateRange])

  // Prepare chart data
  const engagementData = {
    labels: filteredData.map((item) => item.date),
    datasets: comparisonMode
      ? [
          {
            label: "Likes",
            data: filteredData.map((item) => item.likes),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Comments",
            data: filteredData.map((item) => item.comments),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Shares",
            data: filteredData.map((item) => item.shares),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.5)",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Previous Likes",
            data: previousPeriodData.map((item) => item.likes),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
          {
            label: "Previous Comments",
            data: previousPeriodData.map((item) => item.comments),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
          {
            label: "Previous Shares",
            data: previousPeriodData.map((item) => item.shares),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
        ]
      : [
          {
            label: "Likes",
            data: filteredData.map((item) => item.likes),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Comments",
            data: filteredData.map((item) => item.comments),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
            fill: false,
          },
          {
            label: "Shares",
            data: filteredData.map((item) => item.shares),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.5)",
            tension: 0.4,
            fill: false,
          },
        ],
  }

  const impressionsClicksData = {
    labels: filteredData.map((item) => item.date),
    datasets: comparisonMode
      ? [
          {
            label: "Impressions",
            data: filteredData.map((item) => item.impressions),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
            yAxisID: "y",
            fill: true,
          },
          {
            label: "Clicks",
            data: filteredData.map((item) => item.clicks),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
            yAxisID: "y1",
            fill: false,
          },
          {
            label: "Previous Impressions",
            data: previousPeriodData.map((item) => item.impressions),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
            yAxisID: "y",
            fill: false,
          },
          {
            label: "Previous Clicks",
            data: previousPeriodData.map((item) => item.clicks),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
            yAxisID: "y1",
            fill: false,
          },
        ]
      : [
          {
            label: "Impressions",
            data: filteredData.map((item) => item.impressions),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
            yAxisID: "y",
            fill: true,
          },
          {
            label: "Clicks",
            data: filteredData.map((item) => item.clicks),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
            yAxisID: "y1",
            fill: false,
          },
        ],
  }

  const costMetricsData = {
    labels: filteredData.map((item) => item.date),
    datasets: comparisonMode
      ? [
          {
            label: "CPC ($)",
            data: filteredData.map((item) => item.cpc),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
          },
          {
            label: "CPA ($)",
            data: filteredData.map((item) => item.cpa),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
          },
          {
            label: "CPM ($)",
            data: filteredData.map((item) => item.cpm),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.5)",
            tension: 0.4,
          },
          {
            label: "Previous CPC ($)",
            data: previousPeriodData.map((item) => item.cpc),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
          },
          {
            label: "Previous CPA ($)",
            data: previousPeriodData.map((item) => item.cpa),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
          },
          {
            label: "Previous CPM ($)",
            data: previousPeriodData.map((item) => item.cpm),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
          },
        ]
      : [
          {
            label: "CPC ($)",
            data: filteredData.map((item) => item.cpc),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
          },
          {
            label: "CPA ($)",
            data: filteredData.map((item) => item.cpa),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            tension: 0.4,
          },
          {
            label: "CPM ($)",
            data: filteredData.map((item) => item.cpm),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.5)",
            tension: 0.4,
          },
        ],
  }

  const conversionData = {
    labels: filteredData.map((item) => item.date),
    datasets: comparisonMode
      ? [
          {
            label: "Conversion Rate (%)",
            data: filteredData.map((item) => item.conversion_rate),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Previous Conversion Rate (%)",
            data: previousPeriodData.map((item) => item.conversion_rate),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.2)",
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
          },
        ]
      : [
          {
            label: "Conversion Rate (%)",
            data: filteredData.map((item) => item.conversion_rate),
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.4,
            fill: true,
          },
        ],
  }

  const spendData = {
    labels: filteredData.map((item) => item.date),
    datasets: comparisonMode
      ? [
          {
            label: "Daily Spend ($)",
            data: filteredData.map((item) => item.spend),
            backgroundColor: "rgba(249, 115, 22, 0.7)",
          },
          {
            label: "Previous Daily Spend ($)",
            data: previousPeriodData.map((item) => item.spend),
            backgroundColor: "rgba(249, 115, 22, 0.3)",
            borderWidth: 1,
            borderColor: "rgba(249, 115, 22, 0.7)",
          },
        ]
      : [
          {
            label: "Daily Spend ($)",
            data: filteredData.map((item) => item.spend),
            backgroundColor: "rgba(249, 115, 22, 0.7)",
          },
        ],
  }

  // Audience data for demographics charts
  const audienceAgeData = {
    labels: ["13-17", "18-24", "25-34", "35-44", "45+"],
    datasets: [
      {
        label: "Age Distribution (%)",
        data: [5, 35, 40, 15, 5], // Example percentages
        backgroundColor: [
          "rgba(249, 115, 22, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderColor: [
          "rgba(249, 115, 22, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const audienceGenderData = {
    labels: ["Female", "Male", "Other"],
    datasets: [
      {
        label: "Gender Distribution (%)",
        data: [55, 42, 3], // Example percentages
        backgroundColor: ["rgba(236, 72, 153, 0.7)", "rgba(59, 130, 246, 0.7)", "rgba(16, 185, 129, 0.7)"],
        borderColor: ["rgba(236, 72, 153, 1)", "rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: context.dataset.label.includes("$") ? "currency" : "decimal",
                currency: "USD",
                minimumFractionDigits: context.dataset.label.includes("%") ? 1 : 0,
                maximumFractionDigits: context.dataset.label.includes("%") ? 1 : 2,
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          maxTicksLimit: 10,
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 0.8,
        to: 0.4,
        loop: false,
      },
    },
  }

  const dualAxisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Impressions",
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Clicks",
          color: "rgba(255, 255, 255, 0.7)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          maxTicksLimit: 10,
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 0.8,
        to: 0.4,
        loop: false,
      },
    },
  }

  // Calculate totals and averages
  const totalImpressions = filteredData.reduce((sum, item) => sum + item.impressions, 0)
  const totalClicks = filteredData.reduce((sum, item) => sum + item.clicks, 0)
  const totalLikes = filteredData.reduce((sum, item) => sum + item.likes, 0)
  const totalShares = filteredData.reduce((sum, item) => sum + item.shares, 0)
  const totalComments = filteredData.reduce((sum, item) => sum + item.comments, 0)
  const totalConversions = filteredData.reduce((sum, item) => sum + item.conversions, 0)
  const totalSpend = filteredData.reduce((sum, item) => sum + item.spend, 0)

  const avgCTR = filteredData.length ? (totalClicks / totalImpressions) * 100 : 0
  const avgConversionRate = filteredData.length ? (totalConversions / totalClicks) * 100 : 0
  const avgCPC = totalClicks ? totalSpend / totalClicks : 0
  const avgCPA = totalConversions ? totalSpend / totalConversions : 0
  const avgCPM = totalImpressions ? (totalSpend / totalImpressions) * 1000 : 0

  // Calculate previous period metrics for comparison
  const prevTotalImpressions = previousPeriodData.reduce((sum, item) => sum + item.impressions, 0)
  const prevTotalClicks = previousPeriodData.reduce((sum, item) => sum + item.clicks, 0)
  const prevTotalConversions = previousPeriodData.reduce((sum, item) => sum + item.conversions, 0)
  const prevTotalSpend = previousPeriodData.reduce((sum, item) => sum + item.spend, 0)

  const impressionsChange = prevTotalImpressions
    ? ((totalImpressions - prevTotalImpressions) / prevTotalImpressions) * 100
    : 0
  const clicksChange = prevTotalClicks ? ((totalClicks - prevTotalClicks) / prevTotalClicks) * 100 : 0
  const conversionsChange = prevTotalConversions
    ? ((totalConversions - prevTotalConversions) / prevTotalConversions) * 100
    : 0
  const spendChange = prevTotalSpend ? ((totalSpend - prevTotalSpend) / prevTotalSpend) * 100 : 0

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Helper function to format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Helper function to format percentage
  const formatPercentage = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(num / 100)
  }

  // Helper function to render trend indicator
  const renderTrend = (value: number, inverse = false) => {
    const isPositive = inverse ? value < 0 : value > 0
    const isNeutral = value === 0

    return (
      <div
        className={`flex items-center ${isPositive ? "text-green-500" : isNeutral ? "text-gray-400" : "text-red-500"}`}
      >
        {isPositive ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : isNeutral ? (
          <span className="h-4 w-4 mr-1">-</span>
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    )
  }

  // Function to export data as CSV
  const exportData = () => {
    const headers = [
      "Date",
      "Impressions",
      "Clicks",
      "Likes",
      "Comments",
      "Shares",
      "Conversions",
      "Conversion Rate (%)",
      "Spend ($)",
      "CPA ($)",
      "CPC ($)",
      "CPM ($)",
    ]

    const csvRows = [
      headers.join(","),
      ...filteredData.map((item) =>
        [
          item.date,
          item.impressions,
          item.clicks,
          item.likes,
          item.comments,
          item.shares,
          item.conversions,
          item.conversion_rate,
          item.spend,
          item.cpa,
          item.cpc,
          item.cpm,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `tiktok_analytics_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-800 bg-red-900/20">
        <CardHeader>
          <CardTitle>Error Loading TikTok Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">{error}</p>
          <Button onClick={refreshData} variant="outline" className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">TikTok Analytics</h2>
          <p className="text-gray-400">Track and analyze your TikTok performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setComparisonMode(!comparisonMode)}>
                  <TrendingUp className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">
                    {comparisonMode ? "Hide Comparison" : "Compare Periods"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{comparisonMode ? "Hide period comparison" : "Compare with previous period"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data as CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={dateRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("7d")}
            className={dateRange === "7d" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            7 Days
          </Button>
          <Button
            variant={dateRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("30d")}
            className={dateRange === "30d" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            30 Days
          </Button>
          <Button
            variant={dateRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("90d")}
            className={dateRange === "90d" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            90 Days
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={dateRange === "custom" ? "default" : "outline"}
                size="sm"
                className={dateRange === "custom" ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Custom
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Custom Date Range</h4>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      className="col-span-2"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      className="col-span-2"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    if (customDateRange.start && customDateRange.end) {
                      setDateRange("custom")
                    }
                  }}
                  disabled={!customDateRange.start || !customDateRange.end}
                >
                  Apply Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Impressions
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total number of times your content was viewed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-400">CTR: {avgCTR.toFixed(2)}%</div>
              {comparisonMode && renderTrend(impressionsChange)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Clicks
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of clicks on your content or links</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalClicks)}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-400">Avg. CPC: {formatCurrency(avgCPC)}</div>
              {comparisonMode && renderTrend(clicksChange)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Conversions
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of users who completed a desired action</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalConversions)}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-400">Rate: {avgConversionRate.toFixed(2)}%</div>
              {comparisonMode && renderTrend(conversionsChange)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Total Spend
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total amount spent on your campaigns</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpend)}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-400">Avg. CPA: {formatCurrency(avgCPA)}</div>
              {comparisonMode && renderTrend(spendChange, true)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="mb-4 bg-gray-900/70 p-1">
          <TabsTrigger value="performance" className="data-[state=active]:bg-orange-500">
            Performance
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-orange-500">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="conversions" className="data-[state=active]:bg-orange-500">
            Conversions
          </TabsTrigger>
          <TabsTrigger value="costs" className="data-[state=active]:bg-orange-500">
            Cost Metrics
          </TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-orange-500">
            Audience
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-orange-500">
            Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle>Impressions & Clicks</CardTitle>
                  <CardDescription>Track your reach and audience interaction</CardDescription>
                </div>
                <Badge variant="outline" className="w-fit">
                  {comparisonMode ? "Showing comparison with previous period" : "Current period data"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line options={dualAxisOptions} data={impressionsClicksData} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>Tip: Hover over the chart to see detailed metrics for each day</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle>Engagement Metrics</CardTitle>
                  <CardDescription>Likes, comments, and shares</CardDescription>
                </div>
                <Badge variant="outline" className="w-fit">
                  {comparisonMode ? "Showing comparison with previous period" : "Current period data"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line options={chartOptions} data={engagementData} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-3 w-full gap-4 mt-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Total Likes</div>
                  <div className="text-xl font-bold">{formatNumber(totalLikes)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Total Comments</div>
                  <div className="text-xl font-bold">{formatNumber(totalComments)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Total Shares</div>
                  <div className="text-xl font-bold">{formatNumber(totalShares)}</div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>Percentage of clicks that convert</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {comparisonMode ? "Showing comparison" : "Current period"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line options={chartOptions} data={conversionData} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <CardTitle>Daily Spend</CardTitle>
                    <CardDescription>Campaign spending over time</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {comparisonMode ? "Showing comparison" : "Current period"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar options={chartOptions} data={spendData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle>Cost Metrics</CardTitle>
                  <CardDescription>CPC, CPA, and CPM over time</CardDescription>
                </div>
                <Badge variant="outline" className="w-fit">
                  {comparisonMode ? "Showing comparison with previous period" : "Current period data"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line options={chartOptions} data={costMetricsData} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-3 w-full gap-4 mt-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Avg. CPC</div>
                  <div className="text-xl font-bold">{formatCurrency(avgCPC)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Avg. CPA</div>
                  <div className="text-xl font-bold">{formatCurrency(avgCPA)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Avg. CPM</div>
                  <div className="text-xl font-bold">{formatCurrency(avgCPM)}</div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Breakdown of your audience by age group</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[300px]">
                  <Doughnut
                    data={audienceAgeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 6,
                            boxHeight: 6,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Breakdown of your audience by gender</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-[300px]">
                  <Doughnut
                    data={audienceGenderData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 6,
                            boxHeight: 6,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-800 bg-gray-900/50 mt-6">
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Key demographics and behavior patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    <h3 className="font-medium">Top Locations</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>United States</span>
                      <span>42%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>United Kingdom</span>
                      <span>18%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Canada</span>
                      <span>12%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Australia</span>
                      <span>8%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Germany</span>
                      <span>5%</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="h-5 w-5 text-orange-500" />
                    <h3 className="font-medium">Engagement Times</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>6:00 PM - 9:00 PM</span>
                      <span>Highest</span>
                    </li>
                    <li className="flex justify-between">
                      <span>12:00 PM - 2:00 PM</span>
                      <span>High</span>
                    </li>
                    <li className="flex justify-between">
                      <span>9:00 AM - 11:00 AM</span>
                      <span>Medium</span>
                    </li>
                    <li className="flex justify-between">
                      <span>3:00 AM - 5:00 AM</span>
                      <span>Lowest</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-5 w-5 text-orange-500" />
                    <h3 className="font-medium">Interests</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Technology</Badge>
                    <Badge variant="secondary">Fashion</Badge>
                    <Badge variant="secondary">Travel</Badge>
                    <Badge variant="secondary">Food</Badge>
                    <Badge variant="secondary">Fitness</Badge>
                    <Badge variant="secondary">Gaming</Badge>
                    <Badge variant="secondary">Music</Badge>
                    <Badge variant="secondary">Beauty</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Analysis of your top performing content</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="views">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="views">Views</SelectItem>
                      <SelectItem value="engagement">Engagement Rate</SelectItem>
                      <SelectItem value="date">Date Posted</SelectItem>
                      <SelectItem value="likes">Likes</SelectItem>
                      <SelectItem value="shares">Shares</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/30"
                  >
                    <div className="sm:w-[200px] h-[120px] relative rounded-md overflow-hidden bg-gray-800">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">Posted on {item.date_posted}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-sm text-gray-400">Views</div>
                          <div className="font-bold">{formatNumber(item.views)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Engagement</div>
                          <div className="font-bold">{item.engagement_rate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Likes</div>
                          <div className="font-bold">{formatNumber(Math.round(item.views * 0.05))}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Shares</div>
                          <div className="font-bold">{formatNumber(Math.round(item.views * 0.02))}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[200px] w-[200px]">
              <Doughnut
                data={{
                  labels: ["Likes", "Comments", "Shares"],
                  datasets: [
                    {
                      data: [totalLikes, totalComments, totalShares],
                      backgroundColor: [
                        "rgba(249, 115, 22, 0.7)",
                        "rgba(59, 130, 246, 0.7)",
                        "rgba(16, 185, 129, 0.7)",
                      ],
                      borderColor: ["rgba(249, 115, 22, 1)", "rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        boxHeight: 6,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900/50 sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-400">Click-Through Rate</div>
                <div className="text-xl font-bold">{avgCTR.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Conversion Rate</div>
                <div className="text-xl font-bold">{avgConversionRate.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Cost Per Click</div>
                <div className="text-xl font-bold">{formatCurrency(avgCPC)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Cost Per Acquisition</div>
                <div className="text-xl font-bold">{formatCurrency(avgCPA)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Cost Per Mille</div>
                <div className="text-xl font-bold">{formatCurrency(avgCPM)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Engagement</div>
                <div className="text-xl font-bold">{formatNumber(totalLikes + totalComments + totalShares)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <CardTitle>Campaign Performance</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        campaign.status === "active"
                          ? "bg-green-500"
                          : campaign.status === "paused"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                  <TableCell>{campaign.start_date}</TableCell>
                  <TableCell>{campaign.end_date || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

