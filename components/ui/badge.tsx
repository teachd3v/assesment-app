"use client";
import { cn } from "@/lib/utils";

const variants = {
  normal: "bg-emerald-100 text-emerald-800 border-emerald-200",
  underload: "bg-sky-100 text-sky-800 border-sky-200",
  "perlu perhatian": "bg-amber-100 text-amber-800 border-amber-200",
  "risiko burnout tinggi": "bg-red-100 text-red-800 border-red-200",
};

export function RiskBadge({ level }: { level: string }) {
  const key = level.toLowerCase() as keyof typeof variants;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[key] ?? "bg-gray-100 text-gray-800 border-gray-200"
      )}
    >
      {level}
    </span>
  );
}
