import type { Metadata } from "next";
import { Toaster } from "sonner";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axis-Aura Properties",
  description:
    "Discover a curated collection of premium properties in prime locations.",
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="relative flex min-h-full flex-col">
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-right" richColors closeButton duration={3500} />
      </body>
    </html>
  );
}
