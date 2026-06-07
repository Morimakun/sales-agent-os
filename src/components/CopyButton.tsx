"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "コピー",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // フォールバック
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }}
      className={`px-2.5 py-1 text-xs rounded-md border border-slate-300 bg-white hover:bg-slate-100 ${className}`}
    >
      {copied ? "コピー済み ✓" : label}
    </button>
  );
}
