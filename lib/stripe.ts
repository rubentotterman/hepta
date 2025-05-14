// lib/stripe.ts
import Stripe from "stripe";

const isDevelopment = process.env.NODE_ENV === "development";

// --- Funksjon for å initialisere Stripe ---
const getStripeInstance = (): Stripe | null => {
  const apiKeyFromEnv = process.env.STRIPE_SECRET_KEY;

  console.log("\n--- DEBUG: lib/stripe.ts -> getStripeInstance ---");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Raw STRIPE_SECRET_KEY from env:", apiKeyFromEnv);

  if (!apiKeyFromEnv) {
    console.warn("⚠️ lib/stripe.ts: STRIPE_SECRET_KEY is NOT SET in environment variables. Stripe operations will be mocked or fail.");
    return null;
  }

  if (apiKeyFromEnv.startsWith("sk_live_")) {
    console.warn("🔴 lib/stripe.ts: WARNING: Attempting to use a LIVE Stripe key (sk_live_).");
    if (isDevelopment) {
      console.warn("🔴🔴🔴 lib/stripe.ts: Using a LIVE Stripe key in DEVELOPMENT. This is dangerous and likely unintended. Stripe will NOT be initialized with a live key in dev.");
      return null; // Forhindre bruk av live-nøkkel i dev
    }
  } else if (apiKeyFromEnv.startsWith("sk_test_")) {
    console.log("✅ lib/stripe.ts: Using a TEST Stripe key (sk_test_). This is good for development.");
  } else {
    // Viser kun de første og siste tegnene av nøkkelen av sikkerhetshensyn i loggen
    const maskedDisplayKey = apiKeyFromEnv.length > 14 ? apiKeyFromEnv.substring(0, 7) + "..." + apiKeyFromEnv.substring(apiKeyFromEnv.length - 4) : apiKeyFromEnv;
    console.warn(`⚠️ lib/stripe.ts: STRIPE_SECRET_KEY ("${maskedDisplayKey}") does not look like a valid Stripe secret key (should start with sk_test_ or sk_live_).`);
    return null;
  }

  try {
    const maskedDisplayKey = apiKeyFromEnv.length > 14 ? apiKeyFromEnv.substring(0, 7) + "..." + apiKeyFromEnv.substring(apiKeyFromEnv.length - 4) : apiKeyFromEnv;
    console.log(`lib/stripe.ts: Attempting to initialize Stripe with API key: ${maskedDisplayKey}`);

    const stripeInstance = new Stripe(apiKeyFromEnv, {
      apiVersion: "2023-10-16", // Du kan oppdatere denne til nyeste Stripe anbefaler
      typescript: true, // Bra for type-sikkerhet
    });
    console.log("✅ lib/stripe.ts: Stripe initialized successfully.");
    return stripeInstance;
  } catch (error) {
    console.error("❌ lib/stripe.ts: Failed to initialize Stripe with API key. Error:", error);
    return null;
  }
};

// Initialiser Stripe-instansen én gang
export const stripe = getStripeInstance();

// --- Hjelpefunksjoner ---
const logStripeOperation = (operation: string, ...args: any[]) => {
  if (isDevelopment) { // Logg kun i utvikling
    console.log(`🔄 lib/stripe.ts: Stripe Operation - ${operation}:`, ...args);
  }
};

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100); // Konverterer NOK til øre
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100; // Konverterer øre til NOK
};

// --- Stripe API-kall funksjoner ---

export const createCustomer = async (email: string, name?: string, metadata?: Stripe.MetadataParam) => {
  logStripeOperation("createCustomer - Start", { email, name, metadata });
  console.log("--- DEBUG: lib/stripe.ts -> createCustomer ---");
  console.log("Is 'stripe' object initialized here?", stripe ? "YES" : "NO - Stripe key likely missing/invalid in env!");

  if (!stripe) {
    console.warn("⚠️ lib/stripe.ts: Stripe instance is null in createCustomer. Returning MOCK customer.");
    return {
      id: "cus_mock_STRIPE_NULL_" + Date.now().toString(36) + Math.random().toString(36).substring(2),
      email,
      name,
      metadata,
      object: 'customer' as const, // Legg til object type for bedre type-matching
      created: Math.floor(Date.now() / 1000),
      error: true, // Indikerer at dette er en mock pga. feil
      message: "Stripe not initialized (null instance), returning mock customer."
    };
  }

  try {
    console.log(`lib/stripe.ts: Attempting REAL Stripe API call: customers.create for email: ${email}`);
    const customerParams: Stripe.CustomerCreateParams = { email };
    if (name) customerParams.name = name;
    if (metadata) customerParams.metadata = metadata;

    const customer = await stripe.customers.create(customerParams);
    console.log("✅ lib/stripe.ts: Stripe customer created successfully via API. ID:", customer.id);
    return customer;
  } catch (error: any) {
    console.error("❌ lib/stripe.ts: Error calling Stripe API (customers.create):", error);
    return {
      id: "cus_mock_API_ERROR_" + Date.now().toString(36) + Math.random().toString(36).substring(2),
      email,
      name,
      metadata,
      object: 'customer' as const,
      created: Math.floor(Date.now() / 1000),
      error: true,
      message: error.message || "Unknown error during Stripe API call to create customer"
    };
  }
};

