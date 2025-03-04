import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardFooter,
	CardTitle,
	CardHeader,
	CardDescription,
} from "@/components/ui/card";
import { Suspense } from "react";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { ArrowLeftRightIcon, CoinsIcon, BarChart3Icon } from "lucide-react";
import CreditsPurchase from "@/app/(dashboard)/billing/_components/CreditsPurchase";
import { getCreditsUsageStats } from "@/actions/analitics/getCreditsUsageStats";
import { getCurrentMonth, Month } from "@/types/analitics";
import CreditUsageChart from "@/app/(dashboard)/billing/_components/CreditUsageChart";
import { getUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import InvoiceBtn from "@/app/(dashboard)/billing/_components/InvoiceBtn";
import { getAIUsageStats } from "@/actions/analitics/getAIUsageStats";
import {
	outputTokenPricePerMillionTokens,
	inputTokenPricePerMillionTokens,
} from "@/lib/helper/ai";
import { monthToDateRange } from "@/lib/helper/dates";

export default function BillingPage() {
	return (
		<div className="w-full items-start space-y-8 p-4 pt-0">
			<h1 className="text-3xl font-bold">Billing</h1>

			<Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
				<BalanceCard />
			</Suspense>

			<CreditsPurchase />

			<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
				<CreditsUsageCard />
			</Suspense>

			<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
				<AIUsageCard />
			</Suspense>
			<Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
				<UserPurchaseHistoryCard />
			</Suspense>
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

export async function AIUsageCard({
	selectedMonth,
}: {
	selectedMonth?: Month;
}) {
	const month = selectedMonth ?? getCurrentMonth();

	const { inputTokens, outputTokens, inputTokensCost, outputTokensCost } =
		await getAIUsageStats(month);

	const totalCost = inputTokensCost + outputTokensCost;
	const monthString = monthToDateRange(month).startDate.toLocaleString(
		"en-US",
		{
			month: "long",
			year: "numeric",
		}
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<BarChart3Icon size={20} className="text-primary" />
					AI Credit Usage
				</CardTitle>
				<CardDescription>
					Breakdown of your AI token usage and associated credit costs for the
					current month from the first day of the month to the last day of the
					month.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="rounded-lg border bg-card p-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">Input Tokens</p>
								{/* <p className="text-sm text-muted-foreground">
									{inputTokenPricePerMillionTokens}credit / 1M input tokens
								</p> */}
							</div>
							<div className="mt-2 flex items-baseline justify-between">
								<p className="text-2xl font-bold">
									<ReactCountUpWrapper value={inputTokens} />
								</p>
								<p className="text-sm font-medium text-primary">
									{inputTokensCost} credits
								</p>
							</div>
						</div>

						<div className="rounded-lg border bg-card p-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">Output Tokens</p>
								{/* <p className="text-sm text-muted-foreground">
									{outputTokenPricePerMillionTokens} credits / 1M output tokens
								</p> */}
							</div>
							<div className="mt-2 flex items-baseline justify-between">
								<p className="text-2xl font-bold">
									<ReactCountUpWrapper value={outputTokens} />
								</p>
								<p className="text-sm font-medium text-primary">
									{outputTokensCost} credits
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-lg border bg-primary/5 p-4">
						<div className="flex items-center justify-between">
							<p className="font-medium">
								Total AI Credit Usage for {monthString}
							</p>
							<p className="font-bold text-primary">{totalCost} credits</p>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="text-sm text-muted-foreground">
				AI usage is billed at {inputTokenPricePerMillionTokens} credits per
				million input tokens and {outputTokenPricePerMillionTokens} credits per
				million output tokens.
			</CardFooter>
		</Card>
	);
}

async function CreditsUsageCard() {
	const month: Month = getCurrentMonth();
	const creditsUsage = await getCreditsUsageStats(month);
	return (
		<CreditUsageChart
			data={creditsUsage}
			title="Total Credits Usage"
			description="Credits usage for the current month (contains AI usage)"
		/>
	);
}

function formatDate(date: Date) {
	return Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function formatAmount(amountCents: number, currency: string) {
	return Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amountCents / 100);
}

async function UserPurchaseHistoryCard() {
	const transactions = await getUserPurchaseHistory();
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl font-bold">
					<ArrowLeftRightIcon className="size-6 text-primary" />
					Transaction History
				</CardTitle>
				<CardDescription>
					View your transaction history and download invoices.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{transactions.length === 0 && (
					<p className="text-center text-sm text-muted-foreground">
						No transactions yet.
					</p>
				)}

				{transactions.map((transaction) => (
					<div
						key={transaction.id}
						className="flex items-center justify-between border-b py-3 last:border-b-0"
					>
						<div>
							<p className="font-medium">{formatDate(transaction.date)}</p>
							<p className="text-sm text-muted-foreground">
								{transaction.description}
							</p>
						</div>

						<div className="text-right">
							<p className="text-sm text-muted-foreground">
								{formatAmount(transaction.price, transaction.currency)}
							</p>

							<InvoiceBtn id={transaction.id} />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
