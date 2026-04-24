import { ClipboardList, BarChart3, Database, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          Employee Wellbeing & Assessment System
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          HERIS Assessment Module
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Ukur beban kerja, motivasi, dan keterikatan karyawan secara ilmiah menggunakan
          framework <strong>WLA</strong>, <strong>SDT</strong>, dan <strong>UWES</strong>.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/assessment"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Mulai Asesmen <ChevronRight className="w-4 h-4" />
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Lihat Dashboard
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <ClipboardList className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Workload Analysis</h3>
          <p className="text-sm text-gray-500">
            Hitung FTE secara akurat berdasarkan volume, durasi, frekuensi, dan tingkat kesulitan tugas.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">SDT & UWES</h3>
          <p className="text-sm text-gray-500">
            Deteksi motivasi intrinsik dan keterikatan kerja melalui skala psikologis yang terstandarisasi.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
            <Database className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">Dashboard Strategis</h3>
          <p className="text-sm text-gray-500">
            Radar chart, scatter plot, dan heatmap departemen untuk pengambilan keputusan berbasis data.
          </p>
        </div>
      </div>

      {/* Setup info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-800 mb-2">Setup Awal</h3>
        <p className="text-sm text-amber-700 mb-3">
          Untuk mulai, seed database terlebih dahulu dengan data karyawan contoh:
        </p>
        <code className="block bg-amber-100 text-amber-900 text-xs px-4 py-3 rounded-lg font-mono">
          POST /api/seed
        </code>
      </div>
    </div>
  );
}
