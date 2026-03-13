import type { Metadata } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import { LingoProvider } from "@lingo.dev/compiler/react";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aryan's Quest — The Road to Rebuild Nalanda",
  description:
    "An educational historical RPG set in 1203 AD. Travel across six Asian civilizations to rebuild the greatest center of learning in the ancient world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LingoProvider>
      <html lang="en">
        <body className={`${cinzel.variable} ${crimsonText.variable} antialiased`}>
          {children}
        </body>
      </html>
    </LingoProvider>
  );
}
