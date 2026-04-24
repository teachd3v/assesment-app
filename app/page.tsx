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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
            <ClipboardList className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Workload Analysis (FTE)</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Pengukuran beban kerja objektif menggunakan metode <strong>Full-Time Equivalent (FTE)</strong>. Menganalisis korelasi antara <em>Task Volume</em>, <em>Duration</em>, dan <em>Frequency</em> untuk menentukan efisiensi alokasi SDM berdasarkan standar man-hours yang presisi.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Framework SDT & UWES</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Analisis psikometrik berbasis <strong>Self-Determination Theory</strong> (Deci & Ryan) dan <strong>Utrecht Work Engagement Scale</strong> (Schaufeli). Mengukur 12 indikator motivasi intrinsik dan keterikatan emosional untuk memetakan dorongan kinerja secara mendalam.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
            <Database className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Strategic Dashboard</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Visualisasi komprehensif menggunakan <strong>Multi-Factor Score Weighting</strong>. Mengintegrasikan data performa dan risiko <em>burnout</em> melalui Heatmap Departemen dan Radar Analysis untuk mendukung pengambilan keputusan manajerial yang akurat.
          </p>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="py-12 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center italic">Metodologi & Kalkulasi</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* WLA Logic */}
          <div className="bg-gray-50 rounded-3xl p-8">
            <h4 className="font-bold text-amber-700 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-[10px]">01</span>
              Workload (FTE) Logic
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 font-mono text-xs text-amber-900">
                Score = (Total Menit / 2400) × Difficulty_Multiplier
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Menghitung proporsi beban kerja per minggu (2.400 menit standar). Setiap tugas dibobot dengan <strong>Difficulty Multiplier</strong> (0.8x - 1.2x) berdasarkan kompleksitas tugas. Skor {">"} 1.3 mengindikasikan <em>Overload</em>.
              </p>
            </div>
          </div>

          {/* SDT Logic */}
          <div className="bg-indigo-50 rounded-3xl p-8">
            <h4 className="font-bold text-indigo-700 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center text-[10px]">02</span>
              Self-Determination Weighting
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-indigo-100">
                <span className="font-medium text-xs">Motivasi Intrinsik</span>
                <span className="text-indigo-600 font-bold">+30%</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-indigo-100">
                <span className="font-medium text-xs">Amotivasi (Ketidakjelasan Tujuan)</span>
                <span className="text-red-500 font-bold">-10%</span>
              </div>
              <p className="text-[12px] text-gray-500 italic mt-2">
                *Menggunakan pembobotan kontinum motivasi untuk membedakan dorongan internal vs tekanan eksternal.
              </p>
            </div>
          </div>

          {/* UWES Logic */}
          <div className="bg-teal-50 rounded-3xl p-8">
            <h4 className="font-bold text-teal-700 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center text-[10px]">03</span>
              Utrecht Work Engagement (UWES)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-white p-3 rounded-xl border border-teal-100">
                <p className="text-[10px] text-gray-400">Vigor</p>
                <p className="font-bold text-teal-600 text-xs">33.3%</p>
              </div>
              <div className="text-center bg-white p-3 rounded-xl border border-teal-100">
                <p className="text-[10px] text-gray-400">Dedication</p>
                <p className="font-bold text-teal-600 text-xs">33.3%</p>
              </div>
              <div className="text-center bg-white p-3 rounded-xl border border-teal-100">
                <p className="text-[10px] text-gray-400">Absorption</p>
                <p className="font-bold text-teal-600 text-xs">33.4%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Mengevaluasi tiga dimensi keterikatan kerja utama secara proporsional untuk mendapatkan <em>Engagement Index</em> yang komprehensif.
            </p>
          </div>

          {/* Risk Matrix */}
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
            <h4 className="font-bold text-red-700 flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-[10px]">04</span>
              Burnout Risk Matrix
            </h4>
            <ul className="text-xs space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full mt-1.5" />
                <span><strong>High Burnout:</strong> Terjadi jika FTE &gt; 1.3 DAN Indeks SDT &lt; 60%</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full mt-1.5" />
                <span><strong>Priority Warning:</strong> Intervensi segera jika efisiensi tinggi dibarengi motivasi rendah.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Setup info */}
      <div className="bg-gray-100 border border-gray-200 rounded-3xl p-8 text-center mt-12">
        <h3 className="font-bold text-gray-800 mb-2">Simulasi Database</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
          Gunakan endpoint seed untuk mengisi data karyawan simulasi ke database cloud Anda.
        </p>
        <div className="inline-block bg-white border border-gray-200 rounded-2xl px-6 py-3 font-mono text-xs text-indigo-600 shadow-sm">
          POST /api/seed
        </div>
      </div>
    </div>
  );
}
