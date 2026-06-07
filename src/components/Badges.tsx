import { PRIORITY_LABELS } from "@/lib/constants";

export function PriorityBadge({ priority }: { priority: string }) {
  const cls: Record<string, string> = {
    A: "bg-red-100 text-red-700",
    B: "bg-amber-100 text-amber-700",
    C: "bg-slate-100 text-slate-600",
    unknown: "bg-slate-100 text-slate-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls[priority] || cls.unknown}`}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100">
      {label}
    </span>
  );
}

export function RiskBadge({ level }: { level: string }) {
  if (!level) return null;
  const cls: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };
  const label: Record<string, string> = { low: "リスク低", medium: "リスク中", high: "リスク高" };
  return <span className={`px-2 py-0.5 rounded text-xs ${cls[level] || ""}`}>{label[level] || level}</span>;
}
