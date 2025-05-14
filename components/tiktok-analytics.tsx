"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
import { fetchCSV, parseCSV } from "@/lib/csv-utils"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { ArrowDown, ArrowUp, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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
}

export function TikTokAnalytics() {
  const [data, setData] = useState<TikTokData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartMetric, setChartMetric] = useState("impressions")

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const csvText = await fetchCSV("/overview_2.csv")
        const parsed = parseCSV(csvText)

        const formatted = parsed.map((row) => ({
          date: row["Date"],
          impressions: Number(row["Video Views"]) || 0,
          clicks: Number(row["Profile Views"]) || 0,
          likes: Number(row["Likes"]) || 0,
          shares: Number(row["Shares"]) || 0,
          comments: Number(row["Comments"]) || 0,
          conversions: 0,
          conversion_rate: 0,
          spend: 0,
          cpa: 0,
          cpc: 0,
          cpm: 0,
        }))

        setData(formatted)
      } catch (err) {
        console.error("CSV load error:", err)
        setError("Failed to load TikTok data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const chartData = useMemo(() => {
    // Get the last 14 days of data for better visualization
    const recentData = [...data].slice(-14)

    const datasets = []

    if (chartMetric === "impressions" || chartMetric === "all") {
      datasets.push({
        label: "Visninger",
        data: recentData.map((d) => d.impressions),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
        fill: false,
      })
    }

    if (chartMetric === "likes" || chartMetric === "all") {
      datasets.push({
        label: "Liker",
        data: recentData.map((d) => d.likes),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
        fill: false,
      })
    }

    if (chartMetric === "shares" || chartMetric === "all") {
      datasets.push({
        label: "Delinger",
        data: recentData.map((d) => d.shares),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.4,
        fill: false,
      })
    }

    if (chartMetric === "comments" || chartMetric === "all") {
      datasets.push({
        label: "Kommentarer",
        data: recentData.map((d) => d.comments),
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.5)",
        tension: 0.4,
        fill: false,
      })
    }

    return {
      labels: recentData.map((d) => d.date),
      datasets,
    }
  }, [data, chartMetric])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(0, 0, 0, 0.7)",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "rgba(0, 0, 0, 0.7)",
        },
      },
    },
  }

  // Calculate totals and trends
  const totals = useMemo(() => {
    if (data.length === 0) return null

    const totalImpressions = data.reduce((sum, item) => sum + item.impressions, 0)
    const totalLikes = data.reduce((sum, item) => sum + item.likes, 0)
    const totalShares = data.reduce((sum, item) => sum + item.shares, 0)
    const totalComments = data.reduce((sum, item) => sum + item.comments, 0)

    // Calculate trends (comparing last 7 days to previous 7 days)
    const last7Days = data.slice(-7)
    const previous7Days = data.slice(-14, -7)

    const last7DaysImpressions = last7Days.reduce((sum, item) => sum + item.impressions, 0)
    const previous7DaysImpressions = previous7Days.reduce((sum, item) => sum + item.impressions, 0)

    const impressionsTrend =
      previous7DaysImpressions === 0
        ? 100
        : ((last7DaysImpressions - previous7DaysImpressions) / previous7DaysImpressions) * 100

    const last7DaysLikes = last7Days.reduce((sum, item) => sum + item.likes, 0)
    const previous7DaysLikes = previous7Days.reduce((sum, item) => sum + item.likes, 0)

    const likesTrend =
      previous7DaysLikes === 0 ? 100 : ((last7DaysLikes - previous7DaysLikes) / previous7DaysLikes) * 100

    return {
      impressions: {
        total: totalImpressions,
        trend: impressionsTrend,
      },
      likes: {
        total: totalLikes,
        trend: likesTrend,
      },
      shares: {
        total: totalShares,
      },
      comments: {
        total: totalComments,
      },
    }
  }, [data])

  if (isLoading) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>TikTok Analyse</CardTitle>
          <CardDescription>Laster TikTok-data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle>TikTok Analyse</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-red-600">Kunne ikke laste TikTok-analysedata. Vennligst prøv igjen senere.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Visninger</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">{totals?.impressions.total.toLocaleString()}</h3>
              </div>
              <div className="rounded-full bg-blue-50 p-2 text-blue-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            {totals?.impressions.trend !== undefined && (
              <div className="mt-4 flex items-center">
                {totals.impressions.trend >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span
                  className={`text-xs font-medium ${totals.impressions.trend >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {Math.abs(totals.impressions.trend).toFixed(1)}%
                </span>
                <span className="ml-1 text-xs text-gray-500">vs forrige uke</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Liker</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">{totals?.likes.total.toLocaleString()}</h3>
              </div>
              <div className="rounded-full bg-blue-50 p-2 text-blue-500">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            {totals?.likes.trend !== undefined && (
              <div className="mt-4 flex items-center">
                {totals.likes.trend >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs font-medium ${totals.likes.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(totals.likes.trend).toFixed(1)}%
                </span>
                <span className="ml-1 text-xs text-gray-500">vs forrige uke</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delinger</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">{totals?.shares.total.toLocaleString()}</h3>
              </div>
              <div className="rounded-full bg-blue-50 p-2 text-blue-500">
                <Share2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Kommentarer</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900">{totals?.comments.total.toLocaleString()}</h3>
              </div>
              <div className="rounded-full bg-blue-50 p-2 text-blue-500">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs */}
      <div className="mb-4">
        <div className="inline-flex h-9 items-center justify-start space-x-1.5 rounded-md bg-gray-100 p-1">
          <button
            onClick={() => setChartMetric("all")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              chartMetric === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setChartMetric("impressions")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              chartMetric === "impressions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Visninger
          </button>
          <button
            onClick={() => setChartMetric("likes")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              chartMetric === "likes" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Liker
          </button>
          <button
            onClick={() => setChartMetric("shares")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              chartMetric === "shares" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Delinger
          </button>
          <button
            onClick={() => setChartMetric("comments")}
            className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-all hover:text-gray-900 ${
              chartMetric === "comments" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
            }`}
          >
            Kommentarer
          </button>
        </div>
      </div>

      {/* Chart */}
      <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>TikTok Ytelse</CardTitle>
            <CardDescription>Analysedata fra din TikTok-konto</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
