"use server";

import { stripe, STRIPE_CONFIG } from "./config";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

/**
 * Handle subscription created event
 * Upgrades user to Pro when payment succeeds
 */
export async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const customerId = subscription.customer as string;

  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }

  try {
    // Update user to Pro role and store customer ID
    await db
      .update(users)
      .set({
        role: "pro",
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
      })
      .where(eq(users.id, userId));

    console.log(`✅ User ${userId} upgraded to Pro`);
  } catch (error) {
    console.error("Failed to upgrade user:", error);
    throw error;
  }
}

/**
 * Handle subscription updated event
 * Handles plan changes, renewals, etc.
 */
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  try {
    // Check if subscription is active
    const isActive = subscription.status === "active" || subscription.status === "trialing";

    // Update user role based on subscription status
    await db
      .update(users)
      .set({
        role: isActive ? "pro" : "user",
        stripeSubscriptionId: subscription.id,
      })
      .where(eq(users.stripeCustomerId, customerId));

    console.log(`✅ Subscription ${subscription.id} updated (status: ${subscription.status})`);
  } catch (error) {
    console.error("Failed to update subscription:", error);
    throw error;
  }
}

/**
 * Handle subscription deleted/cancelled event
 * Downgrades user to free tier
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  try {
    // Downgrade user to free tier
    await db
      .update(users)
      .set({
        role: "user",
        stripeSubscriptionId: null,
      })
      .where(eq(users.stripeCustomerId, customerId));

    console.log(`✅ User downgraded to free (subscription ${subscription.id} cancelled)`);
  } catch (error) {
    console.error("Failed to downgrade user:", error);
    throw error;
  }
}

/**
 * Handle checkout session completed event
 * Links customer to user when checkout completes
 */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;

  if (!userId) {
    console.error("No client_reference_id in checkout session");
    return;
  }

  try {
    // Store customer ID (subscription will be handled by subscription.created event)
    await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
      })
      .where(eq(users.id, userId));

    console.log(`✅ Checkout completed for user ${userId}`);
  } catch (error) {
    console.error("Failed to link customer:", error);
    throw error;
  }
}
