// app/api/tiktok/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const storedState = cookieStore.get('tiktok_auth_state')?.value;
    const storedCodeVerifier = cookieStore.get('tiktok_code_verifier')?.value; // Hent code_verifier

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const stateFromTikTok = searchParams.get('state');
    const errorFromTikTok = searchParams.get('error');
    const errorDescriptionFromTikTok = searchParams.get('error_description');

    // --- DEBUG START ---
    console.log("--- DEBUG: /api/tiktok/callback ---");
    console.log("Request URL:", request.url);
    console.log("Code from TikTok:", code);
    console.log("State from TikTok:", stateFromTikTok);
    console.log("Stored state from cookie:", storedState);
    console.log("Stored code_verifier from cookie:", storedCodeVerifier); // Logg code_verifier
    console.log("Error from TikTok:", errorFromTikTok);
    console.log("Error description from TikTok:", errorDescriptionFromTikTok);
    // --- DEBUG END ---

    // Fjern cookies da de er brukt eller forsøkt brukt
    cookieStore.delete('tiktok_auth_state');
    cookieStore.delete('tiktok_code_verifier');

    if (errorFromTikTok) {
        console.error(`Error received from TikTok in callback: ${errorFromTikTok} - ${errorDescriptionFromTikTok}`);
        return NextResponse.redirect(new URL(`/dashboard?error=${errorFromTikTok}&description=${errorDescriptionFromTikTok}`, request.nextUrl.origin));
    }

    if (!stateFromTikTok || stateFromTikTok !== storedState) {
        console.error('Invalid state parameter or state mismatch. TikTok state:', stateFromTikTok, 'Cookie state:', storedState);
        return NextResponse.redirect(new URL('/dashboard?error=state_validation_failed', request.nextUrl.origin));
    }

    if (!code) {
        console.error('Authorization code not found in callback and no error reported by TikTok.');
        return NextResponse.redirect(new URL(`/dashboard?error=auth_code_missing`, request.nextUrl.origin));
    }

    if (!storedCodeVerifier) { // Sjekk om code_verifier ble hentet
        console.error('Code verifier not found in cookie.');
        return NextResponse.redirect(new URL('/dashboard?error=code_verifier_missing', request.nextUrl.origin));
    }

    const clientKey = process.env.TIKTOK_CLIENT_ID;
    // Client Secret er kanskje ikke nødvendig for token exchange hvis PKCE brukes og appen er "public client" type.
    // Men TikToks dokumentasjon bør sjekkes. Ofte kreves det fortsatt for konfidensielle klienter (web server apps).
    // La oss anta at den fortsatt trengs for TikToks Display API /v2/oauth/token/ endepunkt.
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUriForTokenExchange = process.env.TIKTOK_REDIRECT_URI;

    // --- DEBUG START ---
    console.log("Client Key for token exchange:", clientKey ? "SET" : "NOT SET");
    console.log("Client Secret for token exchange:", clientSecret ? "SET" : "NOT SET");
    console.log("Redirect URI for token exchange:", redirectUriForTokenExchange);
    // --- DEBUG END ---

    if (!clientKey || !clientSecret || !redirectUriForTokenExchange) {
        console.error('TikTok Client ID, Secret, or Redirect URI not configured for token exchange');
        return NextResponse.redirect(new URL('/dashboard?error=server_config_error_token_exchange', request.nextUrl.origin));
    }

    try {
        const tokenPayload = new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret, // TikTok Display API ser ut til å fortsatt kreve dette for web server
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUriForTokenExchange,
            code_verifier: storedCodeVerifier, // LEGG TIL code_verifier
        });

        // --- DEBUG START ---
        console.log("Payload for token exchange (body):", tokenPayload.toString());
        // --- DEBUG END ---

        const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenPayload,
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('TikTok token exchange failed:', errorData);
            // --- DEBUG START ---
            console.log("TikTok token exchange response status:", tokenResponse.status);
            console.log("TikTok token exchange error response body:", JSON.stringify(errorData, null, 2));
            // --- DEBUG END ---
            return NextResponse.redirect(new URL(`/dashboard?error=token_exchange_failed&details=${encodeURIComponent(errorData.error_description || errorData.error || JSON.stringify(errorData))}`, request.nextUrl.origin));
        }

        const tokenData = await tokenResponse.json();
        const { access_token, refresh_token, expires_in, open_id, scope } = tokenData;

        // --- DEBUG START ---
        console.log("Token data received:", JSON.stringify(tokenData, null, 2));
        // --- DEBUG END ---

        const accessTokenMaxAge = expires_in || 3600;
        const refreshTokenMaxAge = tokenData.refresh_expires_in || (60 * 60 * 24 * 30);

        const response = NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));

        response.cookies.set('tiktok_access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: accessTokenMaxAge,
        });

        if (refresh_token) {
            response.cookies.set('tiktok_refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: refreshTokenMaxAge,
            });
        }
        response.cookies.set('tiktok_open_id', open_id, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: refreshTokenMaxAge,
        });

        return response;

    } catch (error) {
        console.error('Error during TikTok token exchange or cookie setting:', error);
        return NextResponse.redirect(new URL('/dashboard?error=internal_server_error_token_exchange', request.nextUrl.origin));
    }
}