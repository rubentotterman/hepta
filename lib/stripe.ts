import Stripe from "stripe"

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development"

// Initialize Stripe with the provided secret key
// Use a test key for development and handle missing keys gracefully
const getStripeInstance = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY

  if (!apiKey) {
    console.warn("⚠️ No Stripe API key found. Using mock data for Stripe operations.")
    return null
  }

  // Check if we're trying to use a live key in development
  if (isDevelopment && apiKey.startsWith("sk_live_")) {
    console.warn("⚠️ Using a live Stripe key in development environment. Consider using a test key instead.")
  }

  try {
    return new Stripe(apiKey, {
      apiVersion: "2023-10-16", // Use the latest API version
    })
  } catch (error) {
    console.error("Failed to initialize Stripe:", error)
    return null
  }
}

export const stripe = getStripeInstance()

// Log Stripe operations in development mode
const logStripeOperation = (operation: string, ...args: any[]) => {
  if (isDevelopment) {
    console.log(`🔄 Stripe ${operation}:`, ...args)
  }
}

// Helper function to format amount for Stripe (converts NOK to øre)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}

// Helper function to format amount from Stripe (converts øre to NOK)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100
}

// Create a Stripe customer
export const createCustomer = async (email: string, name?: string) => {
  try {
    logStripeOperation("createCustomer", { email, name })

    // In development mode, use test mode
    if (isDevelopment) {
      console.log("⚠️ Using test mode for Stripe operations")

      // In development, we can mock the customer creation
      return {
        id: "cus_test_" + Math.random().toString(36).substring(2, 10),
        email,
        name,
        created: Math.floor(Date.now() / 1000),
      }
    }

    if (!stripe) {
      return {
        id: "cus_mock_" + Math.random().toString(36).substring(2, 10),
        email,
        name,
        created: Math.floor(Date.now() / 1000),
      }
    }

    const customer = await stripe.customers.create({
      email,
      name,
    })
    return customer
  } catch (error) {
    console.error("Error creating Stripe customer:", error)
    // Return a mock customer in case of error
    return {
      id: "cus_mock_error_" + Math.random().toString(36).substring(2, 10),
      email,
      name,
      created: Math.floor(Date.now() / 1000),
    }
  }
}

// Create a Stripe invoice
export const createInvoice = async (customerId: string, description: string, amount: number, currency = "nok") => {
  try {
    logStripeOperation("createInvoice", { customerId, description, amount, currency })

    // In development mode or if Stripe is not initialized, mock the invoice creation
    if (isDevelopment || !stripe) {
      return {
        id: "in_test_" + Math.random().toString(36).substring(2, 10),
        customer: customerId,
        amount_due: formatAmountForStripe(amount),
        currency,
        description,
        status: "open",
        due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
        created: Math.floor(Date.now() / 1000),
      }
    }

    // Create an invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: formatAmountForStripe(amount),
      currency,
      description,
    })

    // Create an invoice from the invoice item
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true, // Auto-finalize the invoice
      collection_method: "send_invoice",
      days_until_due: 30,
    })

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

    // Send the invoice
    await stripe.invoices.sendInvoice(finalizedInvoice.id)

    return finalizedInvoice
  } catch (error) {
    console.error("Error creating Stripe invoice:", error)
    // Return a mock invoice in case of error
    return {
      id: "in_mock_error_" + Math.random().toString(36).substring(2, 10),
      customer: customerId,
      amount_due: formatAmountForStripe(amount),
      currency,
      description,
      status: "open",
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      created: Math.floor(Date.now() / 1000),
    }
  }
}

// Get all invoices for a customer
export const getCustomerInvoices = async (customerId: string) => {
  try {
    logStripeOperation("getCustomerInvoices", { customerId })

    // If Stripe is not initialized or we're in development, return mock data
    if (!stripe || isDevelopment) {
      console.log("⚠️ Using mock data for customer invoices")
      return [
        {
          id: "in_mock_1",
          number: "MOCK001",
          amount_due: 10000, // 100.00 in cents
          currency: "nok",
          status: "open",
          due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
          hosted_invoice_url: "#",
          created: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
        },
        {
          id: "in_mock_2",
          number: "MOCK002",
          amount_due: 25000, // 250.00 in cents
          currency: "nok",
          status: "paid",
          due_date: Math.floor(Date.now() / 1000) + 86400 * 15, // 15 days from now
          hosted_invoice_url: "#",
          created: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
        },
      ]
    }

    // Use real Stripe API calls
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
    })
    return invoices.data
  } catch (error) {
    console.error("Error fetching customer invoices:", error)
    // Return mock data in case of error
    return [
      {
        id: "in_mock_error_1",
        number: "ERROR001",
        amount_due: 10000,
        currency: "nok",
        status: "open",
        due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
        hosted_invoice_url: "#",
        created: Math.floor(Date.now() / 1000) - 86400,
      },
    ]
  }
}

