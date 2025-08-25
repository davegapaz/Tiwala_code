// src/app/layout.jsx
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Tiwala App",
  description: "Trust Engine Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster /> {/* ✅ Client Component rendered safely */}
        </Providers>
      </body>
    </html>
  );
}
