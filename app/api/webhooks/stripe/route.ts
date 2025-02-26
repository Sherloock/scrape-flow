import { HttpStatus } from "@/lib/helper/http";
import { handleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
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

		// console.log("@@Stripe webhook event", event.type);

		switch (event.type) {
			case "checkout.session.completed":
				handleCheckoutSessionCompleted(event.data.object);
				break;
			default:
				// console.log("Unhandled event type", event.type);
				break;
		}

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
