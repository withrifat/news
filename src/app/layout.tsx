import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bengali-news.vercel.app"
  ),
  title: {
    default: "দেশ বার্তা — বাংলাদেশের খবর, সবার আগে",
    template: "%s | দেশ বার্তা",
  },
  description:
    "দেশ বার্তা — বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ। রাজনীতি, অর্থনীতি, খেলা, প্রযুক্তি ও বিনোদনের তাজা খবর সবার আগে।",
  keywords: [
    "দেশ বার্তা",
    "Deshbarta",
    "বাংলা সংবাদ",
    "Bangla news",
    "বাংলাদেশ সংবাদ",
    "Online news Bangladesh",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "দেশ বার্তা",
    title: "দেশ বার্তা — বাংলাদেশের খবর, সবার আগে",
    description:
      "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ। রাজনীতি, অর্থনীতি, খেলা, প্রযুক্তি ও বিনোদনের তাজা খবর সবার আগে।",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 400,
        alt: "দেশ বার্তা লোগো",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "দেশ বার্তা — বাংলাদেশের খবর, সবার আগে",
    description: "বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ সবার আগে।",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${hindSiliguri.variable} ${inter.variable} font-bengali antialiased grain-overlay min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
