import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Athletix",
    template: "%s | Athletix",
  },
  description: "The ultimate platform for athletes to share highlights, connect with fans, and build their personal brand.",
  keywords: ["sports", "athletics", "highlights", "athletes", "teams", "sports videos"],
  authors: [{ name: "Athletix" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Athletix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
