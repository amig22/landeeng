import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LandeEng — Genera landing page con AI",
  description: "Genera landing page HTML professionali a partire dalla descrizione della tua attività aziendale, powered by Claude AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
