"use client";
import { useFieldArray, useWatch, Control, FieldErrors } from "react-hook-form";
import { AssessmentFormValues } from "./AssessmentStepper";
import { cn } from "@/lib/utils";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

interface WLAFormProps {
  control: Control<AssessmentFormValues>;
  errors: FieldErrors<AssessmentFormValues>;
}

const STANDARD_MINUTES = 2400;
const DIFFICULTY_LABELS = ["", "Sangat Mudah", "Mudah", "Normal", "Sulit", "Sangat Sulit"];
const DIFFICULTY_MULTIPLIER: Record<number, number> = { 1: 0.8, 2: 0.9, 3: 1.0, 4: 1.1, 5: 1.2 };

export function WLAForm({ control, errors }: WLAFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "wlaItems",
  });

  const wlaItems = useWatch({ control, name: "wlaItems" }) ?? [];

  // Hitung FTE live
  const totalMinutes = wlaItems.reduce((sum: number, item: AssessmentFormValues["wlaItems"][0]) => {
    const freq = Number(item.frequency) || 0;
    const dur = Number(item.duration) || 0;
    const weekly = item.frequencyType === "daily" ? freq * 5 : item.frequencyType === "monthly" ? freq / 4 : freq;
    return sum + dur * weekly;
  }, 0);
  const avgMult =
    wlaItems.length > 0
      ? wlaItems.reduce((s: number, it: AssessmentFormValues["wlaItems"][0]) => s + (DIFFICULTY_MULTIPLIER[Number(it.difficultyScale)] ?? 1), 0) / wlaItems.length
      : 1;
  const liveFTE = wlaItems.length > 0 ? (totalMinutes / STANDARD_MINUTES) * avgMult : 0;

  return (
    <div>
      <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
        <p className="text-xs text-indigo-600 font-medium">
          Daftar semua tugas rutin dan insidental Anda selama satu minggu kerja.
        </p>
      </div>

      {/* Live FTE preview */}
      {wlaItems.length > 0 && (
        <div className={cn(
          "mb-4 p-3 rounded-lg border flex items-center justify-between",
          liveFTE > 1.3 ? "bg-red-50 border-red-200" : liveFTE < 1.0 ? "bg-sky-50 border-sky-200" : "bg-emerald-50 border-emerald-200"
        )}>
          <div>
            <p className="text-xs text-gray-500 font-medium">Estimasi FTE saat ini</p>
            <p className={cn(
              "text-xl font-bold",
              liveFTE > 1.3 ? "text-red-600" : liveFTE < 1.0 ? "text-sky-600" : "text-emerald-600"
            )}>{liveFTE.toFixed(2)}</p>
          </div>
          <div className="text-right">
            {liveFTE > 1.3 && (
              <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                <AlertTriangle className="w-3 h-3" /> Overload
              </span>
            )}
            {liveFTE <= 1.3 && liveFTE >= 1.0 && <span className="text-emerald-600 text-xs font-medium">Normal</span>}
            {liveFTE < 1.0 && liveFTE > 0 && <span className="text-sky-600 text-xs font-medium">Underload</span>}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400">Tugas #{index + 1}</span>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Nama tugas */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama Tugas</label>
                <input
                  {...control.register(`wlaItems.${index}.taskName`)}
                  placeholder="Contoh: Membuat laporan mingguan"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                {errors.wlaItems?.[index]?.taskName && (
                  <p className="text-red-500 text-xs mt-1">{errors.wlaItems[index]?.taskName?.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Durasi */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Durasi (menit)</label>
                  <input
                    type="number"
                    min={1}
                    {...control.register(`wlaItems.${index}.duration`, { valueAsNumber: true })}
                    placeholder="60"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                {/* Frekuensi */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Frekuensi</label>
                  <input
                    type="number"
                    min={1}
                    {...control.register(`wlaItems.${index}.frequency`, { valueAsNumber: true })}
                    placeholder="1"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                {/* Tipe frekuensi */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Per</label>
                  <select
                    {...control.register(`wlaItems.${index}.frequencyType`)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    <option value="daily">Hari</option>
                    <option value="weekly">Minggu</option>
                    <option value="monthly">Bulan</option>
                  </select>
                </div>
              </div>

              {/* Tingkat kesulitan */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Tingkat Kesulitan:{" "}
                  <span className="text-indigo-600">
                    {DIFFICULTY_LABELS[Number(wlaItems[index]?.difficultyScale) || 3]}
                  </span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  {...control.register(`wlaItems.${index}.difficultyScale`, { valueAsNumber: true })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>Sangat Mudah</span>
                  <span>Sangat Sulit</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          append({ taskName: "", duration: 30, frequency: 1, frequencyType: "weekly", difficultyScale: 3 })
        }
        className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-200 rounded-xl py-3 text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Tambah Tugas
      </button>
    </div>
  );
}
