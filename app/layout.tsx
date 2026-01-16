import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import AdBlockDetector from "./components/AdBlockDetector";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Truth In Signals - Fun Relationship Quizzes",
  description:
    "Discover the truth about your relationships with our fun, revealing quizzes. Does he love you? Is your relationship toxic? Find out now!",
  keywords:
    "relationship quiz, love quiz, does he love me, toxic relationship test, dating quiz",
  metadataBase: new URL("https://www.truthinsignals.com"),
  openGraph: {
    title: "Truth In Signals - Fun Relationship Quizzes",
    description: "Discover the truth about your relationships with our fun, revealing quizzes!",
    url: "https://www.truthinsignals.com",
    siteName: "Truth In Signals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Truth In Signals - Fun Relationship Quizzes",
    description: "Discover the truth about your relationships with our fun, revealing quizzes!",
  },
  other: {
    "google-adsense-account": "ca-pub-2898264794440783",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* AdSense */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2898264794440783"
          crossOrigin="anonymous"
        />

        {/* GA4 */}
        <Script
          async
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-C1RSE4MKB1"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C1RSE4MKB1', { anonymize_ip: true });
          `}
        </Script>

        <AdBlockDetector />

        {/* Global Navbar */}
        <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/logo.png"
                  alt="Truth In Signals"
                  width={736}
                  height={808}
                  className="h-9 w-auto"
                  priority
                />
                <span className="hidden sm:block text-lg font-bold text-gray-100">
                  Truth<span className="text-red-400">In</span>Signals
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  Home
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  Quizzes
                </Link>
                <Link
                  href="/redflags"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all"
                >
                  Red Flags
                </Link>
                <Link
                  href="/redflags/my-flags"
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-lg transition-all"
                >
                  My Flags
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
