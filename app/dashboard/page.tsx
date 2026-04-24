"use client";
import { useEffect, useState } from "react";
import { AnalysisRadar } from "@/components/charts/AnalysisRadar";
import { WorkloadScatterPlot } from "@/components/charts/ScatterPlot";
import { DepartmentHeatmap } from "@/components/charts/DepartmentHeatmap";
import { RiskBadge } from "@/components/ui/badge";
import { Users, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";

interface AssessmentLog {
  id: number;
  userId: number;
  periodName: string;
  finalFteScore: number;
  finalSdtIndex: number;
  finalUwesIndex: number;
  riskLevel: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    department: { name: string };
  };
  surveyResponses: { questionCode: string; rawValue: number }[];
  wlaItems: { taskName: string; duration: number; frequency: number; frequencyType: string; difficultyScale: number }[];
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<AssessmentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AssessmentLog | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/assessment")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // Hitung statistik agregat per departemen
  const deptMap = new Map<string, { ftes: number[]; sdts: number[]; uwes: number[]; risks: number }>();
  logs.forEach((log) => {
    const dept = log.user?.department?.name ?? "Unknown";
    if (!deptMap.has(dept)) deptMap.set(dept, { ftes: [], sdts: [], uwes: [], risks: 0 });
    const d = deptMap.get(dept)!;
    d.ftes.push(log.finalFteScore);
    d.sdts.push(log.finalSdtIndex);
    d.uwes.push(log.finalUwesIndex);
    if (log.riskLevel === "Risiko Burnout Tinggi") d.risks++;
  });

  const deptData = Array.from(deptMap.entries()).map(([dept, d]) => ({
    department: dept,
    avgFte: d.ftes.reduce((a, b) => a + b, 0) / d.ftes.length,
    avgSdt: d.sdts.reduce((a, b) => a + b, 0) / d.sdts.length,
    avgUwes: d.uwes.reduce((a, b) => a + b, 0) / d.uwes.length,
    count: d.ftes.length,
    riskCount: d.risks,
  }));

  const scatterData = logs.map((log) => ({
    name: log.user?.name ?? "Unknown",
    sdt: log.finalSdtIndex,
    fte: log.finalFteScore,
    department: log.user?.department?.name ?? "Unknown",
  }));

  const avgFte = logs.length > 0 ? logs.reduce((s, l) => s + l.finalFteScore, 0) / logs.length : 0;
  const avgSdt = logs.length > 0 ? logs.reduce((s, l) => s + l.finalSdtIndex, 0) / logs.length : 0;
  const burnoutCount = logs.filter((l) => l.riskLevel === "Risiko Burnout Tinggi").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Manajemen</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview kesehatan kerja seluruh karyawan</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-indigo-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">Memuat data...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 mb-4">Belum ada data asesmen.</p>
          <p className="text-sm text-gray-400">
            Seed database dulu via{" "}
            <code className="bg-gray-100 px-1 rounded">POST /api/seed</code>
            {" "}lalu isi asesmen di halaman{" "}
            <a href="/assessment" className="text-indigo-600 underline">/assessment</a>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Users className="w-3.5 h-3.5" /> Total Asesmen
              </div>
              <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> Rata-rata FTE
              </div>
              <p className={`text-2xl font-bold ${avgFte > 1.3 ? "text-red-600" : avgFte >= 1.0 ? "text-emerald-600" : "text-sky-600"}`}>
                {avgFte.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5" /> Rata-rata SDT
              </div>
              <p className={`text-2xl font-bold ${avgSdt >= 75 ? "text-emerald-600" : avgSdt >= 50 ? "text-amber-600" : "text-red-600"}`}>
                {avgSdt.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Risiko Burnout
              </div>
              <p className={`text-2xl font-bold ${burnoutCount > 0 ? "text-red-600" : "text-gray-800"}`}>
                {burnoutCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scatter plot */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-1 text-sm">Peta Posisi Karyawan</h2>
              <p className="text-xs text-gray-400 mb-4">FTE vs SDT — zona merah = risiko burnout</p>
              <WorkloadScatterPlot data={scatterData} />
            </div>

            {/* Radar for selected employee */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-1 text-sm">Profil SDT Karyawan</h2>
              <div className="flex items-center gap-2 mb-4">
                <select
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  value={selected?.id ?? ""}
                  onChange={(e) => {
                    const log = logs.find((l) => l.id === Number(e.target.value));
                    setSelected(log ?? null);
                  }}
                >
                  {logs.map((log) => (
                    <option key={log.id} value={log.id}>
                      {log.user?.name} — {log.periodName}
                    </option>
                  ))}
                </select>
              </div>
              {selected && <AnalysisRadar surveyResponses={selected.surveyResponses} />}
            </div>
          </div>

          {/* Heatmap departemen */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-1 text-sm">Heatmap per Departemen</h2>
            <p className="text-xs text-gray-400 mb-4">Merah = overload / SDT rendah, Hijau = normal</p>
            <DepartmentHeatmap data={deptData} />
          </div>

          {/* Data table */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4 text-sm">Riwayat Asesmen</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="text-left pb-2 pr-4 font-semibold">Karyawan</th>
                    <th className="text-left pb-2 pr-4 font-semibold">Departemen</th>
                    <th className="text-left pb-2 pr-4 font-semibold">Periode</th>
                    <th className="text-center pb-2 px-3 font-semibold">FTE</th>
                    <th className="text-center pb-2 px-3 font-semibold">SDT</th>
                    <th className="text-center pb-2 px-3 font-semibold">UWES</th>
                    <th className="text-center pb-2 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-800">{log.user?.name}</td>
                      <td className="py-3 pr-4 text-gray-500">{log.user?.department?.name}</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{log.periodName}</td>
                      <td className="py-3 px-3 text-center font-mono text-xs">
                        <span className={`font-bold ${log.finalFteScore > 1.3 ? "text-red-600" : log.finalFteScore >= 1.0 ? "text-emerald-600" : "text-sky-600"}`}>
                          {log.finalFteScore.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-xs font-mono">
                        <span className={`font-bold ${log.finalSdtIndex >= 75 ? "text-emerald-600" : log.finalSdtIndex >= 50 ? "text-amber-600" : "text-red-600"}`}>
                          {log.finalSdtIndex.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-xs font-mono">
                        <span className={`font-bold ${log.finalUwesIndex >= 75 ? "text-emerald-600" : log.finalUwesIndex >= 50 ? "text-amber-600" : "text-red-600"}`}>
                          {log.finalUwesIndex.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <RiskBadge level={log.riskLevel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
