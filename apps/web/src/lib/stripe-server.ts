import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY が設定されていません。apps/web/.env.local を確認してください。"
    );
  }
  return new Stripe(key);
}
