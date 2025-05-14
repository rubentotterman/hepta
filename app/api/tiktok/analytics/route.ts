// app/api/tiktok/analytics/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TIKTOK_API_BASE_URL = 'https://open.tiktokapis.com/v2';

export async function GET() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('tiktok_access_token')?.value;

    if (!accessToken) {
        // Viktig: Returner en spesifikk status for "ikke autentisert"
        // slik at frontend kan håndtere det og vise Logg inn-knapp.
        return NextResponse.json({ error: 'User not authenticated or access token missing. Please log in with TikTok.', isAuthenticated: false }, { status: 401 });
    }

    try {
        // Eksempel: Hent grunnleggende brukerinformasjon
        const fields = "open_id,union_id,avatar_url,display_name,bio_description,is_verified,follower_count,following_count,likes_count,video_count";
        const userInfoResponse = await fetch(
            `${TIKTOK_API_BASE_URL}/user/info/?fields=${fields}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!userInfoResponse.ok) {
            const errorData = await userInfoResponse.json();
            console.error('TikTok API Error (User Info):', errorData);
            // Hvis token er ugyldig/utløpt (f.eks. status 401/403 fra TikTok), bør du også returnere isAuthenticated: false
            if (userInfoResponse.status === 401 || userInfoResponse.status === 403) {
                // Slett ugyldige cookies
                cookieStore.delete('tiktok_access_token');
                cookieStore.delete('tiktok_refresh_token');
                cookieStore.delete('tiktok_open_id');
                return NextResponse.json({ error: 'TikTok token invalid or expired. Please log in again.', isAuthenticated: false, details: errorData }, { status: 401 });
            }
            return NextResponse.json({ error: 'Failed to fetch user info from TikTok', isAuthenticated: true, details: errorData }, { status: userInfoResponse.status });
        }
        const userInfo = await userInfoResponse.json();

        // Her kan du legge til flere API-kall til TikTok for video-liste, insights etc.
        // Eksempel: Hent video list (krever video.list scope)
        // const videoListResponse = await fetch(
        //     `${TIKTOK_API_BASE_URL}/video/list/?fields=id,create_time,cover_image_url,view_count,like_count,comment_count,share_count`,
        //     {
        //         method: 'POST', // Noen TikTok API-er (som video/list) bruker POST
        //         headers: {
        //             'Authorization': `Bearer ${accessToken}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ max_count: 20 }) // Eller andre parametere
        //     }
        // );
        // const videoData = videoListResponse.ok ? await videoListResponse.json() : null;


        return NextResponse.json({
            userData: userInfo.data,
            // videoData: videoData?.data, // Hvis du henter videoer
            isAuthenticated: true,
        });

    } catch (error) {
        console.error('Internal server error in /api/tiktok/analytics:', error);
        return NextResponse.json({ error: 'Internal server error', isAuthenticated: true }, { status: 500 }); // isAuthenticated kan være true hvis feilen ikke er auth-relatert
    }
}