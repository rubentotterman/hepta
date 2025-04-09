"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchCSV, parseCSV } from "@/lib/csv-utils"
import { Line } from "react-chartjs-2"
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

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface TikTokData {
  Date: string
  "Video Views": string
  "Profile Views": string
  Likes: string
  Comments: string
  Shares: string
}

export function TikTokAnalyticsCompact() {
  const [data, setData] = useState<TikTokData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const csvText = await fetchCSV(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overview%202-iHLqMqDyGH8fFVVjgYL1UVnJIDAKyo.csv",
        )
        const parsedData = parseCSV(csvText) as TikTokData[]
        setData(parsedData)
      } catch (err) {
        console.error("Failed to load TikTok data:", err)
        setError(err instanceof Error ? err.message : "Failed to load TikTok data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.Date),
    datasets: [
      {
        label: "Video Views",
        data: data.map((item) => Number.parseInt(item["Video Views"] || "0")),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        tension: 0.4,
      },
      {
        label: "Likes",
        data: data.map((item) => Number.parseInt(item.Likes || "0")),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
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
          boxWidth: 10,
          padding: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 5,
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 7,
        },
      },
    },
  }

  // Calculate totals
  const totalViews = data.reduce((sum, item) => sum + Number.parseInt(item["Video Views"] || "0"), 0)
  const totalLikes = data.reduce((sum, item) => sum + Number.parseInt(item.Likes || "0"), 0)
  const totalComments = data.reduce((sum, item) => sum + Number.parseInt(item.Comments || "0"), 0)
  const totalShares = data.reduce((sum, item) => sum + Number.parseInt(item.Shares || "0"), 0)

  if (isLoading) {
    return (
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
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
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader>
        <CardTitle>TikTok Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Views</div>
            <div className="text-xl font-bold">{totalViews.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Likes</div>
            <div className="text-xl font-bold">{totalLikes.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Comments</div>
            <div className="text-xl font-bold">{totalComments.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Shares</div>
            <div className="text-xl font-bold">{totalShares.toLocaleString()}</div>
          </div>
        </div>
        <div className="h-[200px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </CardContent>
    </Card>
  )
}

