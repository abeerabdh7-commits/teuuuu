import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bakka Training Center | Administration",
  description: "Bakka Training Center administration dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
