// ============================================================
// SCORING ENGINE — implementasi dari scoring-logic.md
// ============================================================

export interface WlaItemInput {
  taskName: string;
  duration: number;       // menit per tugas
  frequency: number;      // angka frekuensi
  frequencyType: "daily" | "weekly" | "monthly";
  difficultyScale: number; // 1-5
}

export interface SurveyInput {
  questionCode: string;   // S1-S9, U1-U3
  rawValue: number;       // 1-7
}

export interface ScoreResult {
  fte: number;
  sdtIndex: number;
  uwesIndex: number;
  riskLevel: string;
  interpretation: {
    wla: string;
    sdt: string;
    uwes: string;
  };
}

const DIFFICULTY_MULTIPLIER: Record<number, number> = {
  1: 0.8,
  2: 0.9,
  3: 1.0,
  4: 1.1,
  5: 1.2,
};

// Standar: 40 jam/minggu = 2400 menit
const STANDARD_WORK_MINUTES = 2400;

// Konversi frekuensi ke per-minggu
function toWeeklyFrequency(frequency: number, type: string): number {
  if (type === "daily") return frequency * 5;   // 5 hari kerja
  if (type === "weekly") return frequency;
  if (type === "monthly") return frequency / 4;
  return frequency;
}

// --- WLA / FTE ---
export function calculateFTE(items: WlaItemInput[]): number {
  if (items.length === 0) return 0;

  const totalMinutes = items.reduce((sum, item) => {
    const weeklyFreq = toWeeklyFrequency(item.frequency, item.frequencyType);
    return sum + item.duration * weeklyFreq;
  }, 0);

  const avgDifficulty =
    items.reduce((sum, item) => {
      return sum + (DIFFICULTY_MULTIPLIER[item.difficultyScale] ?? 1.0);
    }, 0) / items.length;

  return (totalMinutes / STANDARD_WORK_MINUTES) * avgDifficulty;
}

// --- SDT Index ---
const SDT_WEIGHTS: Record<string, number> = {
  S1: 13.3,  // Autonomy
  S2: 13.3,  // Competence
  S3: 13.4,  // Relatedness
  S4: -10.0, // Amotivation (penalty)
  S5: 0.0,   // External Motivation (netral)
  S6: 5.0,   // Introjected Motivation
  S7: 15.0,  // Identified Motivation
  S8: 20.0,  // Integrated Motivation
  S9: 30.0,  // Intrinsic Motivation
};

export function calculateSDT(responses: SurveyInput[]): number {
  const sdtResponses = responses.filter((r) => r.questionCode.startsWith("S"));
  const total = sdtResponses.reduce((sum, r) => {
    const weight = SDT_WEIGHTS[r.questionCode] ?? 0;
    return sum + (r.rawValue / 7) * weight;
  }, 0);
  return Math.max(0, Math.min(100, total)); // clamp 0-100
}

// --- UWES Index ---
const UWES_WEIGHTS: Record<string, number> = {
  U1: 33.3,  // Vigor
  U2: 33.3,  // Dedication
  U3: 33.4,  // Absorption
};

export function calculateUWES(responses: SurveyInput[]): number {
  const uwesResponses = responses.filter((r) => r.questionCode.startsWith("U"));
  const total = uwesResponses.reduce((sum, r) => {
    const weight = UWES_WEIGHTS[r.questionCode] ?? 0;
    return sum + (r.rawValue / 7) * weight;
  }, 0);
  return Math.max(0, Math.min(100, total));
}

// --- Risk Level (Decision Support) ---
export function getRiskLevel(fte: number, sdt: number, uwes: number): string {
  if (fte > 1.3 && sdt < 60) return "Risiko Burnout Tinggi";
  if (fte > 1.3 || sdt < 50) return "Perlu Perhatian";
  if (fte < 0.7) return "Underload";
  return "Normal";
}

export function getInterpretation(fte: number, sdt: number, uwes: number) {
  return {
    wla:
      fte < 1.0
        ? "Underload — beban kerja di bawah kapasitas"
        : fte <= 1.3
        ? "Normal — beban kerja ideal"
        : "Overload — beban kerja melebihi batas",
    sdt:
      sdt >= 75
        ? "Motivasi tinggi"
        : sdt >= 50
        ? "Motivasi sedang"
        : "Motivasi rendah — perlu intervensi",
    uwes:
      uwes >= 75
        ? "Keterikatan kerja tinggi"
        : uwes >= 50
        ? "Keterikatan kerja sedang"
        : "Keterikatan kerja rendah",
  };
}

export function runScoringEngine(
  wlaItems: WlaItemInput[],
  surveyResponses: SurveyInput[]
): ScoreResult {
  const fte = calculateFTE(wlaItems);
  const sdt = calculateSDT(surveyResponses);
  const uwes = calculateUWES(surveyResponses);
  const riskLevel = getRiskLevel(fte, sdt, uwes);
  const interpretation = getInterpretation(fte, sdt, uwes);

  return { fte, sdtIndex: sdt, uwesIndex: uwes, riskLevel, interpretation };
}
