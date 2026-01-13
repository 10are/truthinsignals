import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

        {children}
      </body>
    </html>
  );
}
