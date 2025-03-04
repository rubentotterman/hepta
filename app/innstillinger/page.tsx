"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Innstillinger() {
  const { user, sessionToken } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  })

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Innstillinger</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Varsler</TabsTrigger>
          <TabsTrigger value="security">Sikkerhet</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Administrer din profilinformasjon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input id="email" defaultValue={user?.email || ""} readOnly className="bg-gray-950/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Navn</Label>
                <Input id="name" placeholder="Ditt navn" className="bg-gray-950/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Selskap</Label>
                <Input id="company" placeholder="Ditt selskap" className="bg-gray-950/50" />
              </div>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Lagre endringer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Varsler</CardTitle>
              <CardDescription>Administrer dine varslingsinnstillinger</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">E-postvarsler</p>
                  <p className="text-sm text-gray-400">Motta varsler via e-post</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Markedsføring</p>
                  <p className="text-sm text-gray-400">Motta markedsføringsinnhold</p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Oppdateringer</p>
                  <p className="text-sm text-gray-400">Motta oppdateringer om nye funksjoner</p>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                />
              </div>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Lagre innstillinger</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Sikkerhet</CardTitle>
              <CardDescription>Administrer dine sikkerhetsinnstillinger</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Nåværende passord</Label>
                <Input id="current-password" type="password" className="bg-gray-950/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nytt passord</Label>
                <Input id="new-password" type="password" className="bg-gray-950/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Bekreft nytt passord</Label>
                <Input id="confirm-password" type="password" className="bg-gray-950/50" />
              </div>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Oppdater passord</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

