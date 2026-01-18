import { NextRequest, NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe/checkout";

/**
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for subscription management
 */
export async function POST(req: NextRequest) {
  try {
    const { url } = await createPortalSession();

    if (!url) {
      return NextResponse.json(
        { error: "Failed to create portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Portal API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
