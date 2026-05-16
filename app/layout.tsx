import type { Metadata } from "next";
import "./globals.css";

import { Libre_Baskerville, Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import CustomCursor from "@/components/animations/CustomCursor";
import RouteTransitionProvider from "@/components/animations/RouteTransitionProvider";
import { ReportsProvider } from "@/context/ReportsContext";
import { cn } from "@/lib/utils";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TrendFashion Analytics",
  description: "Plataforma de análisis de tendencias de moda.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} ${libre.variable} font-sans`}>
        <ReportsProvider>
          <RouteTransitionProvider>
            <CustomCursor />
            <Navbar />
            {children}
          </RouteTransitionProvider>
        </ReportsProvider>
      </body>
    </html>
  );
}