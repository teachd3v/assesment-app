"use client";
import { cn } from "@/lib/utils";

interface DeptData {
  department: string;
  avgFte: number;
  avgSdt: number;
  avgUwes: number;
  count: number;
  riskCount: number;
}

interface DepartmentHeatmapProps {
  data: DeptData[];
}

function FTECell({ value }: { value: number }) {
  const color =
    value > 1.3 ? "bg-red-100 text-red-800" :
    value >= 1.0 ? "bg-emerald-100 text-emerald-800" :
    "bg-sky-100 text-sky-800";
  return <span className={cn("px-2 py-0.5 rounded text-xs font-bold", color)}>{value.toFixed(2)}</span>;
}

function PctCell({ value }: { value: number }) {
  const color =
    value >= 75 ? "bg-emerald-100 text-emerald-800" :
    value >= 50 ? "bg-amber-100 text-amber-800" :
    "bg-red-100 text-red-800";
  return <span className={cn("px-2 py-0.5 rounded text-xs font-bold", color)}>{value.toFixed(1)}%</span>;
}

export function DepartmentHeatmap({ data }: DepartmentHeatmapProps) {
  if (!data.length) {
    return <p className="text-sm text-gray-400 text-center py-8">Belum ada data asesmen.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">Departemen</th>
            <th className="text-center text-xs font-semibold text-gray-500 pb-2 px-3">FTE Rata-rata</th>
            <th className="text-center text-xs font-semibold text-gray-500 pb-2 px-3">SDT Index</th>
            <th className="text-center text-xs font-semibold text-gray-500 pb-2 px-3">UWES Index</th>
            <th className="text-center text-xs font-semibold text-gray-500 pb-2 px-3">Karyawan</th>
            <th className="text-center text-xs font-semibold text-gray-500 pb-2 px-3">Risiko Burnout</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row) => (
            <tr key={row.department} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4 font-medium text-gray-800">{row.department}</td>
              <td className="py-3 px-3 text-center"><FTECell value={row.avgFte} /></td>
              <td className="py-3 px-3 text-center"><PctCell value={row.avgSdt} /></td>
              <td className="py-3 px-3 text-center"><PctCell value={row.avgUwes} /></td>
              <td className="py-3 px-3 text-center text-gray-600">{row.count}</td>
              <td className="py-3 px-3 text-center">
                {row.riskCount > 0 ? (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                    {row.riskCount} orang
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
