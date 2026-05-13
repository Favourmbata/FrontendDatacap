
import type { Metadata } from "next";
import React from "react";
import { AuthProvider } from "@/AuthContext";
import TanstackProvider from "../../providers/TankstackProvider";
import { Toaster } from "./components/ui/toaster";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";

export const metadata: Metadata = {
  title: "Vestradat",
  description: "Vestradat",
  icons: {
    icon: "/assets/vetra.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TanstackProvider>
            <NotificationProvider>
              <main>{children}</main>
              <Toaster />
            </NotificationProvider>
          </TanstackProvider>
        </AuthProvider>
        <script
          src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"
          async
        ></script>
      </body>
    </html>
  );
}