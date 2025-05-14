// app/api/tiktok/login/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import pkceChallenge from 'pkce-challenge'; // Sjekk om dette er et default export eller named

export async function GET() { // Funksjonen er allerede async, så vi kan bruke await
    const clientKey = process.env.TIKTOK_CLIENT_ID;
    const redirectUri = process.env.TIKTOK_REDIRECT_URI;

    console.log("--- DEBUG: /api/tiktok/login ---");
    console.log("TIKTOK_CLIENT_ID from env:", clientKey);
    console.log("TIKTOK_REDIRECT_URI from env:", redirectUri);

    if (!clientKey || !redirectUri) {
        console.error('TikTok Client ID or Redirect URI not configured in /api/tiktok/login');
        return NextResponse.json({ error: 'Server configuration error: TikTok Client ID or Redirect URI missing' }, { status: 500 });
    }

    const state = uuidv4();

    // Prøv med await her
    const pkce = await pkceChallenge(); // <--- VIKTIG ENDRING: Legg til await

    // Hvis pkceChallenge returnerer et objekt direkte og ikke et promise,
    // og importen er feil, kan dette også være et problem.
    // Sjekk dokumentasjonen for pkce-challenge for korrekt import/bruk.
    // Men loggen din tyder sterkt på at det er et Promise.

    const code_verifier = pkce?.code_verifier; // Bruk optional chaining i tilfelle pkce er null/undefined
    const code_challenge = pkce?.code_challenge;

    console.log("PKCE object from pkceChallenge() (awaited):", pkce); // Ny logg etter await
    console.log("Extracted code_verifier:", code_verifier);
    console.log("Extracted code_challenge:", code_challenge);

    if (!code_verifier || !code_challenge) {
        console.error("ERROR: Failed to generate PKCE code_verifier or code_challenge. PKCE object:", pkce);
        return NextResponse.json({ error: 'Failed to generate PKCE challenge' }, { status: 500 });
    }

    const stateCookie = `tiktok_auth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300; Secure=${process.env.NODE_ENV === 'production'};`;
    const verifierCookie = `tiktok_code_verifier=${code_verifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300; Secure=${process.env.NODE_ENV === 'production'};`;

    const scopes = [
        // ... dine scopes ...
        "user.info.basic", "biz.creator.info", "biz.creator.insights", "video.list",
        "tcm.order.update", "user.info.username", "user.info.stats", "user.info.profile",
        "user.account.type", "user.insights", "video.insights", "comment.list",
        "comment.list.manage", "video.publish", "video.upload", "biz.spark.auth"
    ].join(',');

    const authorizationUrl = new URL('https://www.tiktok.com/v2/auth/authorize');
    authorizationUrl.searchParams.append('client_key', clientKey); // clientKey bør være definert her
    authorizationUrl.searchParams.append('scope', scopes);
    authorizationUrl.searchParams.append('response_type', 'code');
    authorizationUrl.searchParams.append('redirect_uri', redirectUri);
    authorizationUrl.searchParams.append('state', state);
    authorizationUrl.searchParams.append('code_challenge', code_challenge);
    authorizationUrl.searchParams.append('code_challenge_method', 'S256');

    console.log("Generated TikTok Authorization URL:", authorizationUrl.toString());
    console.log("Setting state cookie with value:", state);
    console.log("Setting code_verifier cookie with value:", code_verifier);

    const response = NextResponse.redirect(authorizationUrl.toString());
    response.headers.append('Set-Cookie', stateCookie);
    response.headers.append('Set-Cookie', verifierCookie);
    return response;
}