import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og.png`;

  return {
    title: "A tiny birthday thing for Maulida",
    description: "A small handmade birthday story for Maulida Azizza Shizen.",
    openGraph: {
      title: "A tiny birthday thing for Maulida",
      description: "A small handmade birthday story for Maulida Azizza Shizen.",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: "A tiny birthday thing for Maulida",
      description: "A small handmade birthday story for Maulida Azizza Shizen.",
      images: [ogImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
