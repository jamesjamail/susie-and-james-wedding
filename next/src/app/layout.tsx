import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import Header from "../components/Header/Header";
import RSVPBanner from "../components/RSVPBanner/RSVPBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Susie and James Wedding",
  description: "Let's celebrate!",
};

console.log(
  "what are you doing poking around in here? <Shrek Get Out Of My Swamp Meme.png>"
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <RSVPBanner /> */}
        <Header />
        {children}
      </body>
    </html>
  );
}
