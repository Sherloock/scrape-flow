import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { CoinsIcon } from "lucide-react";
import CreditsPurchase from "@/app/(dashboard)/billing/_components/CreditsPurchase";
export default function BillingPage() {
	return (
		<div className="w-full items-start space-y-8 p-4 pt-0">
			<h1 className="text-3xl font-bold">Billing</h1>

			<Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
				<BalanceCard />
			</Suspense>

			<CreditsPurchase />
		</div>
	);
}

async function BalanceCard() {
	const userBalance = await getAvailableCredits();
	return (
		<Card className="flex flex-col justify-between overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
			<CardContent className="relative items-center p-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="mb-1 text-lg font-semibold text-foreground">
							Available Credits
						</h3>
						<p className="text-4xl font-bold text-primary">
							<ReactCountUpWrapper value={userBalance} />
						</p>
					</div>
				</div>
				<CoinsIcon
					size={140}
					className="absolute bottom-0 right-0 text-primary opacity-20"
				/>
			</CardContent>
			<CardFooter className="text-sm text-muted-foreground">
				When your credits reach zero, your workflows will stop working.
			</CardFooter>
		</Card>
	);
}
