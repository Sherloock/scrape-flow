import "@/app/globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "FlowScrape",
	description: "FlowScraper",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			afterSignOutUrl="/sign-in"
			appearance={{
				elements: {
					formButtonPrimary:
						"bg-primary hover:bg-primary/90 text-sm !shadow-none",
				},
			}}
		>
			<html lang="en">
				<body className={inter.className}>
					<AppProviders>{children}</AppProviders>
					<Toaster richColors />
				</body>
			</html>
		</ClerkProvider>
	);
}
