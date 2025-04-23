"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function Innstillinger() {
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  })

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleChangePassword = async () => {
    setError(null)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setError("Passordene er ikke like.")
      return
    }

    if (newPassword.length < 6) {
      setError("Passordet må være minst 6 tegn.")
      return
    }

    if (!currentPassword) {
      setError("Du må skrive inn ditt nåværende passord.")
      return
    }

    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: currentPassword,
    })

    if (signInError) {
      setError("Feil nåværende passord.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setLoading(false)

    if (error) {
      console.error("Feil ved oppdatering av passord:", error.message)
      setError("Kunne ikke oppdatere passordet.")
    } else {
      setMessage("Passordet er oppdatert!")
      setNewPassword("")
      setConfirmPassword("")
      setCurrentPassword("")
    }
  }

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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}

              <div className="space-y-2">
                <Label htmlFor="current-password">Nåværende passord</Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-gray-950/50"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nytt passord</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-gray-950/50"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Bekreft nytt passord</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="bg-gray-950/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleChangePassword} disabled={loading} className="mt-4 bg-orange-500 hover:bg-orange-600">
                {loading ? "Oppdaterer..." : "Oppdater passord"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
