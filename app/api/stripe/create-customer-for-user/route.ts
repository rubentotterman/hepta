// app/api/stripe/create-customer-for-user/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createCustomer } from "@/lib/stripe"; // Anta at createCustomer er justert som tidligere diskutert

export async function POST(req: Request) {
  try {
    // Hent brukerdata direkte fra Supabase Auth sesjonen på serveren
    // i stedet for å stole på at klienten sender korrekt userId.
    // Dette er sikrere og mer pålitelig.
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("Auth error or no user:", authError);
      return NextResponse.json({ error: "User not authenticated or session expired" }, { status: 401 });
    }

    const authUserId = authUser.id; // Dette er brukerens UUID fra auth.users
    const userEmail = authUser.email;

    // Hent navn fra request body hvis det sendes, ellers kanskje fra user_metadata
    const { name: requestName } = await req.json().catch(() => ({ name: undefined })); // Håndter hvis body er tom/feil
    const name = requestName || authUser.user_metadata?.full_name; // Eksempel på fallback

    if (!authUserId || !userEmail) {
      // Dette burde ikke skje hvis authUser er gyldig, men som en ekstra sjekk
      return NextResponse.json({ error: "User ID or email missing from session" }, { status: 400 });
    }

    // Sjekk om brukeren allerede har en customer ID
    // Bruk 'user_id'-kolonnen (som er UUID) for å slå opp profilen
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("stripe_customer_id, id") // Velg også den numeriske 'id' hvis du trenger den senere
        .eq("user_id", authUserId) // <--- KORRIGERT: Bruk 'user_id'-kolonnen
        .single();

    if (profileError && profileError.code !== "PGRST116") { // PGRST116 = no rows found
      console.error("Error fetching profile:", profileError);
      // Ikke kast feilen her, la den gå videre til generell feilhåndtering
      return NextResponse.json({ error: `Error fetching profile: ${profileError.message}` }, { status: 500 });
    }

    // If the user already has a customer ID, return it
    if (profile?.stripe_customer_id) {
      return NextResponse.json({ customerId: profile.stripe_customer_id });
    }

    // Create a new Stripe customer
    // Sørg for at createCustomer-funksjonen i lib/stripe.ts er robust
    const customer = await createCustomer(userEmail!, name, { supabaseUUID: authUserId }); // Send med supabaseUUID som metadata

    if (!customer || customer.error || !customer.id) { // Sjekk om customer-objektet er gyldig
      console.error("Failed to create Stripe customer object or customer ID missing:", customer);
      const stripeErrorMessage = customer?.message || "Stripe customer creation returned invalid data";
      return NextResponse.json({ error: `Failed to create Stripe customer: ${stripeErrorMessage}` }, { status: 500 });
    }


    // Lagre/oppdater customer ID til brukerens profil
    // Bruk 'user_id' for å identifisere raden, og la 'id' (bigint) auto-inkrementere hvis det er en ny profil
    const upsertData: any = {
      user_id: authUserId, // Identifiser/sett UUID-linken
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString(),
    };

    // Hvis det er en ny profil, må du også sette inn verdier for andre påkrevde felter
    // eller la dem ha default-verdier i databasen.
    // Siden 'id' (bigint) er primærnøkkel og sannsynligvis auto-generert,
    // trenger vi ikke å spesifisere den for en ny rad hvis 'user_id' er den unike nøkkelen for upsert.
    // Supabase upsert vil bruke 'user_id' for konfliktløsning hvis du har en UNIQUE constraint på den.
    // Hvis 'id' (bigint) er den du vil upsert-e på (og du har den fra 'profile' hvis den fantes), juster deretter.
    // Mest sannsynlig vil du upsert-e basert på user_id for å sikre at én auth-bruker har én profil.

    // Forutsetter at 'user_id' i 'profiles' har en UNIQUE constraint for at upsert skal fungere som forventet.
    // Eller at du vil oppdatere basert på den numeriske 'id' hvis profilen ble funnet.
    let finalUpsertData;
    if (profile && profile.id) { // Profil fantes, bruk dens numeriske id for å være eksplisitt
      finalUpsertData = { ...upsertData, id: profile.id };
    } else { // Ny profil, id (bigint) vil bli auto-generert, user_id settes
      finalUpsertData = { ...upsertData };
      // Hvis du også setter navn/epost ved profil-opprettelse:
      if (name) finalUpsertData.name = name;
      // if (userEmail && !profile) finalUpsertData.email = userEmail; // hvis profiles har en email-kolonne
    }


    const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(finalUpsertData, { onConflict: 'user_id' }); // Upsert basert på user_id (krever UNIQUE constraint på user_id)
    // Hvis du vil upsert-e på den numeriske 'id', bruk { onConflict: 'id' } og sørg for at 'id' er i finalUpsertData

    if (upsertError) {
      console.error("Error saving customer ID to profile:", upsertError);
      return NextResponse.json({ error: `Error saving Stripe customer ID: ${upsertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ customerId: customer.id });

  } catch (error: any) {
    console.error("Unhandled error in create Stripe customer endpoint:", error);
    return NextResponse.json(
        { error: `Failed to create Stripe customer (unhandled): ${error.message}` },
        { status: 500 },
    );
  }
}