import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/layout/DashboardShell";
import { AppToaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard | Axis-Aura properities",
  description: "Axis-Aura Real Estate admin dashboard",
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
      <body className="min-h-full bg-white">
        <AuthProvider>
          <DashboardShell>{children}</DashboardShell>
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
