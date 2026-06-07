"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { href: "/", label: "ダッシュボード" },
  { href: "/today", label: "今日のアクション" },
  { href: "/opportunities", label: "案件候補" },
  { href: "/opportunities/new", label: "＋候補登録" },
  { href: "/opportunities/import", label: "インポート" },
  { href: "/products", label: "商品メニュー" },
  { href: "/settings", label: "プロフィール設定" },
];

const SECONDARY = [
  { href: "/leads", label: "リード(CSV)" },
  { href: "/upload", label: "CSV取込" },
  { href: "/templates", label: "テンプレート" },
];

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkCls = (href: string) =>
    `px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
      isActive(href)
        ? "bg-slate-900 text-white font-medium"
        : "text-slate-600 hover:bg-slate-200"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" className="font-bold text-slate-900 mr-2">
            営業エージェント
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-1">
          {PRIMARY.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)}>
              {l.label}
            </Link>
          ))}
          <span className="border-l border-slate-200 mx-1" />
          {SECONDARY.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
