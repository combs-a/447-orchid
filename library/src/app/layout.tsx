import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orchid Library",
  description: "Library website for Team Orchid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className="antialiased text-black"
      >
        {children}
      </body>
    </html>
  );
}
