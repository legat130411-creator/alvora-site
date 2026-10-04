import type { Metadata } from "next";
import "@fontsource/fraunces/800.css";
import "@fontsource/familjen-grotesk/400.css";
import "@fontsource/familjen-grotesk/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alvora — Describe your idea. Get a tested bot.",
  description:
    "Describe a trading idea, see it tested on years of history, then run it on your own exchange account. Alvora cannot withdraw your funds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
