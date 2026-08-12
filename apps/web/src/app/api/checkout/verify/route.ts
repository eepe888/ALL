import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ paid: session.payment_status === "paid" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ paid: false }, { status: 500 });
  }
}
