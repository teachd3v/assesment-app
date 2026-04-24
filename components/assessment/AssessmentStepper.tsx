"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WLAForm } from "./WLAForm";
import { LikertScale } from "./LikertScale";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, AlertTriangle } from "lucide-react";

// ---------- Schema ----------
const wlaItemSchema = z.object({
  taskName: z.string().min(1, "Nama tugas wajib diisi"),
  duration: z.number().positive("Harus > 0"),
  frequency: z.number().positive("Harus > 0"),
  frequencyType: z.enum(["daily", "weekly", "monthly"]),
  difficultyScale: z.number().int().min(1).max(5),
});

const surveyResponseSchema = z.object({
  questionCode: z.string(),
  rawValue: z.number().int().min(1, "Wajib dipilih").max(7),
});

export const assessmentSchema = z.object({
  userId: z.number().int().positive("Pilih karyawan"),
  periodName: z.string().min(1, "Periode wajib diisi"),
  wlaItems: z.array(wlaItemSchema).min(1, "Minimal 1 tugas"),
  surveyResponses: z.array(surveyResponseSchema),
});

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;

// ---------- Rubrik questions ----------
const sdtQuestions = [
  { code: "S1", label: "Otonomi Kerja", description: "Saya memiliki kebebasan menentukan cara saya menyelesaikan pekerjaan." },
  { code: "S2", label: "Kompetensi", description: "Saya merasa sangat mampu menyelesaikan tugas-tugas saya." },
  { code: "S3", label: "Keterikatan Sosial", description: "Saya merasa menjadi bagian penting dari tim di tempat kerja." },
  { code: "S4", label: "Ketiadaan Niat", description: "Saya tidak tahu mengapa saya masih melakukan pekerjaan ini." },
  { code: "S5", label: "Motivasi Eksternal", description: "Saya bekerja keras agar tidak ditegur oleh atasan." },
  { code: "S6", label: "Motivasi Ego", description: "Saya merasa bersalah jika tidak menyelesaikan pekerjaan tepat waktu." },
  { code: "S7", label: "Kesadaran Nilai", description: "Pekerjaan ini penting untuk mencapai tujuan karir saya." },
  { code: "S8", label: "Identitas Diri", description: "Pekerjaan ini mencerminkan siapa diri saya sebenarnya." },
  { code: "S9", label: "Motivasi Intrinsik", description: "Saya sangat menikmati proses mengerjakan tugas-tugas saya." },
];

const uwesQuestions = [
  { code: "U1", label: "Semangat & Energi", description: "Saat sedang bekerja, saya merasa penuh dengan energi." },
  { code: "U2", label: "Dedikasi", description: "Saya merasa bangga dengan pekerjaan yang saya lakukan." },
  { code: "U3", label: "Fokus & Flow", description: "Saya sering lupa waktu saat sedang asyik bekerja." },
];

const allQuestions = [...sdtQuestions, ...uwesQuestions];

interface User {
  id: number;
  name: string;
  department: { name: string };
}

interface ScoreResult {
  fte: number;
  sdtIndex: number;
  uwesIndex: number;
  riskLevel: string;
  interpretation: { wla: string; sdt: string; uwes: string };
}

const STEPS = ["Identitas", "Beban Kerja (WLA)", "Psikologis (SDT & UWES)", "Selesai"];

