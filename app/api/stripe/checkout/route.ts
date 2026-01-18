import { createCheckoutSession } from "@/lib/stripe/checkout";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { url } = await createCheckoutSession();
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    console.error("Stripe checkout error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
