import { HttpStatus } from "@/lib/helper/http";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get("stripe-signature") as string;

	try {
		const event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);

		return new NextResponse("Webhook received", {
			status: HttpStatus.OK,
		});
	} catch (error) {
		console.error("Stripe webhook error", error);
		return new NextResponse("Webhook error", {
			status: HttpStatus.BAD_REQUEST,
		});
	}
}
