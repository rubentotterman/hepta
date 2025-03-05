import Stripe from "stripe"

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development"

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
})

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

      // In development, we  {
      console.log("⚠️ Using test mode for Stripe operations")

      // In development, we can mock the customer creation
      return {
        id: "cus_test_" + Math.random().toString(36).substring(2, 10),
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
    throw error
  }
}

// Create a Stripe invoice
export const createInvoice = async (customerId: string, description: string, amount: number, currency = "nok") => {
  try {
    logStripeOperation("createInvoice", { customerId, description, amount, currency })

    // In development mode, mock the invoice creation
    if (isDevelopment) {
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
    throw error
  }
}

// Get all invoices for a customer
export const getCustomerInvoices = async (customerId: string) => {
  try {
    logStripeOperation("getCustomerInvoices", { customerId })

    // In development mode, return mock invoices
    if (isDevelopment) {
      return [
        {
          id: "in_test_1",
          number: "TEST001",
          amount_due: 10000, // 100.00 in cents
          currency: "nok",
          status: "open",
          due_date: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
          hosted_invoice_url: "#",
          created: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
        },
        {
          id: "in_test_2",
          number: "TEST002",
          amount_due: 25000, // 250.00 in cents
          currency: "nok",
          status: "paid",
          due_date: Math.floor(Date.now() / 1000) + 86400 * 15, // 15 days from now
          hosted_invoice_url: "#",
          created: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
        },
      ]
    }

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
    })
    return invoices.data
  } catch (error) {
    console.error("Error fetching customer invoices:", error)
    throw error
  }
}

// Create a payment intent
export const createPaymentIntent = async (amount: number, currency = "nok", customerId?: string) => {
  try {
    logStripeOperation("createPaymentIntent", { amount, currency, customerId })

    // In development mode, mock the payment intent
    if (isDevelopment) {
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
    throw error
  }
}

// Pay an invoice
export const payInvoice = async (invoiceId: string) => {
  try {
    logStripeOperation("payInvoice", { invoiceId })

    // In development mode, mock the invoice payment
    if (isDevelopment) {
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
    throw error
  }
}

// Create a test invoice (for development only)
export const createTestInvoice = async (customerId: string) => {
  if (!isDevelopment && !process.env.ALLOW_TEST_INVOICES) {
    throw new Error("Test invoices can only be created in development mode or with ALLOW_TEST_INVOICES enabled")
  }

  if (!customerId) {
    throw new Error("Customer ID is required to create a test invoice")
  }

  try {
    logStripeOperation("createTestInvoice", { customerId })

    // Generate a random amount between 100 and 1000 NOK
    const amount = Math.floor(Math.random() * 900) + 100

    // In development mode, return a mock invoice
    if (isDevelopment) {
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
    throw error
  }
}

