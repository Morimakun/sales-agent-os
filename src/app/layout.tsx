import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "半自動営業エージェント",
  description: "案件候補を登録し、AIが営業可能性の判定と文面作成を支援します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1">{children}</main>
      </body>
    </html>
  );
}
