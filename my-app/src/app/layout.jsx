// src/app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { TiwalaProvider } from "@/context/TiwalaContext"; // Import your provider
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster for notifications

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tiwala App",
  description: "Community Lending Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire application with the TiwalaProvider */}
        <TiwalaProvider>
          {children}
          <Toaster /> {/* The Toaster should be inside the provider */}
        </TiwalaProvider>
      </body>
    </html>
  );
}