import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/lib/pixel-retroui-setup.js';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRASH LAND",
  description: "A place to hang out",
};

const coolGradient = 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 20%, rgba(255, 255, 255, 0.3) 80%, rgba(255, 255, 255, 0) 100%)';

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
        <div style={{ background: coolGradient, height: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
