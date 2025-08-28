import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "EisLager Pro - Ice Cream Management Platform",
  description:
    "Modern, multi-role platform that streamlines ice cream business operations from manufacturing to sales",
  keywords: "ice cream, inventory, management, SaaS, manufacturing, retail",
  authors: [{ name: "EisLager Team" }],
  creator: "EisLager",
  publisher: "EisLager",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://eislagger.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eislagger.com",
    title: "EisLager Pro - Ice Cream Management Platform",
    description:
      "Modern, multi-role platform that streamlines ice cream business operations",
    siteName: "EisLager Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "EisLager Pro - Ice Cream Management Platform",
    description:
      "Modern, multi-role platform that streamlines ice cream business operations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