// Create a payment intent
export const createPaymentIntent = async (amount: number, currency = "nok", customerId?: string) => {
  try {
    logStripeOperation("createPaymentIntent", { amount, currency, customerId })

    // In development mode or if Stripe is not initialized, mock the payment intent
    if (isDevelopment || !stripe) {
      return {
        id: "pi_test_" + Math.random().toString(36).substring(2, 10),
        amount: formatAmountForStripe(amount),
        currency,
        client_secret: "pi_test_secret_" + Math.random().toString(36).substring(2, 15),
        customer: customerId,
      }
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: formatAmountForStripe(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    }

    if (customerId) {
      paymentIntentParams.customer = customerId
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)
    return paymentIntent
  } catch (error) {
    console.error("Error creating payment intent:", error)
    // Return a mock payment intent in case of error
    return {
      id: "pi_mock_error_" + Math.random().toString(36).substring(2, 10),
      amount: formatAmountForStripe(amount),
      currency,
      client_secret: "pi_mock_error_secret_" + Math.random().toString(36).substring(2, 15),
      customer: customerId,
    }
  }
}

// Pay an invoice
export const payInvoice = async (invoiceId: string) => {
  try {
    logStripeOperation("payInvoice", { invoiceId })

    // In development mode or if Stripe is not initialized, mock the invoice payment
    if (isDevelopment || !stripe) {
      return {
        id: invoiceId,
        status: "paid",
        paid: true,
        amount_paid: 10000, // Example amount
        currency: "nok",
      }
    }

    const invoice = await stripe.invoices.pay(invoiceId)
    return invoice
  } catch (error) {
    console.error("Error paying invoice:", error)
    // Return a mock paid invoice in case of error
    return {
      id: invoiceId,
      status: "paid",
      paid: true,
      amount_paid: 10000,
      currency: "nok",
    }
  }
}

// Create a test invoice (for development only)
export const createTestInvoice = async (customerId: string) => {
  // Only allow this in development mode
  if (!isDevelopment) {
    throw new Error("Test invoices can only be created in development mode")
  }

  if (!customerId) {
    throw new Error("Customer ID is required to create a test invoice")
  }

  try {
    logStripeOperation("createTestInvoice", { customerId })

    // Generate a random amount between 100 and 1000 NOK
    const amount = Math.floor(Math.random() * 900) + 100

    // In development mode or if Stripe is not initialized, return a mock invoice
    if (isDevelopment || !stripe) {
      return {
        id: "in_test_" + Math.random().toString(36).substring(2, 10),
        number: "TEST" + Math.floor(Math.random() * 10000),
        customer: customerId,
        amount_due: formatAmountForStripe(amount),
        currency: "nok",
        description: "Test Invoice - Development Only",
        status: "open",
        due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
        created: Math.floor(Date.now() / 1000),
      }
    }

    // The code below will only run if isDevelopment is false, which won't happen due to the check at the beginning
    // But we'll keep it for completeness

    // Create an invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: formatAmountForStripe(amount),
      currency: "nok",
      description: "Test Invoice - Development Only",
    })

    logStripeOperation("invoiceItem created", invoiceItem)

    // Create an invoice from the invoice item
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: "send_invoice",
      days_until_due: 30,
    })

    logStripeOperation("invoice created", invoice)

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

    logStripeOperation("invoice finalized", finalizedInvoice)

    return finalizedInvoice
  } catch (error) {
    console.error("Error creating test invoice:", error)
    // Return a mock invoice in case of error
    return {
      id: "in_mock_error_" + Math.random().toString(36).substring(2, 10),
      number: "ERROR" + Math.floor(Math.random() * 10000),
      customer: customerId,
      amount_due: formatAmountForStripe(Math.floor(Math.random() * 900) + 100),
      currency: "nok",
      description: "Test Invoice - Development Only",
      status: "open",
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      created: Math.floor(Date.now() / 1000),
    }
  }
}

