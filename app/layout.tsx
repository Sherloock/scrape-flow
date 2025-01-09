import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.css";

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
    <html lang="en">
      <body className={inter.className}>
				<AppProviders>
					{children}
				</AppProviders>
			</body>
    </html>
  );
}
