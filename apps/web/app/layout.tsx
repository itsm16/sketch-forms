import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { Toaster } from "~/components/ui/sonner";

const virgil = localFont({
  src: "./fonts/Virgil.woff2",
  variable: "--font-virgil",
});

export const metadata: Metadata = {
  title: "SketchForms",
  description: "Sketch a form, share a link, and collect responses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={virgil.className}>
        <GlobalProviders>
          {children}
          <Toaster />
        </GlobalProviders>
      </body>
    </html>
  );
}
