"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { fetchCSV, parseCSV } from "@/lib/csv-utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TikTokData {
  date: string;
  impressions: number;
  clicks: number;
  likes: number;
  shares: number;
  comments: number;
  conversions: number;
  conversion_rate: number;
  spend: number;
  cpa: number;
  cpc: number;
  cpm: number;
}

export function TikTokAnalytics() {
  const [data, setData] = useState<TikTokData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const csvText = await fetchCSV("/overview_2.csv");
        const parsed = parseCSV(csvText);

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
        }));

        setData(formatted);
      } catch (err) {
        console.error("CSV load error:", err);
        setError("Failed to load TikTok data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const chartData = useMemo(() => ({
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Impressions",
        data: data.map((d) => d.impressions),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Likes",
        data: data.map((d) => d.likes),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
        fill: false,
      },
    ],
  }), [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  if (isLoading) {
    return <div>Loading TikTok data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle>TikTok Analytics from CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