export const createPaymentIntent = async (amount: number, currency = "nok", customerId?: string) => {
  logStripeOperation("createPaymentIntent - Start", { amount, currency, customerId });
  console.log("--- DEBUG: lib/stripe.ts -> createPaymentIntent ---");
  console.log("Is 'stripe' object initialized here?", stripe ? "YES" : "NO - Stripe key likely missing/invalid in env!");

  if (!stripe) {
    console.warn("⚠️ lib/stripe.ts: Stripe instance is null in createPaymentIntent. Returning MOCK Payment Intent.");
    const mockClientSecret = "pi_mock_secret_STRIPE_NULL_" + Date.now().toString(36) + Math.random().toString(36).substring(2);
    return {
      id: "pi_mock_STRIPE_NULL_" + Date.now().toString(36) + Math.random().toString(36).substring(2),
      amount: formatAmountForStripe(amount),
      currency,
      client_secret: mockClientSecret,
      customer: customerId,
      status: 'requires_payment_method' as Stripe.PaymentIntent.Status,
      object: 'payment_intent' as const,
      error: true,
      message: "Stripe not initialized (null instance), returning mock payment intent."
    };
  }

  try {
    console.log(`lib/stripe.ts: Attempting REAL Stripe API call: paymentIntents.create. Amount: ${amount}, Currency: ${currency}, CustomerID: ${customerId || 'None'}`);
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: formatAmountForStripe(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    if (customerId) {
      paymentIntentParams.customer = customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    console.log("✅ lib/stripe.ts: REAL Stripe Payment Intent created. Client Secret starts with:", paymentIntent.client_secret?.substring(0,15) + "...");
    return paymentIntent;
  } catch (error: any) {
    console.error("❌ lib/stripe.ts: Error calling Stripe API (paymentIntents.create):", error);
    const mockClientSecret = "pi_mock_secret_API_ERROR_" + Date.now().toString(36) + Math.random().toString(36).substring(2);
    return {
      id: "pi_mock_API_ERROR_" + Date.now().toString(36) + Math.random().toString(36).substring(2),
      amount: formatAmountForStripe(amount),
      currency,
      client_secret: mockClientSecret,
      customer: customerId,
      status: 'requires_payment_method' as Stripe.PaymentIntent.Status,
      object: 'payment_intent' as const,
      error: true,
      message: error.message || "Unknown error during Stripe API call to create payment intent"
    };
  }
};


// --- Dine andre Stripe-hjelpefunksjoner ---
// Du bør gå gjennom disse og legge til lignende `if (!stripe)` sjekker og logging
// hvis du vil at de skal håndtere manglende Stripe-initialisering grasiøst
// eller alltid prøve ekte kall hvis `stripe` er tilgjengelig.

export const createInvoice = async (customerId: string, description: string, amount: number, currency = "nok") => {
  logStripeOperation("createInvoice - Start", { customerId, description, amount, currency });
  console.log("--- DEBUG: lib/stripe.ts -> createInvoice --- 'stripe' initialized?", stripe ? "YES" : "NO");
  if (!stripe) {
    console.warn("⚠️ lib/stripe.ts: Stripe instance is null in createInvoice. Returning MOCK invoice.");
    return {
      id: "in_mock_STRIPE_NULL_" + Date.now().toString(36),
      customer: customerId,
      amount_due: formatAmountForStripe(amount),
      currency,
      description,
      status: "open",
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      created: Math.floor(Date.now() / 1000),
      error: true, message: "Stripe not initialized"
    };
  }
  try {
    console.log(`lib/stripe.ts: Attempting REAL Stripe API call for createInvoice. Customer: ${customerId}`);
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: formatAmountForStripe(amount),
      currency,
      description,
    });
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: "send_invoice",
      days_until_due: 30,
    });
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(finalizedInvoice.id);
    console.log("✅ lib/stripe.ts: REAL Stripe Invoice created and sent. ID:", finalizedInvoice.id);
    return finalizedInvoice;
  } catch (error: any) {
    console.error("❌ lib/stripe.ts: Error creating REAL Stripe invoice:", error);
    return {
      id: "in_mock_API_ERROR_" + Date.now().toString(36),
      customer: customerId,
      amount_due: formatAmountForStripe(amount),
      currency,
      description,
      status: "open",
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      created: Math.floor(Date.now() / 1000),
      error: true, message: error.message || "Unknown API error creating invoice"
    };
  }
};

