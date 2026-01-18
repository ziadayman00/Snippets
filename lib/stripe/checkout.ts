"use server";

import { stripe, STRIPE_CONFIG } from "./config";
import { createClient } from "@/lib/supabase/server";

/**
 * Create a Stripe Checkout session for Pro subscription
 */
export async function createCheckoutSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!STRIPE_CONFIG.proPriceId) {
    throw new Error("Stripe price ID not configured");
  }

  try {
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id, // Link to our user
      line_items: [
        {
          price: STRIPE_CONFIG.proPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        userId: user.id,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user's Stripe customer ID from database
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = userData?.stripe_customer_id;

    if (!customerId) {
        // If user is missing a stripe customer ID (e.g. manually added to DB), create one
        const customer = await stripe.customers.create({
            email: user.email || undefined,
            metadata: { userId: user.id },
        });
        
        customerId = customer.id;

        // Save to DB
        await supabase
            .from("users")
            .update({ stripe_customer_id: customerId })
            .eq("id", user.id);
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_APP_URL + "/dashboard",
    });

    return { url: session.url };
  } catch (error) {
    console.error("Failed to create portal session:", error);
    throw new Error("Failed to create portal session");
  }
}