export function AssessmentStepper() {
  const [step, setStep] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      userId: undefined,
      periodName: `Minggu ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`,
      wlaItems: [{ taskName: "", duration: 30, frequency: 1, frequencyType: "weekly", difficultyScale: 3 }],
      surveyResponses: allQuestions.map((q) => ({ questionCode: q.code, rawValue: 0 })),
    },
  });

  const surveyResponses = watch("surveyResponses");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  const onSubmit = async (data: AssessmentFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json.error));
      setResult(json.scores);
      setIsConfirmOpen(false); // Tutup modal setelah berhasil
      setStep(3);
    } catch (e) {
      alert("Gagal menyimpan: " + String(e));
    } finally {
      setLoading(false);
    }
  };

  const setLikertValue = (code: string, value: number) => {
    const idx = allQuestions.findIndex((q) => q.code === code);
    if (idx >= 0) setValue(`surveyResponses.${idx}.rawValue`, value, { shouldValidate: true });
  };

  const getLikertValue = (code: string) =>
    surveyResponses?.find((r) => r.questionCode === code)?.rawValue || 0;

  const handlePreSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      setIsConfirmOpen(true);
    } else {
      // Cari error pertama buat dikasih tau ke user
      console.log("Validation Errors:", errors);
      alert("Mohon lengkapi semua pertanyaan dan data sebelum mengirim.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Modal Konfirmasi Premium */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Kirim Asesmen?</h3>
            <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
              Pastikan semua data sudah benar dan diisi sesuai dengan kondisi riil Anda saat ini.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="flex-1 px-4 py-4 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper indicator */}
      <div className="flex items-center mb-8">
        {STEPS.slice(0, 3).map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
              i < step ? "bg-indigo-600 text-white" : i === step ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-400" : "bg-gray-100 text-gray-400"
            }`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <p className={`ml-2 text-xs font-medium hidden sm:block ${i === step ? "text-indigo-700" : "text-gray-400"}`}>{label}</p>
            {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-indigo-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Step 0: Identitas */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Identitas & Periode</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan</label>
              <select
                {...register("userId", { valueAsNumber: true })}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white ${
                  errors.userId ? "border-red-300 ring-red-100 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-300"
                }`}
              >
                <option value="">-- Pilih Karyawan --</option>
                {Array.isArray(users) && users.filter((u) => u.department).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.department.name}
                  </option>
                ))}
              </select>
              {errors.userId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.userId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode Asesmen</label>
              <input
                {...register("periodName")}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                  errors.periodName ? "border-red-300 ring-red-100 focus:ring-red-300" : "border-gray-200 focus:ring-indigo-300"
                }`}
              />
              {errors.periodName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.periodName.message}</p>}
            </div>
          </div>
        )}

        {/* Step 1: WLA */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Workload Analysis</h2>
            <p className="text-sm text-gray-500 mb-4">Daftarkan semua pekerjaan Anda dalam satu periode.</p>
            <WLAForm control={control} errors={errors} />
          </div>
        )}

        {/* Step 2: SDT + UWES */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800">Penilaian Psikologis</h2>
              {errors.surveyResponses && (
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold animate-pulse">
                  ADA PERTANYAAN BELUM TERISI
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-6">Pilih angka yang paling mencerminkan kondisi Anda saat ini (1 = Sangat Tidak Setuju, 7 = Sangat Setuju).</p>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-indigo-700 mb-3 uppercase tracking-widest">Self-Determination Theory (SDT)</h3>
              {sdtQuestions.map((q) => (
                <LikertScale
                  key={q.code}
                  code={q.code}
                  label={q.label}
                  description={q.description}
                  value={getLikertValue(q.code) || undefined}
                  onChange={(v) => setLikertValue(q.code, v)}
                />
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xs font-bold text-teal-700 mb-3 uppercase tracking-widest">Work Engagement (UWES)</h3>
              {uwesQuestions.map((q) => (
                <LikertScale
                  key={q.code}
                  code={q.code}
                  label={q.label}
                  description={q.description}
                  value={getLikertValue(q.code) || undefined}
                  onChange={(v) => setLikertValue(q.code, v)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Hasil */}
        {step === 3 && result && (
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Asesmen Selesai!</h2>
            <p className="text-gray-500 text-sm mb-6">Terima kasih, data Anda telah tersimpan.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">FTE Score</p>
                <p className="text-2xl font-black text-gray-800">{result.fte.toFixed(2)}</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">{result.interpretation.wla.split("—")[0]}</p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">SDT Index</p>
                <p className="text-2xl font-black text-indigo-700">{result.sdtIndex.toFixed(1)}%</p>
                <p className="text-[10px] text-indigo-500 mt-1 leading-tight">{result.interpretation.sdt}</p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1">UWES Index</p>
                <p className="text-2xl font-black text-teal-700">{result.uwesIndex.toFixed(1)}%</p>
                <p className="text-[10px] text-teal-500 mt-1 leading-tight">{result.interpretation.uwes}</p>
              </div>
            </div>

            <div className={`p-5 rounded-2xl mb-8 border-2 ${
              result.riskLevel === "Risiko Burnout Tinggi" ? "bg-red-50 border-red-100 text-red-700" :
              result.riskLevel === "Perlu Perhatian" ? "bg-amber-50 border-amber-100 text-amber-700" :
              "bg-emerald-50 border-emerald-100 text-emerald-700"
            }`}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Kesimpulan</p>
              <p className="text-lg font-black">{result.riskLevel}</p>
            </div>

            <a href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white w-full py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]">
              Lihat Dashboard Analitik <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-800 font-bold text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
            ) : <div />}

            {step < 2 ? (
              <button
                type="button"
                onClick={async () => {
                   const fieldToValidate = step === 0 ? ["userId", "periodName"] : ["wlaItems"];
                   const result = await trigger(fieldToValidate as any);
                   if (result) setStep(step + 1);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 text-sm"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePreSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-100 active:scale-95 text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim Asesmen"}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
