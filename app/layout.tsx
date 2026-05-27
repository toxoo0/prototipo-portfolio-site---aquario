import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aquário — Portfolio",
  description: "Portfolio interativo experimental baseado em um aquário digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
