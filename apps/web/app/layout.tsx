
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const virgil = localFont({
  src: "./fonts/Virgil.woff2",
  variable: "--font-virgil",
});

export const metadata: Metadata = {
  title: "SketchForms",
  description: "Media Forwarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={virgil.className}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
