import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KMap Executer | High Performance Karnaugh Map Solver",
  description: "Advanced interactive logic simplification tool for digital electronics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-black text-slate-50 antialiased selection:bg-orange-500/30`}>
        {children}
      </body>
    </html>
  );
}