export const getCustomerInvoices = async (customerId: string) => {
  logStripeOperation("getCustomerInvoices - Start", { customerId });
  console.log("--- DEBUG: lib/stripe.ts -> getCustomerInvoices --- 'stripe' initialized?", stripe ? "YES" : "NO");
  if (!stripe) {
    console.warn("⚠️ lib/stripe.ts: Stripe instance is null in getCustomerInvoices. Returning MOCK invoices.");
    return [
      {
        id: "in_mock_STRIPE_NULL_cust_inv", customer: customerId, amount_due: 10000, currency: "nok", status: "open",
        due_date: Math.floor(Date.now() / 1000) + 86400 * 30, hosted_invoice_url: "#", created: Math.floor(Date.now() / 1000) - 86400,
        error: true, message: "Stripe not initialized"
      }
    ];
  }
  try {
    console.log(`lib/stripe.ts: Attempting REAL Stripe API call for getCustomerInvoices. Customer: ${customerId}`);
    const invoices = await stripe.invoices.list({ customer: customerId, limit: 100 });
    console.log(`✅ lib/stripe.ts: Fetched ${invoices.data.length} REAL Stripe Invoices for customer.`);
    return invoices.data;
  } catch (error: any) {
    console.error("❌ lib/stripe.ts: Error fetching REAL customer invoices:", error);
    return [
      {
        id: "in_mock_API_ERROR_cust_inv", customer: customerId, amount_due: 10000, currency: "nok", status: "open",
        due_date: Math.floor(Date.now() / 1000) + 86400 * 30, hosted_invoice_url: "#", created: Math.floor(Date.now() / 1000) - 86400,
        error: true, message: error.message || "Unknown API error fetching invoices"
      }
    ];
  }
};

export const payInvoice = async (invoiceId: string) => {
  logStripeOperation("payInvoice - Start", { invoiceId });
  console.log("--- DEBUG: lib/stripe.ts -> payInvoice --- 'stripe' initialized?", stripe ? "YES" : "NO");
  if (!stripe) {
    console.warn("⚠️ lib/stripe.ts: Stripe instance is null in payInvoice. Returning MOCK payment status.");
    return {
      id: invoiceId, status: "paid", paid: true, amount_paid: 10000, currency: "nok",
      error: true, message: "Stripe not initialized"
    };
  }
  try {
    console.log(`lib/stripe.ts: Attempting REAL Stripe API call for payInvoice. Invoice ID: ${invoiceId}`);
    const invoice = await stripe.invoices.pay(invoiceId);
    console.log("✅ lib/stripe.ts: REAL Stripe Invoice paid. Status:", invoice.status);
    return invoice;
  } catch (error: any) {
    console.error("❌ lib/stripe.ts: Error paying REAL Stripe invoice:", error);
    return {
      id: invoiceId, status: "open", paid: false, /*amount_paid might not be set*/
      error: true, message: error.message || "Unknown API error paying invoice"
    };
  }
};

export const createTestInvoice = async (customerId: string) => {
  logStripeOperation("createTestInvoice - Start", { customerId });
  console.log("--- DEBUG: lib/stripe.ts -> createTestInvoice --- 'stripe' initialized?", stripe ? "YES" : "NO");

  if (!isDevelopment) {
    console.error("❌ lib/stripe.ts: createTestInvoice called outside development mode.");
    throw new Error("Test invoices can only be created in development mode");
  }
  if (!customerId) {
    console.error("❌ lib/stripe.ts: Customer ID is required for createTestInvoice.");
    throw new Error("Customer ID is required to create a test invoice");
  }
  if (!stripe) {
    console.warn("⚠️ lib/stripe.ts: Stripe instance is null in createTestInvoice. Returning MOCK test invoice.");
    const amount = Math.floor(Math.random() * 900) + 100;
    return {
      id: "in_test_mock_STRIPE_NULL_" + Date.now().toString(36),
      number: "TEST_MOCK" + Math.floor(Math.random() * 10000),
      customer: customerId,
      amount_due: formatAmountForStripe(amount),
      currency: "nok",
      description: "Mock Test Invoice - Stripe Not Initialized",
      status: "open",
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      created: Math.floor(Date.now() / 1000),
      error: true,
      message: "Stripe not initialized"
    };
  }
  try {
    console.log(`lib/stripe.ts: Attempting REAL Stripe API call for createTestInvoice. Customer: ${customerId}`);
    const amount = Math.floor(Math.random() * 900) + 100;
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: formatAmountForStripe(amount),
      currency: "nok",
      description: "Test Invoice - Development Only (REAL CALL)",
    });
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: "send_invoice",
      days_until_due: 30,
    });
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    console.log("✅ lib/stripe.ts: REAL Stripe Test Invoice created. ID:", finalizedInvoice.id);
    return finalizedInvoice;
  } catch (error: any) {
    console.error("❌ lib/stripe.ts: Error creating REAL test invoice:", error);
    const amount = Math.floor(Math.random() * 900) + 100;
    return {
      id: "in_test_mock_API_ERROR_" + Date.now().toString(36),
      number: "TEST_MOCK_ERROR" + Math.floor(Math.random() * 10000),
      customer: customerId,
      amount_due: formatAmountForStripe(amount),
      currency: "nok",
      description: "Mock Test Invoice - API Error",
      status: "open",
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      created: Math.floor(Date.now() / 1000),
      error: true,
      message: error.message || "Unknown error"
    };
  }
};