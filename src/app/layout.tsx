import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/ui/Navbar";
import { HomeButton } from "@/components/ui/HomeButton";
import { CartDrawer } from "@/components/ui/CartDrawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EFE6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <SmoothScrollProvider>
            <div className="grain-layer" aria-hidden />
            <CustomCursor />
            <Navbar />
            <HomeButton />
            <CartDrawer />
            {children}
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}
