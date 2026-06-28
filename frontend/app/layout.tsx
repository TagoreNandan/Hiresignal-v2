import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./../styles/globals.css";
import { Header } from "@/components/features/shared/Header";
import { Footer } from "@/components/features/shared/Footer";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair-display' });

export const metadata: Metadata = {
  title: "HireSignal | Command Center",
  description: "Advanced applicant tracking and opportunities matching engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        </head>
      <body className={`${inter.variable} ${playfair.variable} bg-background text-on-surface selection:bg-primary selection:text-on-primary`}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        {children}
        <Footer />
        </body>
    </html>
  );
}
