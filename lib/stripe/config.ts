import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

/**
 * Stripe client instance
 * Uses test mode by default (keys starting with sk_test_)
 * Switch to production by using live keys (sk_live_)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

/**
 * Stripe configuration
 * Update STRIPE_PRICE_ID when switching to production
 */
export const STRIPE_CONFIG = {
  // Pro Plan Price ID (monthly)
  // Test mode: Use test price ID (price_xxx from Stripe test dashboard)
  // Production: Replace with live price ID (price_xxx from Stripe live dashboard)
  proPriceId: process.env.STRIPE_PRICE_ID || "",
  
  // Success/Cancel URLs
  successUrl: process.env.NEXT_PUBLIC_APP_URL + "/dashboard?upgrade=success",
  cancelUrl: process.env.NEXT_PUBLIC_APP_URL + "/pricing?upgrade=cancelled",
  
  // Webhook secret (different for test/live)
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
} as const;

/**
 * Check if we're in test mode
 */
export const isStripeTestMode = () => {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
};
