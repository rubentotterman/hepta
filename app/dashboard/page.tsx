"use client"

import { TikTokAnalytics } from "@/components/tiktok-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome to your personalized analytics dashboard</p>
      </div>

      <Tabs defaultValue="tiktok" className="w-full">
        <TabsList className="mb-4 bg-gray-900/70 p-1">
          <TabsTrigger value="tiktok" className="data-[state=active]:bg-orange-500">
            TikTok
          </TabsTrigger>
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-500">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-orange-500">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tiktok">
          {/* TikTok Analytics Section */}
          <TikTokAnalytics />
        </TabsContent>

        <TabsContent value="overview">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Summary of all your marketing platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Overview content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>Manage all your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign management content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Generate and view custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Custom reports content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

