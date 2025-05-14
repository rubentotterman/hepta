// components/tiktok-analytics.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, Video, UserCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button"; // Importer Button

interface TikTokApiUserData {
  open_id: string;
  union_id?: string;
  avatar_url: string;
  display_name: string;
  bio_description?: string;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  likes_count?: number;
  video_count?: number;
}

interface TikTokApiResponse {
  userData?: TikTokApiUserData;
  isAuthenticated: boolean; // Nytt felt for å sjekke autentisering
  error?: string;
  details?: any;
  // videoData?: any; // Hvis du legger til dette
}

export function TikTokAnalytics() {
  const [apiData, setApiData] = useState<TikTokApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Vi bruker ikke 'error' state her lenger, da apiData.error vil inneholde det

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tiktok/analytics');
        const result: TikTokApiResponse = await response.json(); // Anta alltid JSON, selv for feil
        setApiData(result);
      } catch (err: any) {
        console.error("Fetch error in TikTokAnalytics:", err);
        setApiData({ isAuthenticated: false, error: "Nettverksfeil eller serveren svarte ikke." });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogin = () => {
    // Omdiriger til vår login-rute som starter TikTok OAuth
    window.location.href = '/api/tiktok/login';
  };

  if (isLoading) {
    return (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader><CardTitle>TikTok Analyse</CardTitle></CardHeader>
          <CardContent><div className="h-[300px] flex items-center justify-center">Laster...</div></CardContent>
        </Card>
    );
  }

  // Sjekk om brukeren ikke er autentisert eller om det var en autentiseringsfeil
  if (!apiData || !apiData.isAuthenticated) {
    return (
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Koble til TikTok</CardTitle>
            <CardDescription>
              {apiData?.error || "Du må logge inn med TikTok for å se analyser."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-10">
            <p>Vennligst koble til din TikTok-konto for å fortsette.</p>
            <Button onClick={handleLogin} size="lg" className="bg-[#FE2C55] hover:bg-[#E11D48] text-white">
              Logg inn med TikTok
            </Button>
            {apiData?.details && (
                <p className="text-xs text-red-500 mt-2">Detaljer: {JSON.stringify(apiData.details)}</p>
            )}
          </CardContent>
        </Card>
    );
  }

  // Hvis vi kommer hit, er brukeren autentisert og vi har sannsynligvis userData
  if (!apiData.userData) {
    return (
        <Card className="border-red-300 bg-red-50 shadow-sm">
          <CardHeader><CardTitle className="text-red-700">Dataproblem</CardTitle></CardHeader>
          <CardContent><p className="text-red-600">Kunne ikke hente brukerdata selv om du er autentisert. {apiData.error}</p></CardContent>
        </Card>
    );
  }

  const { userData } = apiData;

  return (
      <div className="space-y-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar_url} alt={userData.display_name} />
                <AvatarFallback>{userData.display_name?.substring(0, 1).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userData.display_name}</CardTitle>
                <CardDescription>
                  @{userData.open_id}
                  {userData.is_verified && (
                      <span className="ml-2 inline-flex items-center text-blue-600">
                    <UserCheck className="mr-1 h-4 w-4" /> Verifisert
                  </span>
                  )}
                </CardDescription>
                {userData.bio_description && (
                    <p className="mt-1 max-w-md text-sm text-gray-600">{userData.bio_description}</p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatDisplayCard title="Følgere" value={userData.follower_count} icon={<Users className="h-5 w-5 text-blue-500" />} />
          <StatDisplayCard title="Totalt Liker" value={userData.likes_count} icon={<Heart className="h-5 w-5 text-pink-500" />} />
          <StatDisplayCard title="Antall Videoer" value={userData.video_count} icon={<Video className="h-5 w-5 text-green-500" />} />
          <StatDisplayCard title="Følger" value={userData.following_count} icon={<Activity className="h-5 w-5 text-purple-500" />} />
        </div>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Ytelsesgraf</CardTitle>
            <CardDescription>Daglig statistikk for grafer er ikke tilgjengelig via dette API-oppsettet ennå.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center text-gray-500">
              <p>Graf-funksjonalitet vil bli lagt til når daglige data hentes fra video-listen eller innsikts-API-er.</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

function StatDisplayCard({ title, value, icon }: { title: string; value: number | undefined; icon: React.ReactNode }) {
  return (
      <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                {value !== undefined ? value.toLocaleString() : "N/A"}
              </h3>
            </div>
            {icon && <div className="rounded-full bg-gray-100 p-3">{icon}</div>}
          </div>
        </CardContent>
      </Card>
  );
}