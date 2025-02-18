"use client"

import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderColor: "#f97316",
        borderWidth: 2,
      },
      point: {
        radius: 0,
      },
    },
  }

  const barChartOptions = {
    ...lineChartOptions,
    elements: {
      bar: {
        backgroundColor: "#fff",
      },
    },
  }

  const lineChartData = {
    labels: Array.from({ length: 20 }, (_, i) => i + 1),
    datasets: [
      {
        data: Array.from({ length: 20 }, () => Math.random() * 100),
        fill: false,
      },
    ],
  }

  const barChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: [80, 90, 70, 85, 75],
      },
    ],
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard oversikt</h1>
        <p className="mt-2 text-gray-400">Lorem Ipsum Lorem Ipsum</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-800 p-6">
          <h3>Månedlig omsetning</h3>
          <div className="mt-2">
            <div className="text-4xl font-bold">$50k</div>
            <div className="mt-1 text-sm text-green-500">Last 30 days +10%</div>
          </div>
          <div className="mt-4 h-[200px]">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 p-6">
          <h3>Lorem Ipsum</h3>
          <div className="mt-2">
            <div className="text-4xl font-bold">85%</div>
            <div className="mt-1 text-sm text-green-500">Last 7 days +5%</div>
          </div>
          <div className="mt-4 h-[200px]">
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-800 p-6">
          <h3>Product A</h3>
          <div className="mt-6 space-y-4">
            {["Product A", "Product B", "Product C"].map((product) => (
              <div key={product} className="flex items-center gap-4">
                <div className="text-sm">{product}</div>
                <div className="h-2 flex-1 rounded-full bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gray-600"
                    style={{
                      width: `${Math.random() * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 p-6">
          <h3>Trafikk</h3>
          <div className="mt-2">
            <div className="text-4xl font-bold">Organic</div>
            <div className="mt-1 text-sm text-green-500">Lorem +8%</div>
          </div>
          <div className="mt-4 h-[200px]">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-gray-400">Totale brukere</h3>
          <div className="mt-2 text-2xl font-bold">25,000</div>
          <div className="mt-1 text-sm text-green-500">+12%</div>
        </div>
        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-gray-400">Aktive brukere</h3>
          <div className="mt-2 text-2xl font-bold">18,000</div>
          <div className="mt-1 text-sm text-green-500">+8%</div>
        </div>
        <div className="rounded-lg bg-gray-900 p-6">
          <h3 className="text-gray-400">Conversion Rate</h3>
          <div className="mt-2 text-2xl font-bold">7.5%</div>
          <div className="mt-1 text-sm text-green-500">+1.2%</div>
        </div>
      </div>
    </div>
  )
}

