"use client";
import { cn } from "@/lib/utils";

interface LikertScaleProps {
  code: string;
  label: string;
  description: string;
  value: number | undefined;
  onChange: (value: number) => void;
  error?: string;
}

const labels = ["Sangat Tidak Setuju", "", "", "Netral", "", "", "Sangat Setuju"];

export function LikertScale({ code, label, description, value, onChange, error }: LikertScaleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-2 mb-3">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded mt-0.5 shrink-0">
          {code}
        </span>
        <div>
          <p className="font-medium text-gray-800 text-sm">{label}</p>
          <p className="text-gray-500 text-xs mt-0.5 italic">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-xs text-gray-400 w-20 text-right hidden sm:block">
          {labels[0]}
        </span>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "w-9 h-9 rounded-full text-sm font-semibold border-2 transition-all",
              value === n
                ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-md"
                : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
            )}
          >
            {n}
          </button>
        ))}
        <span className="text-xs text-gray-400 w-20 hidden sm:block">
          {labels[6]}
        </span>
      </div>
      <div className="flex justify-between mt-1 sm:hidden px-1">
        <span className="text-xs text-gray-400">{labels[0]}</span>
        <span className="text-xs text-gray-400">{labels[6]}</span>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
