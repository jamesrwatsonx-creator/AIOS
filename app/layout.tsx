import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "James AI Operator Dashboard",
  description: "Local-first Egyptian AI Operator OS shell"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
