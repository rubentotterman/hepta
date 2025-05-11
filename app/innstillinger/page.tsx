"use client"

import { useState, useEffect } from "react"
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

  // Profilstate
  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  })

  // Password states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // UI states
  const [profileLoading, setProfileLoading] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  // Hent brukerdata når komponenten lastes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        console.log("Henter profil for bruker med ID:", user.id)
        
        // Important: Use user_id for the lookup, not id
        const { data, error } = await supabase
          .from('profiles')
          .select('name, company, notifications, stripe_customer_id, role')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error("Feil ved henting av profil:", error)
          
          // Check if the profile exists at all
          const { count, error: countError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
          
          if (countError) {
            console.error("Feil ved sjekk av profil:", countError)
            return
          }
          
          // Create profile if it doesn't exist
          if (count === 0) {
            console.log("Profil eksisterer ikke, oppretter ny")
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                user_id: user.id,
                name: "",
                company: "",
                notifications: {
                  email: true,
                  marketing: false,
                  updates: true
                },
                updated_at: new Date()
              })
            
            if (insertError) {
              console.error("Feil ved opprettelse av profil:", insertError)
              return
            }
          }
          
          return
        }

        if (data) {
          console.log("Mottok profildata:", data)
          
          // Set profile data
          setProfileData({
            name: data.name || "",
            company: data.company || "",
          })

          // Set notifications if they exist in the data
          if (data.notifications) {
            console.log("Setter notifications:", data.notifications)
            setNotifications(data.notifications)
          }
        }
      } catch (error) {
        console.error('Feil ved henting av brukerdata:', error)
      }
    }

    fetchUserProfile()
  }, [user, supabase])

  // Håndter endring av profilinformasjon
  const handleProfileChange = (e) => {
    const { id, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Lagre profildata
  const saveProfileData = async () => {
    if (!user) return

    setProfileLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Check if profile exists
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      
      if (countError) {
        throw countError
      }
      
      let saveError
      
      if (count === 0) {
        // Create a new profile if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: profileData.name,
            company: profileData.company,
            notifications: notifications,
            updated_at: new Date()
          })
        
        saveError = error
      } else {
        // Update existing profile - use user_id for lookup
        const { error } = await supabase
          .from('profiles')
          .update({
            name: profileData.name,
            company: profileData.company,
            updated_at: new Date(),
          })
          .eq('user_id', user.id)
        
        saveError = error
      }

      if (saveError) {
        console.error("Feil ved lagring:", saveError)
        throw saveError
      }

      setMessage("Profilinformasjon lagret!")
    } catch (error) {
      console.error('Feil ved lagring av profildata:', error)
      setError("Kunne ikke lagre profilinformasjon.")
    } finally {
      setProfileLoading(false)
    }
  }

  // Lagre varslingsinnstillinger
  const saveNotificationSettings = async () => {
    if (!user) return

    setNotificationsLoading(true)
    setError(null)
    setMessage(null)

    try {
      console.log("Lagrer varslingsinnstillinger:", notifications)
      
      // Check if profile exists
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      
      if (countError) {
        throw countError
      }
      
      let saveError
      
      if (count === 0) {
        // Create a new profile if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            notifications: notifications,
            updated_at: new Date()
          })
        
        saveError = error
      } else {
        // Update existing profile - use user_id for lookup
        const { error } = await supabase
          .from('profiles')
          .update({
            notifications,
            updated_at: new Date(),
          })
          .eq('user_id', user.id)
        
        saveError = error
      }

      if (saveError) throw saveError

      setMessage("Varslingsinnstillinger lagret!")
    } catch (error) {
      console.error('Feil ved lagring av varslingsinnstillinger:', error)
      setError("Kunne ikke lagre varslingsinnstillinger.")
    } finally {
      setNotificationsLoading(false)
    }
  }

  // Eksisterende handleChangePassword-funksjon
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input id="email" defaultValue={user?.email || ""} readOnly className="bg-gray-950/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Navn</Label>
                <Input 
                  id="name" 
                  placeholder="Ditt navn" 
                  className="bg-gray-950/50" 
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Selskap</Label>
                <Input 
                  id="company" 
                  placeholder="Ditt selskap" 
                  className="bg-gray-950/50" 
                  value={profileData.company}
                  onChange={handleProfileChange}
                />
              </div>
              <Button 
                className="mt-4 bg-orange-500 hover:bg-orange-600"
                onClick={saveProfileData}
                disabled={profileLoading}
              >
                {profileLoading ? "Lagrer..." : "Lagre endringer"}
              </Button>
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-500 text-sm">{message}</p>}
              
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
              <Button 
                className="mt-4 bg-orange-500 hover:bg-orange-600"
                onClick={saveNotificationSettings}
                disabled={notificationsLoading}
              >
                {notificationsLoading ? "Lagrer..." : "Lagre innstillinger"}
              </Button>
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
              <Button 
                onClick={handleChangePassword} 
                disabled={loading} 
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                {loading ? "Oppdaterer..." : "Oppdater passord"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}