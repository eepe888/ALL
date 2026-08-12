import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";

const REMOVE_ADS_PRICE_JPY = 300;

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin") ?? new URL(request.url).origin;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: "絵探しゲーム - 広告非表示" },
            unit_amount: REMOVE_ADS_PRICE_JPY,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/e-sagashi/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/e-sagashi`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
