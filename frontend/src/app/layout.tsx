import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "LinguaFlow — Universal AI PDF Translator",
    template: "%s | LinguaFlow",
  },
  description:
    "Translate any PDF across 100+ languages while preserving its original layout, typography, tables, and visual structure.",
  keywords: [
    "PDF translator",
    "AI translation",
    "document translation",
    "multilingual PDF",
    "layout preservation",
    "OCR translation",
  ],
  authors: [{ name: "LinguaFlow" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linguaflow.ai",
    siteName: "LinguaFlow",
    title: "LinguaFlow — Universal AI PDF Translator",
    description:
      "Translate any PDF across 100+ languages while preserving its original layout, typography, tables, and visual structure.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LinguaFlow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinguaFlow — Universal AI PDF Translator",
    description:
      "Translate any PDF across 100+ languages while preserving its original layout, typography, tables, and visual structure.",
    images: ["/og.png"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
          >
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
